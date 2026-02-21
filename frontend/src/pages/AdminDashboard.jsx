import HomePage from '@/components/Admin/HomePage'
import InfoPage from '@/components/Admin/InfoPage'
import OrdersPage from '@/components/Admin/OrdersPage'
import { Button } from '@/components/ui/button'
import { UserData } from '@/context/UserContext'
import {
  Home,
  Info,
  MenuIcon,
  ShoppingBag,
  UserIcon,
  X,
  LayoutDashboard
} from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ClusterAnalysis from './clusterAnalysis'
import ManageUsersPage from '@/components/Admin/ManageUserPage'

const AdminDashboard = () => {
  const [selectedPage, setSelectedPage] = useState('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const { user } = UserData()

  if (user.role !== 'admin') return navigate('/')

  const renderPageContent = () => {
    switch (selectedPage) {
      case 'home':
        return <HomePage />
      case 'pengguna':
        return <ManageUsersPage />
      case 'pesanan':
        return <OrdersPage />
      case 'info':
        return <InfoPage />
      case 'cluster':
        return <ClusterAnalysis />
      default:
        return <HomePage />
    }
  }

  return (
    <div className='flex min-h-screen'>
      {/* Sidebar */}
      <div
        className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        absolute top-16 left-0 h-[calc(100vh-4rem)] z-40 backdrop-blur-md shadow-md transition-transform duration-300 
        lg:static lg:translate-x-0 lg:h-auto
      `}
      >
        <div className='flex flex-col h-full p-4'>
          <h1 className='text-lg font-semibold mb-4'>Panel Admin</h1>

          {/* Menu navigasi */}
          <div className='flex-1 space-y-2'>
            <Button
              variant='ghost'
              onClick={() => setSelectedPage('home')}
              className={`w-full justify-start flex items-center gap-2 ${
                selectedPage === 'home'
                  ? 'bg-green-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <Home className='w-5 h-5' /> Produk
            </Button>

            <Button
              variant='ghost'
              onClick={() => setSelectedPage('pengguna')}
              className={`w-full justify-start flex items-center gap-2 ${
                selectedPage === 'pengguna'
                  ? 'bg-green-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <UserIcon className='w-5 h-5' /> Pengguna
            </Button>

            <Button
              variant='ghost'
              onClick={() => setSelectedPage('pesanan')}
              className={`w-full justify-start flex items-center gap-2 ${
                selectedPage === 'pesanan'
                  ? 'bg-green-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <ShoppingBag className='w-5 h-5' /> Pesanan
            </Button>

            <Button
              variant='ghost'
              onClick={() => setSelectedPage('info')}
              className={`w-full justify-start flex items-center gap-2 ${
                selectedPage === 'info'
                  ? 'bg-green-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <Info className='w-5 h-5' /> Info
            </Button>

            <Button
              variant='ghost'
              onClick={() => setSelectedPage('cluster')}
              className={`w-full justify-start flex items-center gap-2 ${
                selectedPage === 'cluster'
                  ? 'bg-green-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className='w-5 h-5' /> Cluster
            </Button>
          </div>

          {/* Tombol Close */}
          <div className='mt-4 lg:hidden'>
            <Button
              variant='ghost'
              className='flex items-center gap-2 w-full justify-start'
              onClick={() => setSidebarOpen(false)}
            >
              <X className='w-5 h-5' /> Close
            </Button>
          </div>
        </div>
      </div>

      {/* Konten utama */}
      <div className='flex-1 flex flex-col'>
        <div className='shadow p-4 flex items-center justify-between lg:justify-end'>
          <Button
            variant='outline'
            className='lg:hidden'
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className='w-5 h-5' />
          </Button>
          <h2 className='text-lg font-bold hidden lg:block'>Dashboard Admin</h2>
        </div>

        <div className='p-4'>{renderPageContent()}</div>
      </div>
    </div>
  )
}

export default AdminDashboard
