import TryCatch from "../utils/TryCatch.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import kmeans from "node-kmeans";

export const getSalesCluster = TryCatch(async (req, res) => {
  console.log("[getSalesCluster] Route HIT");

  // Validasi hanya admin
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Anda bukan admin" });
  }

  // Ambil parameter tahun dan bulan dari query
  const { year, month } = req.query;

  const match = {
    status: "Dibayar",
    paidAt: { $exists: true },
  };

  if (year) {
    match.paidAt = {
      ...match.paidAt,
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31T23:59:59.999Z`),
    };
  }

  if (month) {
    const m = Number(month) - 1;
    match.paidAt = {
      ...match.paidAt,
      $gte: new Date(year, m, 1),
      $lte: new Date(year, m + 1, 0, 23, 59, 59, 999),
    };
  }

  const paidOrders = await Order.find(match).populate("items.product");

  const productSalesMap = new Map();

  paidOrders.forEach(order => {
    order.items.forEach(item => {
      const id = item.product._id.toString();
      const found = productSalesMap.get(id) || {
        _id: item.product._id,
        title: item.product.title,
        stock: item.product.stock,
        totalSold: 0,
      };
      found.totalSold += item.quantity;
      productSalesMap.set(id, found);
    });
  });

  const productSales = Array.from(productSalesMap.values());

  const allProducts = await Product.find();

  const unsoldProducts = allProducts
    .filter(p => !productSalesMap.has(p._id.toString()))
    .map(p => ({
      id: p._id,
      title: p.title,
      stock: p.stock,
      sold: 0,
      soldPercentage: "0%",
    }));

  if (productSales.length === 0) {
    return res.json({
      clustered: [
        {
          cluster: 3,
          label: "Tidak Laku",
          size: unsoldProducts.length,
          products: unsoldProducts,
        },
      ],
      stats: {
        totalProducts: unsoldProducts.length,
        clusterPercentages: [
          {
            label: "Tidak Laku",
            size: unsoldProducts.length,
            percentage: 100,
          },
        ],
      },
    });
  }

  // Buat vektor dari persentase penjualan
  const vectors = productSales.map(p => {
    const stock = p.stock || 1;
    const percentSold = (p.totalSold / stock) * 100;
    return [percentSold];
  });

  const K = Math.min(3, vectors.length);

  if (vectors.length < 2) {
    return res.json({
      clustered: [
        {
          cluster: 3,
          label: "Tidak Laku",
          size: productSales.length + unsoldProducts.length,
          products: [
            ...productSales.map(p => ({
              id: p._id,
              title: p.title,
              stock: p.stock,
              sold: p.totalSold,
              soldPercentage: ((p.totalSold / (p.stock || 1)) * 100).toFixed(2) + "%",
            })),
            ...unsoldProducts,
          ],
        },
      ],
      stats: {
        totalProducts: productSales.length + unsoldProducts.length,
        clusterPercentages: [
          {
            label: "Tidak Laku",
            size: productSales.length + unsoldProducts.length,
            percentage: 100,
          },
        ],
      },
    });
  }

  kmeans.clusterize(vectors, { k: K }, (err, result) => {
    if (err) {
      console.error("[getSalesCluster] Clustering failed:", err);
      return res.status(500).json({ message: err.message });
    }

    const clustersWithAverage = result.map((cluster, i) => {
      const avg = cluster.clusterInd.reduce(
        (sum, idx) => {
          const p = productSales[idx];
          return sum + (p.totalSold / (p.stock || 1)) * 100;
        },
        0
      ) / cluster.clusterInd.length;

      return {
        cluster: i + 1,
        avgSold: avg,
        clusterInd: cluster.clusterInd,
      };
    });

    clustersWithAverage.sort((a, b) => b.avgSold - a.avgSold);

    const labels = ["Laris", "Sedang", "Tidak Laku"];

    const clustered = clustersWithAverage.map((clusterWithAvg, i) => ({
      cluster: clusterWithAvg.cluster,
      label: labels[i] || `Cluster ${i + 1}`,
      size: clusterWithAvg.clusterInd.length,
      products: clusterWithAvg.clusterInd.map(idx => {
        const p = productSales[idx];
        const percent = (p.totalSold / (p.stock || 1)) * 100;
        return {
          id: p._id,
          title: p.title,
          sold: p.totalSold,
          stock: p.stock,
          soldPercentage: percent.toFixed(2) + "%",
        };
      }),
    }));

    const clusterTidakLaku = clustered.find(c => c.label === "Tidak Laku");
    if (clusterTidakLaku) {
      clusterTidakLaku.products.push(...unsoldProducts);
      clusterTidakLaku.size += unsoldProducts.length;
    } else {
      clustered.push({
        cluster: 3,
        label: "Tidak Laku",
        size: unsoldProducts.length,
        products: unsoldProducts,
      });
    }

    const total = clustered.reduce((sum, c) => sum + c.size, 0);
    const clusterPercentages = clustered.map(cl => ({
      label: cl.label,
      size: cl.size,
      percentage: ((cl.size / total) * 100).toFixed(2),
    }));

    res.json({
      clustered,
      stats: {
        totalProducts: total,
        clusterPercentages,
      },
    });
  });
});
