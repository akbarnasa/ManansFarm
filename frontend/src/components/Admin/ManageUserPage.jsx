import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import Loading from '../Loading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';
import moment from 'moment';
import toast from 'react-hot-toast';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';


const server = "http://localhost:5000";

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${server}/api/admin/all`, {
        headers: {
          token: Cookies.get("token"),
        },
      });
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.name?.toLowerCase().includes(search.toLowerCase())
  );

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const updateUserRole = async (userId, newRole) => {
    try {
      const { data } = await axios.put(`${server}/api/user/${userId}/role`, { role: newRole }, {
        headers: {
          token: Cookies.get("token"),
        },
      });
      toast.success(data.message);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengubah peran");
    }
  };

  const deleteUser = async (userId) => {
    try {
      const { data } = await axios.delete(`${server}/api/user/${userId}`, {
        headers: {
          token: Cookies.get("token"),
        },
      });
      toast.success(data.message);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus pengguna");
    }
  };
  

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Kelola Pengguna</h1>

      <Input
        placeholder='Cari berdasarkan email atau nama'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='w-full md:w-1/2'
      />

      {loading ? (
        <Loading />
      ) : filteredUsers.length > 0 ? (
        <div className='overflow-x-auto'>
          <Table>
  <TableHeader>
    <TableRow>
      <TableHead>No</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Peran</TableHead>
      <TableHead>Tanggal Dibuat</TableHead>
      <TableHead>Ubah Peran</TableHead>
      <TableHead>Aksi</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {currentUsers.map((user, idx) => (
      <TableRow key={user._id}>
        <TableCell>{startIndex + idx + 1}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.role}</TableCell>
        <TableCell>{moment(user.createdAt).format("DD-MM-YYYY")}</TableCell>
        <TableCell>
          <select
            value={user.role}
            onChange={(e) => updateUserRole(user._id, e.target.value)}
            className='border rounded-md px-2 py-1'
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </TableCell>
        <TableCell>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Hapus
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Pengguna</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus pengguna ini?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteUser(user._id)}>
                  Ya, Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
        <p>Tidak ada pengguna ditemukan</p>
      )}
    </div>
  );
};

export default ManageUsersPage;
