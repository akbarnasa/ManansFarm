import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from "@/components/ui/input" // Import komponen Input dari pustaka
import { Button } from '@/components/ui/button' // Import komponen Button
import { UserData } from '@/context/UserContext' // Import context untuk akses data user
import { useNavigate } from 'react-router-dom' // Import hook untuk navigasi
import { Loader } from 'lucide-react' // Import ikon Loader untuk menampilkan indikator pemuatan

const Verify = ({setIsAuth}) => {
    const [otp, setOtp] = useState("") // Menyimpan nilai OTP yang dimasukkan oleh pengguna

    const navigate = useNavigate() // Inisialisasi hook untuk navigasi
    const {btnLoading, loginUser, verifyUser} = UserData() // Mengambil state dan fungsi dari context UserData

    // Fungsi untuk mengirim OTP yang dimasukkan oleh pengguna
    const submitHandler = ()=> {
        verifyUser(Number(otp), navigate) // Memanggil fungsi verifyUser untuk memverifikasi OTP
    }

    const [timer, setTimer] = useState(90) // Timer untuk menghitung mundur waktu pengiriman ulang OTP
    const [canResend, setCanResend] = useState(false) // Menyimpan status apakah OTP bisa dikirim ulang

    useEffect(()=> {
        if(timer>0){ // Jika timer masih lebih dari 0
            const interval = setInterval(()=> {
                setTimer((prev) => prev - 1); // Menurunkan timer setiap detik
            }, 1000);

            return ()=> clearInterval(interval); // Bersihkan interval ketika komponen dibongkar
        } else {
            setCanResend(true); // Jika timer habis, izinkan pengguna mengirim ulang OTP
        }
    }, [timer]);

    // Fungsi untuk memformat waktu menjadi MM:SS
    const formatTime = (time) => {
        const minutes = Math.floor(time/ 60) // Menentukan menit
        const seconds = time % 60 // Menentukan detik
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    // Fungsi untuk mengirim ulang OTP
    const handleResendOtp = async ()=> {
        const email = localStorage.getItem("email") // Mendapatkan email dari localStorage
        await loginUser(email, navigate) // Memanggil fungsi loginUser untuk mengirim OTP baru
        setTimer(90) // Mengatur ulang timer ke 90 detik
        setCanResend(false) // Nonaktifkan tombol kirim ulang sampai timer habis
    }

    const email = localStorage.getItem("email") || "youremail@example.com" // Mendapatkan email pengguna atau menggunakan default

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Card className='w-full max-w-md shadow-md rounded-2xl'>
        <CardHeader>
        <CardTitle className="text-center text-xl font-semibold mt-5">Verifikasi Kode OTP anda</CardTitle>
        <CardDescription>
        <p className="text-base text-gray-700 font-medium mt-5">Masukkan kode otp</p>
        <p className="text-sm text-gray-500">Kode otp dikirim ke <span className="font-medium">{email}</span></p>
        </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className='text-left'>
            <Input type="number"
                   value={otp}  
                   placeholder="Masukkan 6 digit OTP"                                           
                    onChange={(e) => setOtp(e.target.value)}/> {/* Input untuk memasukkan OTP */}
          </div>
        </CardContent>
        
      
          <CardFooter>
            <Button disabled={btnLoading} onClick={submitHandler}> {/* Tombol untuk mengirim OTP */}
                {btnLoading ? <Loader className='animate-spin'/> : "Submit"} {/* Menampilkan loading jika sedang mengirim */}
           </Button>
          </CardFooter>

          <div className="flex flex-col justify-center items-center w-[200px] m-auto">
            <p className='text-sm mb-3 justify-center'>
                {
                    canResend?"Anda bisa mengirim ulang kode OTP"
                    : `Sisa Waktu: ${formatTime(timer)}` // Menampilkan waktu yang tersisa untuk kirim ulang OTP
                }
            </p>
            <Button className='mb-3' onClick={handleResendOtp} disabled={!canResend}> {/* Tombol untuk mengirim ulang OTP */}
            Kirim Ulang
            </Button>
          </div>
      
      </Card> 
      
    </div>
  )
}

export default Verify
