import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger }  from './ui/dropdown-menu';
import { LogIn, LogOut, ShoppingCart, User } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router';
import ModeToggle from './mode-toggle';
import { UserData } from '@/context/UserContext';
import { CartData } from '@/context/CartContext';

// Membuat komponen Navbar
const Navbar = () => {
    // Mengambil data isAuth dan fungsi logoutUser dari UserContext
    const {isAuth, logoutUser, user} = UserData();

    // Menggunakan navigate untuk berpindah halaman
    const navigate = useNavigate();

    // Mengambil totalItem dari CartContext
    const {totalItem} = CartData()

    // Fungsi untuk logout user
    const logoutHandler = () => {
        logoutUser(navigate);
    };

  return (
    // Container utama navbar dengan efek sticky, blur, dan border bawah
    <div className='z-50 sticky top-0 bg-background/50 border-b backdrop-blur'>
        
        {/* Container isi navbar */}
        <div className='container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between'>
            
            {/* Logo / nama brand*/}
            <div className="flex items-center space-x-2">
            <img src="/logoManan's.png" alt="Logo" className="h-8 w-8 object-contain" />
            <h1 style={{fontFamily: 'Roboto Condensed, sans-serif'}} className='text-2xl font-bold text-green-700'>
              MANAN'S FARM
              <span className="text-sm align-top">&reg;</span>
            </h1>
            </div>

            {/* Menu navigasi */}
            <ul className='flex justify-center items-center space-x-6'>

                {/* Link ke halaman Home */}
                <li className='cursor-pointer' onClick={()=> navigate ("/")}>
                    Beranda
                </li>

                {/* Link ke halaman Products */}
                {user?.role !== 'admin' && (
                <li className='cursor-pointer' onClick={()=> navigate ("/products")}>
                    Produk
                </li>
                )}
                {/* Link ke halaman Cart dengan ikon keranjang dan badge jumlah item */}
                {user?.role !== 'admin' && (
                <li className='cursor-pointer relative flex items-center' onClick={()=> navigate ("/cart")}>
                    <ShoppingCart className='w-6 h-6 ' />
                    <span className='absolute -top-2 -right-2 bg-green-500
                    text-white text-xs font-bold w-5 h-5 flex items-center
                    justify-center rounded-full'>
                        {totalItem}
                    </span>
                </li>
                )}

                {/* Dropdown menu untuk akun pengguna */}
                <li>
                    <DropdownMenu>
                        
                        {/* Trigger untuk membuka dropdown */}
                        <DropdownMenuTrigger className="cursor-pointer">
                            <User className='w-6 h-6' />
                        </DropdownMenuTrigger>

                        {/* Konten dropdown */}
                        <DropdownMenuContent 
                            className="bg-white dark:bg-neutral-800 border border-gray-200 
                            dark:border-neutral-700 shadow-xl rounded-md"
                        >
                            <DropdownMenuLabel>Akun</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            {/* Menampilkan opsi berdasarkan status login user */}
                            {!isAuth ? (
                                // Jika belum login, tampilkan tombol Login
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => navigate("/login")}
                                >
                                    Login
                                </DropdownMenuItem>
                            ) : (
                                // Jika sudah login, tampilkan opsi Order dan Logout
                                <>
                                {user?.role !== 'admin' && (
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => navigate("/order")}
                                    >
                                        Pesanan
                                    </DropdownMenuItem>
                                )}
                                    {user && user.role ==="admin" && (<DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => navigate("/admin/dashboard")}
                                    >
                                        Dashboard
                                    </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={logoutHandler}
                                    >
                                        Logout
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </li>

                {/* Komponen untuk toggle dark/light mode */}
                <ModeToggle/>
                
            </ul>

        </div>
    </div>
  );
};

export default Navbar;
