import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@radix-ui/react-dropdown-menu'
import { Input } from "@/components/ui/input" // atau dari sumber pustaka yang kamu pakai
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { UserData } from '@/context/UserContext'
import { useNavigate } from 'react-router-dom'
import { Loader } from 'lucide-react'

const Login = ({setIsAuth}) => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const {loginUser, btnLoading} = UserData();

  const submitHandler = () => {
    loginUser(email, navigate);
  }
  return (
    <div className='min-h-[100vh] flex items-center justify-center'>
      <Card className='w-full max-w-md shadow-md rounded-2xl'>
        <CardHeader>
        <img src="images.png" alt="Logo Manan's Farm" className="h-120 w-auto object-contain mx-auto" />
        <CardDescription>
          <p className='text-lg font-bold mt-5'>LogIn</p>
          <p className="text-sm text-gray-500">Masukkan email Anda dan kami akan mengirimkan kode OTP untuk login.</p>
        </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className='text-left'>
            <Label>Email</Label>
            <Input type='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
        </CardContent>
        
          <CardFooter>
            <Button disabled={btnLoading} onClick={submitHandler}>
              {btnLoading?<Loader className='animate-spin '/>:"Masuk"}
           </Button>
          </CardFooter>
      </Card> 
    </div>
  )
}

export default Login
