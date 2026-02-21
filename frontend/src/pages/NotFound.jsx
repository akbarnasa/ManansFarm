import { Home } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  return (
    <div className='w-[60%] m-auto flex flex-col justify-center items-center'>
        <img src='/errr.png' alt='' className='max-w-[500px] w-full'/>
        <Link to={"/"}>
            <Button variant='ghost' className='flex items-center gap-2'>
                Go to <Home/> Page
            </Button>
        </Link>
      
    </div>
  )
}

export default NotFound
