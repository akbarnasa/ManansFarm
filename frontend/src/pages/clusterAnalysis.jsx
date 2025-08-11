import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import {
    Chart as ChartJS,
    ArcElement,
    PointElement,
    LinearScale,
    Tooltip,
    Legend
  } from "chart.js";
  import { Pie } from "react-chartjs-2";
  import jsPDF from "jspdf";
  import autoTable from "jspdf-autotable";
  import moment from 'moment'

  
  ChartJS.register(PointElement, LinearScale, Tooltip, Legend);
  
  ChartJS.register(ArcElement, Tooltip, Legend);
  

  const server = process.env.VITE_API_URL;

const ClusterAnalysis = () => {
  const [clusters, setClusters] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [stats, setStats] = useState(null);


  const years = [2023, 2024, 2025];
  const months = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" },
  ];

  const fetchClusters = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/sales/cluster?year=${selectedYear}&month=${selectedMonth}`,
        {
          headers: {
            token: Cookies.get("token"),
          },
        }
      );
      setClusters(data.clustered);
      setStats(data.stats);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportPDF = async () => {
    const doc = new jsPDF()
    const logoUrl = '/logoManan\'s.png'
  
    const getImageBase64 = (url) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.onload = function () {
          const canvas = document.createElement('canvas')
          canvas.width = this.width
          canvas.height = this.height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(this, 0, 0)
          resolve(canvas.toDataURL('image/png'))
        }
        img.src = url
      })
    }
  
    const logoBase64 = await getImageBase64(logoUrl)
  
    doc.addImage(logoBase64, 'PNG', 14, 10, 30, 30)
    doc.setFontSize(25)
    doc.text("MANAN'S FARM", 50, 20)
    doc.setFontSize(11)
    doc.text("Fresh, Organic Harvests. Sustainable Farming.", 50, 28)
    doc.setFontSize(10)
    doc.text("Jl. Cipanyi, Tenjolaya, Kab. Bandung, Jawa Barat 40972", 50, 34)
    doc.line(14, 40, 200, 40)
  
    doc.setFontSize(14)
    doc.text(
      `Laporan Cluster Penjualan - ${months.find(m => m.value === selectedMonth).label} ${selectedYear}`,
      14,
      50
    )
  
    let yOffset = 60
  
    clusters.forEach((cluster, index) => {
      doc.setFontSize(12)
      doc.text(`${cluster.label} (${cluster.size} produk)`, 14, yOffset)
      yOffset += 5
  
      const body = cluster.products.map((prod, i) => [
        i + 1,
        prod.id,
        prod.title,
        prod.stock || 'N/A',
        prod.sold
      ])
  
      autoTable(doc, {
        startY: yOffset,
        head: [['No', 'ID Produk', 'Nama Produk', 'Stok', 'Terjual']],
        body,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [100, 149, 237] },
        theme: 'striped',
        margin: { left: 14, right: 14 }
      })
  
      yOffset = doc.lastAutoTable.finalY + 10
    })
  
    if (stats && stats.clusterPercentages.length > 0) {
      doc.setFontSize(12)
      doc.text("Persentase Produk per Cluster", 14, yOffset)
      yOffset += 5
  
      const body = stats.clusterPercentages.map((p, i) => [
        i + 1,
        p.label,
        `${p.size} produk`,
        `${p.percentage}%`
      ])
  
      autoTable(doc, {
        startY: yOffset,
        head: [['No', 'Cluster', 'Jumlah Produk', 'Persentase']],
        body,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [72, 187, 120] },
        theme: 'grid',
        margin: { left: 14, right: 14 }
      })
  
      yOffset = doc.lastAutoTable.finalY + 10
    }
  
    // Footer
    const printDate = moment().format('DD-MM-YYYY HH:mm:ss')
    doc.setFontSize(9)
    doc.text(`Dicetak pada: ${printDate}`, 14, yOffset)
    doc.text("*Laporan ini dicetak otomatis oleh sistem.", 14, yOffset + 7)
    doc.text('Mengetahui,', 150, yOffset + 7)
    doc.text('__________________________', 140, yOffset + 27)
  
    doc.save(`Laporan_Cluster_${selectedYear}_${selectedMonth}.pdf`)
  }
  

  useEffect(() => {
    fetchClusters();
  }, [selectedYear, selectedMonth]);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className='mb-6'>Analisis K-Means Clustering</CardTitle>

          <div className="mt-4 flex flex-wrap gap-4 items-center">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border px-3 py-2 rounded-md"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="border px-3 py-2 rounded-md"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>

            {clusters.length > 0 && (
              <button
                onClick={handleExportPDF}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Cetak PDF
              </button>
            )}
          </div>

        </CardHeader>

        <CardContent>
  {clusters.length === 0 ? (
    <p className="text-gray-500">
      Tidak ada transaksi penjualan pada bulan ini.
    </p>
  ) : (
    <>
      {clusters.map((cluster) => (
        <div
          key={cluster.cluster}
          className="mb-8 border rounded-lg overflow-hidden"
        >
          <div className="bg-gray-100 px-4 py-2 font-semibold">
            {cluster.label} ({cluster.size} produk)
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Produk</TableHead>
                <TableHead>Nama Produk</TableHead>
                <TableHead>Kuantitas Awal</TableHead>
                <TableHead>Terjual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cluster.products.map((prod) => (
                <TableRow key={prod.id} className="border-t">
                  <TableCell>{prod.id}</TableCell>
                  <TableCell>{prod.title}</TableCell>
                  <TableCell>{prod.stock || "N/A"}</TableCell>
                  <TableCell>{prod.sold}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}

      {stats && stats.clusterPercentages.length > 0 && (
        <div className="mt-12">
          <h4 className="text-lg font-semibold mb-4">
            Persentase Produk per Cluster
          </h4>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="w-full md:w-1/3 h-[300px]">
              <Pie
                data={{
                  labels: stats.clusterPercentages.map((c) => c.label),
                  datasets: [
                    {
                      label: "Persentase Produk",
                      data: stats.clusterPercentages.map((c) => c.size),
                      backgroundColor: ["#16a34a", "#facc15", "#f87171"],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>

            <div className="w-full md:w-2/3 space-y-2">
              {stats.clusterPercentages.map((c, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b pb-1"
                >
                  <span className="font-medium">{c.label}</span>
                  <span className="text-sm text-gray-600">
                    {c.size} produk ({c.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        
      )}

    </>
  )}
</CardContent>


      </Card>
    </div>
  );
};

export default ClusterAnalysis;
