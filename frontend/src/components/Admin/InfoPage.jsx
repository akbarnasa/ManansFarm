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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const server = "http://localhost:5000"

const InfoPage = () => {
  const [selectedYear, setSelectedYear] = useState(moment().year())
  const [monthlySales, setMonthlySales] = useState(Array(12).fill({ total: 0 }))

  const fetchMonthlySales = async () => {
    try {
      const { data } = await axios.get(`${server}/api/sales/monthly?year=${selectedYear}`, {
        headers: {
          token: Cookies.get("token"),
        },
      })
      // Jika backend tidak mengembalikan array 12 bulan, bikin fallback
      const safeMonthly = Array.from({ length: 12 }, (_, i) => {
        const found = data.monthlySales.find(m => m.month === i + 1)
        return found || { month: i + 1, total: 0 }
      })
      setMonthlySales(safeMonthly)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchMonthlySales()
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
    maintainAspectRatio: false, // <---- Penting
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

  return (
    <div className='p-6 space-y-6'>
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
        <CardContent className='min-h-[400px]'> {/* <<< Kunci agar tinggi chart stabil */}
          <Bar data={barData} options={barOptions} />
        </CardContent>
      </Card>
    </div>
  )
}

export default InfoPage
