// Import React untuk membuat komponen
import React from 'react'

// Membuat komponen Loading
const Loading = () => {
  return (
    // Container utama loading spinner, posisinya di tengah layar dengan margin atas
    <div className='flex-col gap-4 w-full flex items-center justify-center mt-40'>
        
        {/* Lingkaran loading luar dengan animasi spin */}
        <div className='w-20 h-20 border-4 border-transparent text-blue-400 text-4xl 
        animate-spin flex items-center justify-center border-t-blue-400 rounded-full'>

            {/* Lingkaran loading dalam dengan animasi spin */}
            <div className='w-16 h-16 border-4 border-transparent text-blue-400 text-4xl 
            animate-spin flex items-center justify-center border-t-green-400 rounded-full'>
            </div>

        </div>

    </div>
  )
}

// Export komponen Loading agar bisa dipakai di file lain
export default Loading;
