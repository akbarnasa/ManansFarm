import { Button } from '@/components/ui/button';
import { server } from '@/main';
import { Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';

const Checkout = () => {
  const [address, setAddress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [newAddress, setNewAddress] = useState({
    negara: 'Indonesia',
    namaDepan: '',
    namaBelakang: '',
    address: {
      alamatLengkap: '',
      kecamatan: '',
      kabupaten: '',
      provinsi: '',
    },
    kodePos: '',
    phone: '',
  });

  const fetchAddress = async () => {
    try {
      const { data } = await axios.get(`${server}/api/address/all`, {
        headers: {
          token: Cookies.get('token'),
        },
      });
      setAddress(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddress = async () => {
    try {
      const { data } = await axios.post(
        `${server}/api/address/new`,
        {
          namaDepan: newAddress.namaDepan,
          namaBelakang: newAddress.namaBelakang,
          phone: newAddress.phone,
          kodePos: Number(newAddress.kodePos),
          address: {
            alamatLengkap: newAddress.address.alamatLengkap,
            kecamatan: newAddress.address.kecamatan,
            kabupaten: newAddress.address.kabupaten,
            provinsi: newAddress.address.provinsi,
          },
        },
        {
          headers: {
            token: Cookies.get('token'),
          },
        }
      );

      if (data.message) {
        toast.success(data.message);
        fetchAddress();
        setNewAddress({
          negara: 'Indonesia',
          namaDepan: '',
          namaBelakang: '',
          address: {
            alamatLengkap: '',
            kecamatan: '',
            kabupaten: '',
            provinsi: '',
          },
          kodePos: '',
          phone: '',
        });
        setModalOpen(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gagal menambahkan alamat");
    }
  };

  const deleteHandler = async (id) => {
    try {
      const { data } = await axios.delete(`${server}/api/address/${id}`, {
        headers: {
          token: Cookies.get('token'),
        },
      });
      toast.success(data.message);
      fetchAddress();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gagal menghapus alamat");
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-6 text-center font-lora">Pilih Alamat</h1>
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {address.length > 0 ? (
            address.map((e) => (
              <div className="p-4 border rounded-lg shadow-sm" key={e._id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">Alamat</h3>
                    <p>
                      {e.address.alamatLengkap}, Kec. {e.address.kecamatan}, Kab. {e.address.kabupaten}, Prov. {e.address.provinsi}, {e.kodePos}
                    </p>
                    <p className="text-sm mt-1">No.Hp - {e.phone}</p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => deleteHandler(e._id)}
                    className="transition duration-200 ease-in-out bg-gray-200 hover:bg-red-600 hover:scale-100 dark:bg-black"
                  >
                    <Trash />
                  </Button>
                </div>
                <Link to={`/payment/${e._id}`}>
                  <Button variant="outline">Gunakan Alamat</Button>
                </Link>
              </div>
            ))
          ) : (
            <p>Alamat tidak ditemukan</p>
          )}
        </div>
      )}

      <Button className="mt-6" variant="outline" onClick={() => setModalOpen(true)}>
        Tambahkan alamat baru
      </Button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambahkan Alamat Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <label className="text-sm font-medium">Negara</label>
              <Select value={newAddress.negara} onValueChange={(val) => setNewAddress({ ...newAddress, negara: val })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Negara" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 shadow-lg border border-gray-300">
                  <SelectItem value="Indonesia">Indonesia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Nama Depan"
                value={newAddress.namaDepan}
                onChange={(e) => setNewAddress({ ...newAddress, namaDepan: e.target.value })}
              />
              <Input
                placeholder="Nama Belakang"
                value={newAddress.namaBelakang}
                onChange={(e) => setNewAddress({ ...newAddress, namaBelakang: e.target.value })}
              />
            </div>

            <Input
              placeholder="Alamat Lengkap"
              value={newAddress.address.alamatLengkap}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  address: {
                    ...newAddress.address,
                    alamatLengkap: e.target.value,
                  },
                })
              }
            />

            <Input
              placeholder="Kecamatan"
              value={newAddress.address.kecamatan}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  address: {
                    ...newAddress.address,
                    kecamatan: e.target.value,
                  },
                })
              }
            />

            <Input
              placeholder="Kota / Kabupaten"
              value={newAddress.address.kabupaten}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  address: {
                    ...newAddress.address,
                    kabupaten: e.target.value,
                  },
                })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Provinsi</label>
                <Select
                  value={newAddress.address.provinsi}
                  onValueChange={(val) =>
                    setNewAddress({
                      ...newAddress,
                      address: {
                        ...newAddress.address,
                        provinsi: val,
                      },
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Provinsi" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 shadow-lg border border-gray-300">
                    <SelectItem value="Jawa Barat">Jawa Barat</SelectItem>
                    <SelectItem value="Jawa Tengah">Jawa Tengah</SelectItem>
                    <SelectItem value="Jawa Timur">Jawa Timur</SelectItem>
                    <SelectItem value="Jakarta">Jakarta</SelectItem>
                    <SelectItem value="Banten">Banten</SelectItem>
                    <SelectItem value="D.I Yogyakarta">D.I Yogyakarta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Kode Pos</label>
                <Input
                  placeholder="Kode Pos"
                  value={newAddress.kodePos}
                  onChange={(e) => setNewAddress({ ...newAddress, kodePos: e.target.value })}
                />
              </div>
            </div>

            <Input
              type="tel"
              placeholder="No. Telp (WhatsApp)"
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Tutup
            </Button>
            <Button variant="outline" onClick={handleAddress}>
              Tambahkan alamat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
