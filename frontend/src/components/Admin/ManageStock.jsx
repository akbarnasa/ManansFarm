import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import moment from 'moment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

const server = process.env.REACT_APP_API_URL;

const ManageStock = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 8;

  const years = [2023, 2024, 2025];
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
  ];

  useEffect(() => {
    fetchProductsAndOrders();
  }, [selectedYear, selectedMonth]);

  const fetchProductsAndOrders = async () => {
    try {
      const token = Cookies.get("token");

      const [productRes, orderRes] = await Promise.all([
        axios.get(`${server}/api/admin`, { headers: { token } }),
        axios.get(`${server}/api/order/admin/all`, { headers: { token } }),
      ]);

      setProducts(productRes.data.products || []);
      setOrders(orderRes.data || []);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    }
  };

  const getSoldQuantity = (productId) => {
    let totalSold = 0;

    const filteredOrders = orders.filter(order => {
      const date = moment(order.paidAt || order.createdAt);
      const matchYear = date.year() === parseInt(selectedYear);
      const matchMonth = selectedMonth === 'all' || date.format('MM') === selectedMonth;
      return matchYear && matchMonth && order.status === "Dibayar";
    });

    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const itemProductId = item.product?._id || item.product;
        if (itemProductId?.toString() === productId?.toString()) {
          totalSold += item.quantity || 0;
        }
      });
    });

    return totalSold;
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);
  const totalPages = Math.ceil(products.length / rowsPerPage);

  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleExportPDF = async () => {
    const doc = new jsPDF();
    const logoUrl = "/logoManan's.png";
  
    const getImageBase64 = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
          const canvas = document.createElement('canvas');
          canvas.width = this.width;
          canvas.height = this.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(this, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.src = url;
      });
    };
  
    const logoBase64 = await getImageBase64(logoUrl);
  
    // Header: Logo dan Info Usaha
    doc.addImage(logoBase64, 'PNG', 14, 10, 30, 30);
    doc.setFontSize(25);
    doc.text("MANAN'S FARM", 50, 20);
    doc.setFontSize(11);
    doc.text("Fresh, Organic Harvests. Sustainable Farming.", 50, 28);
    doc.setFontSize(10);
    doc.text("Jl. Cipanyi, Tenjolaya, Kab. Bandung, Jawa Barat 40972", 50, 34);
    doc.line(14, 40, 200, 40);
  
    // Judul Laporan
    doc.setFontSize(14);
    doc.text(
      `Laporan Stok Produk - ${selectedMonth === 'all'
        ? 'Semua Bulan'
        : months.find((m) => m.value === selectedMonth).label
      } ${selectedYear}`,
      14,
      50
    );
  
    // Tabel Data
    const tableRows = products.map((prod, index) => {
      const sold = getSoldQuantity(prod._id);
      const sisa = Math.max((prod.stock || 0) - sold, 0);
      return [
        index + 1,
        prod._id,
        prod.title,
        prod.stock,
        sold,
        sisa,
      ];
    });
  
    autoTable(doc, {
      head: [['No', 'ID Produk', 'Nama Produk', 'Stok', 'Terjual', 'Sisa']],
      body: tableRows,
      startY: 60,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [100, 149, 237] },
      theme: 'striped',
      margin: { left: 14, right: 14 },
    });
  
    // Footer: Tanggal Cetak dan Tanda Tangan
    const afterTableY = doc.lastAutoTable.finalY + 10;
    const printDate = moment().format('DD-MM-YYYY HH:mm:ss');
    doc.setFontSize(9);
    doc.text(`Dicetak pada: ${printDate}`, 14, afterTableY);
    doc.text("*Laporan ini dicetak otomatis oleh sistem.", 14, afterTableY + 7);
    doc.text("Mengetahui,", 150, afterTableY + 7);
    doc.text("__________________________", 140, afterTableY + 27);
  
    // Simpan file
    doc.save(`Laporan_Stok_${selectedYear}_${selectedMonth}.pdf`);
  };


  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Kelola Stok Produk</h1>

      <div className="flex gap-4 mb-4 items-center">
        <select
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded-md"
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select
          value={selectedMonth}
          onChange={(e) => {
            setSelectedMonth(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded-md"
        >
          {months.map(month => (
            <option key={month.value} value={month.value}>{month.label}</option>
          ))}
        </select>

        <button
          onClick={handleExportPDF}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          Cetak PDF
        </button>
      </div>

      {/* Tabel Produk */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>ID Produk</TableHead>
            <TableHead>Nama Produk</TableHead>
            <TableHead>Stok</TableHead>
            <TableHead>Terjual</TableHead>
            <TableHead>Sisa</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Tidak ada data produk
              </TableCell>
            </TableRow>
          ) : (
            paginatedProducts.map((prod, index) => {
              const soldQty = getSoldQuantity(prod._id);
              const sisaStok = Math.max((prod.stock || 0) - soldQty, 0);

              return (
                <TableRow key={prod._id}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>{prod._id}</TableCell>
                  <TableCell>{prod.title}</TableCell>
                  <TableCell>{prod.stock}</TableCell>
                  <TableCell>{soldQty}</TableCell>
                  <TableCell>{sisaStok}</TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Navigasi halaman */}
      {products.length > rowsPerPage && (
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Kembali
          </button>

          <span>Halaman {currentPage} dari {totalPages}</span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageStock;
