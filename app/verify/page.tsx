import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ArrowLeft, MailIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Verify = () => {
  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]'>
      <Card className='w-[380px] px-5 bg-white shadow-2xl rounded-lg'>
        <CardHeader className='text-center'>
          <div className='mb-6 mx-auto flex items-center justify-center rounded-full bg-blue-100 p-4'>
            <MailIcon className='text-blue-600' size={32} />
          </div>
          <CardTitle className='text-3xl font-semibold text-gray-800'>
            Check Your Email!
          </CardTitle>
          <CardDescription className='text-sm text-gray-600'>
            We have sent a verification link to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mt-4 flex items-center rounded-md bg-yellow-100 p-3'>
            <AlertCircle className='text-yellow-600' size={24} />
            <span className='ml-2 text-sm text-yellow-700'>
              Be sure to check your spam folder.
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <Link
            href="/"
            className={buttonVariants({
              className: "w-full py-2 text-center font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            })}
          >
            <ArrowLeft className='inline mr-2' size={16} /> Back To Home Page
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Verify
