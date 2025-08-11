import TryCatch from "../utils/TryCatch.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js"; 
import kmeans from "node-kmeans";

// Fungsi untuk mengambil cluster penjualan menggunakan algoritma K-Means
export const getSalesCluster = TryCatch(async (req, res) => {
  console.log("[getSalesCluster] Route HIT");

 // Validasi hanya admin yang bisa mengakses
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Anda bukan admin" });
  }

  // Ambil parameter tahun dan bulan dari query
  const { year, month } = req.query;

   // Buat filter pencarian order yang sudah dibayar
  const match = {
    status: "Dibayar",
    paidAt: { $exists: true },
  };

  // Jika parameter tahun diberikan, filter berdasarkan tahun
  if (year) {
    match.paidAt = {
      ...match.paidAt,
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31T23:59:59.999Z`),
    };
  }

  // Jika parameter bulan juga diberikan, filter berdasarkan bulan tertentu
  if (month) {
    const m = Number(month) - 1;
    match.paidAt = {
      ...match.paidAt,
      $gte: new Date(year, m, 1),
      $lte: new Date(year, m + 1, 0, 23, 59, 59, 999),
    };
  }

  // Ambil semua order yang sesuai dengan filter dan isi produk
  const paidOrders = await Order.find(match).populate("items.product");

  // Map untuk mengelompokkan produk dan total terjualnya
  const productSalesMap = new Map();

  // Hitung total penjualan per produk
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

  // Ubah Map menjadi array produk dengan total penjualan
  const productSales = Array.from(productSalesMap.values());

  //  Ambil semua produk dari database
  const allProducts = await Product.find();

  //  Cari produk yang tidak pernah terjual (tidak ada di productSalesMap)
  const unsoldProducts = allProducts
    .filter(p => !productSalesMap.has(p._id.toString()))
    .map(p => ({
      id: p._id,
      title: p.title,
      stock: p.stock,
      sold: 0,
    }));

  // Jika semua produk unsold
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

   // Buat array vektor untuk clustering (hanya menggunakan totalSold)
  const vectors = productSales.map(p => [p.totalSold]);

  // Tentukan jumlah cluster (maksimal 3 atau sebanyak data yang tersedia)
  const K = Math.min(3, vectors.length);

  // Jika terlalu sedikit data, semua dianggap sebagai "Tidak Laku"
  if (vectors.length < 2) {
    return res.json({
      clustered: [
        {
          cluster: 3,
          label: "Tidak Laku",
          size: unsoldProducts.length + productSales.length,
          products: [...productSales.map(p => ({
            id: p._id,
            title: p.title,
            stock: p.stock,
            sold: p.totalSold
          })), ...unsoldProducts],
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

  // Melakukan proses K-Means Clustering
  // rumus Euclidean distance:

  kmeans.clusterize(vectors, { k: K }, (err, result) => {
    if (err) {
      console.error("[getSalesCluster] Clustering failed:", err);
      return res.status(500).json({ message: err.message });
    }

    //  Menghitung rata-rata penjualan setiap cluster
    // rumus rata-rata:
    const clustersWithAverage = result.map((cluster, i) => {
      const avg = cluster.clusterInd.reduce(
        (sum, idx) => sum + productSales[idx].totalSold,
        0
      ) / cluster.clusterInd.length;

      return {
        cluster: i + 1,
        avgSold: avg,
        clusterInd: cluster.clusterInd,
      };
    });

    // Urutkan cluster berdasarkan rata-rata penjualan (dari yang tertinggi)
    clustersWithAverage.sort((a, b) => b.avgSold - a.avgSold);

    // Label default untuk masing-masing cluster
    const labels = ["Laris", "Sedang", "Tidak Laku"];

     // Membentuk data akhir dengan label, ukuran, dan daftar produk per cluster
    const clustered = clustersWithAverage.map((clusterWithAvg, i) => ({
      cluster: clusterWithAvg.cluster,
      label: labels[i] || `Cluster ${i + 1}`,
      size: clusterWithAvg.clusterInd.length,
      products: clusterWithAvg.clusterInd.map(idx => ({
        id: productSales[idx]._id,
        title: productSales[idx].title,
        sold: productSales[idx].totalSold,
        stock: productSales[idx].stock || "N/A",
      })),
    }));

    //  Tambahkan produk yang sold = 0 ke cluster "Tidak Laku"
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

    // Hitung total produk dan persentase per cluster
    const total = clustered.reduce((sum, c) => sum + c.size, 0);
    const clusterPercentages = clustered.map(cl => ({
      label: cl.label,
      size: cl.size,
      percentage: ((cl.size / total) * 100).toFixed(2),
    }));

     // Kirim hasil akhir sebagai respons
    res.json({
      clustered,
      stats: {
        totalProducts: total,
        clusterPercentages,
      },
    });
  });
});
