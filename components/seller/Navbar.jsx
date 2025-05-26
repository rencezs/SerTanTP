import React from 'react'
import { assets } from '../../assets/assets'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'

const Navbar = () => {

  const { router } = useAppContext()

  return (
    <div className='flex items-center px-4 md:px-8 py-3 justify-between border-b'>
      <div className='flex items-center gap-3'>
        <Image 
          onClick={()=>router.push('/')} 
          className='w-28 lg:w-32 h-auto cursor-pointer' 
          src='/copy/Picsart_23-04-27_15-55-05-831.png' 
          alt="QuickCart Logo"
          width={128}
          height={40}
        />
        <span className='text-xs md:text-base font-semibold text-gray-700 whitespace-nowrap'>All Off Dreams To Reality</span>
      </div>
      <button className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
    </div>
  )
}

export default Navbar