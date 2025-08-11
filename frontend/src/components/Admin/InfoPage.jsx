import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import moment from 'moment'
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from '../ui/card'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Button } from '../ui/button'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const server = import.meta.env.VITE_API_URL;

const InfoPage = () => {
  const [selectedYear, setSelectedYear] = useState(moment().year())
  const [monthlySales, setMonthlySales] = useState(Array(12).fill({ total: 0 }))
  const [financeReport, setFinanceReport] = useState([])

  const fetchMonthlySales = async () => {
    try {
      const { data } = await axios.get(`${server}/api/sales/monthly?year=${selectedYear}`, {
        headers: {
          token: Cookies.get("token"),
        },
      })
      const safeMonthly = Array.from({ length: 12 }, (_, i) => {
        const found = data.monthlySales.find(m => m.month === i + 1)
        return found || { month: i + 1, total: 0 }
      })
      setMonthlySales(safeMonthly)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchFinanceReport = async () => {
    try {
      const { data } = await axios.get(`${server}/api/finance/monthly?year=${selectedYear}`, {
        headers: {
          token: Cookies.get("token"),
        },
      })
      const safeFinance = Array.from({ length: 12 }, (_, i) => {
        const found = data.monthlyFinance.find(m => m.month === i + 1)
        return found || { month: i + 1, totalIncome: 0, totalOrders: 0 }
      })
      setFinanceReport(safeFinance)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchMonthlySales()
    fetchFinanceReport()
  }, [selectedYear])

  const barData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ],
    datasets: [
      {
        label: `Omzet ${selectedYear}`,
        data: monthlySales.map(m => m.total),
        backgroundColor: '#3b82f6',
      },
    ],
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Penjualan Bulanan Tahun ${selectedYear}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => 'Rp ' + value.toLocaleString('id-ID'),
        },
      },
    },
  }

  const monthNamesGraf = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  const monthName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

  const handleExportPDF = async () => {
    const doc = new jsPDF()
    const logoUrl = "/logoManan's.png" // Pastikan logo ada di folder public
  
    // Convert logo image to base64
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
  
    // Header
    doc.addImage(logoBase64, 'PNG', 14, 10, 30, 30)
    doc.setFontSize(25)
    doc.text("MANAN'S FARM", 50, 20)
    doc.setFontSize(11)
    doc.text("Fresh, Organic Harvests. Sustainable Farming.", 50, 28)
    doc.setFontSize(10)
    doc.text("Jl. Cipanyi, Tenjolaya, Kab. Bandung, Jawa Barat 40972", 50, 34)
    doc.line(14, 40, 200, 40)
  
    // Judul Laporan
    doc.setFontSize(14)
    doc.text(`Laporan Keuangan - Tahun ${selectedYear}`, 14, 50)
  
    // Tabel
    const tableColumn = ['No.', 'Bulan', 'Omzet (Rp)']
    const tableRows = monthlySales.map((item, index) => [
      index + 1,
      monthName[index],
      item.total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
    ])
  
    // Total Omzet
    const total = monthlySales.reduce((sum, item) => sum + item.total, 0)
    const totalRow = [
      { content: 'Total Omzet', colSpan: 2, styles: { halign: 'right', fontStyle: 'bold' } },
      {
        content: total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }),
        styles: { halign: 'right', fontStyle: 'bold' }
      }
    ]
    tableRows.push(totalRow)
  
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [22, 160, 133] },
    })
  
    // Footer
    const afterTableY = doc.lastAutoTable.finalY + 10
    const printDate = moment().format('DD-MM-YYYY HH:mm:ss')
    doc.setFontSize(9)
    doc.text(`Dicetak pada: ${printDate}`, 14, afterTableY)
    doc.text("*Laporan ini dicetak otomatis oleh sistem.", 14, afterTableY + 7)
    doc.text('Mengetahui,', 150, afterTableY + 7)
    doc.text('__________________________', 140, afterTableY + 27)
  
    doc.save(`Laporan_Keuangan_${selectedYear}.pdf`)
  }
  
  

  return (
    <div className='p-6 space-y-6'>

      {/* Grafik Penjualan */}
      <Card>
        <CardHeader>
          <CardTitle>Grafik Penjualan Bulanan</CardTitle>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border px-2 py-2 rounded-md mt-4 w-[120px]"
          >
            {[2023, 2024, 2025].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </CardHeader>
        <CardContent className='min-h-[400px]'>
          <Bar data={barData} options={barOptions} />
        </CardContent>
      </Card>

      {/* Laporan Keuangan Bulanan */}
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="max-w-[500px] w-full">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-base">
                  Laporan Keuangan Bulanan - {selectedYear}
                </CardTitle>
                <CardDescription className="text-sm">
                  Menampilkan omzet penjualan tiap bulan.
                </CardDescription>
              </div>
              <Button onClick={handleExportPDF} className="text-sm">
                Cetak PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 overflow-x-auto">
            <table className="w-full border border-gray-200 text-sm">
              <thead>
                <tr className="bg-blue-100 text-gray-800 font-semibold text-left">
                  <th className="py-2 px-4 border">Bulan</th>
                  <th className="py-2 px-4 border">Omzet (Rp)</th>
                </tr>
              </thead>
              <tbody>
                {monthlySales.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-1.5 px-4 border">{monthName[index]}</td>
                    <td className="py-1.5 px-4 border">Rp {item.total.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

export default InfoPage
