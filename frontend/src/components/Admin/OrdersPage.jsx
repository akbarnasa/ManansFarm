import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import Loading from '../Loading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Link } from 'react-router-dom'
import moment from 'moment'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const server = "http://localhost:5000"

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(moment().year())
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const rowsPerPage = 5

  const years = [2023, 2024, 2025]
  const months = [
    { value: 'all', label: 'Semua Bulan' },
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ]

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${server}/api/order/admin/all`, {
        headers: { token: Cookies.get("token") }
      })
      setOrders(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])
  useEffect(() => { setCurrentPage(1) }, [search, selectedYear, selectedMonth])

  const updateOrderStatus = async (orderId, status) => {
    setLoading(true)
    try {
      const { data } = await axios.post(`${server}/api/order/${orderId}`, { status }, {
        headers: { token: Cookies.get("token") }
      })
      toast.success(data.message)
      fetchOrders()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gagal memperbarui status")
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders
    .filter(order =>
      (order.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
       order._id.toLowerCase().includes(search.toLowerCase()))
    )
    .filter(order => {
      const orderDate = moment(order.paidAt || order.createdAt)
      const matchYear = orderDate.year() === selectedYear
      const matchMonth = selectedMonth === 'all' || orderDate.month() + 1 === Number(selectedMonth)
      return matchYear && matchMonth
    })

  const startIndex = (currentPage - 1) * rowsPerPage
  const currentOrders = filteredOrders.slice(startIndex, startIndex + rowsPerPage)
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage)

  const handleExportPDF = async () => {
    const doc = new jsPDF()
    const logoUrl = "/logoManan's.png"

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
      `Laporan Pesanan - ${selectedMonth === 'all'
        ? 'Semua Bulan'
        : months.find(m => m.value === selectedMonth).label} ${selectedYear}`,
      14,
      50
    )

    const tableColumn = [
      'No.', 'ID Pesanan', 'Email', 'Nama', 'Total', 'Status', 'Tanggal Pemesanan'
    ]
    const tableRows = []

    filteredOrders.forEach((order, index) => {
      tableRows.push([
        index + 1,
        order._id,
        order.user?.email || 'Tidak diketahui',
        `${order.namaDepan || ''} ${order.namaBelakang || ''}`,
        order.subTotal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }),
        order.status,
        moment(order.createdAt).format('DD-MM-YYYY'),
      ])
    })

    const totalAmount = filteredOrders.reduce((acc, order) => acc + order.subTotal, 0)
    const totalRow = [
      { content: 'Total Omzet', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
      '',
      {
        content: totalAmount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }),
        colSpan: 1,
        styles: { halign: 'right', fontStyle: 'bold' }
      },
      '', ''
    ]

    tableRows.push(totalRow)

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
    })

    const afterTableY = doc.lastAutoTable.finalY + 10
    const printDate = moment().format('DD-MM-YYYY HH:mm:ss')
    doc.setFontSize(9)
    doc.text(`Dicetak pada: ${printDate}`, 14, afterTableY)
    doc.text("*Laporan ini dicetak otomatis oleh sistem.", 14, afterTableY + 7)
    doc.text('Mengetahui,', 150, afterTableY + 7)
    doc.text('__________________________', 140, afterTableY + 27)

    doc.save(`Laporan_Pesanan_${selectedYear}_${selectedMonth}.pdf`)
  }

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Kelola Pesanan</h1>

      <div className="flex gap-4 mb-4">
        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border px-3 py-2 rounded-md">
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
          className="border px-3 py-2 rounded-md">
          {months.map((month) => (
            <option key={month.value} value={month.value}>{month.label}</option>
          ))}
        </select>

        <button onClick={handleExportPDF} className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Cetak PDF
        </button>
      </div>

      <Input
        placeholder='Cari berdasarkan email atau ID pesanan'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='w-full md:w-1/2'
      />

      {loading ? (
        <Loading />
      ) : filteredOrders.length > 0 ? (
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>ID Pesanan</TableHead>
                <TableHead>Email Pengguna</TableHead>
                <TableHead>Nama Pengguna</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Pemesanan</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.map((order, idx) => (
                <TableRow key={order._id}>
                  <TableCell>{startIndex + idx + 1}</TableCell>
                  <TableCell>
                  <Link to={`/admin/order/${order._id}`} >
                    {order._id}
                  </Link>
                  </TableCell>
                  <TableCell>{order.user?.email || 'Tidak diketahui'}</TableCell>
                  <TableCell>{`${order.namaDepan || ''} ${order.namaBelakang || ''}`}</TableCell>
                  <TableCell>{order.subTotal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded text-white text-center min-w-[160px] ${
                      order.status.toLowerCase() === 'belum dibayar'
                        ? 'bg-yellow-500'
                        : order.status.toLowerCase() === 'dibayar'
                        ? 'bg-green-500'
                        : order.status.toLowerCase().includes('menunggu')
                        ? 'bg-yellow-500'
                        : order.status.toLowerCase().includes('ditolak') ||
                          order.status.toLowerCase().includes('dibatalkan') ||
                          order.status.toLowerCase().includes('kedaluwarsa')
                        ? 'bg-red-500'
                        : 'bg-gray-500'
                    }`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>{moment(order.createdAt).format("DD-MM-YYYY")}</TableCell>
                  <TableCell>
                    <select
                      value={order.status}
                      className='w-[150px] px-3 py-2 border rounded-md'
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    >
                      <option value="Belum Dibayar">Belum Dibayar</option>
                      <option value="Dibayar">Dibayar</option>
                      <option value="Pembayaran Ditolak">Pembayaran Ditolak</option>
                      <option value="Kedaluwarsa">Kedaluwarsa</option>
                      <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Kembali
            </button>

            <span>Halaman {currentPage} dari {totalPages}</span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      ) : (
        <p>Tidak ada pesanan</p>
      )}
    </div>
  )
}

export default OrdersPage
