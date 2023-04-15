import HeaderDashboard from '@/components/HeaderDashboard'
import { TextInput } from '@/components/TextInput'
import HeadHtml from '@/components/headHtml'
import { Inter } from 'next/font/google'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })
export default function AddLink() {
    return (
        <>
            <HeadHtml title='Add Link' />
            <main className={inter.className}>
                <HeaderDashboard title='ShortURL' />

                <div className='max-w-screen-lg mx-auto mt-12'>
                    <h1 className='text-3xl font-semibold'>Add Links</h1>

                    <div>
                        <TextInput label='Title' />
                    </div>

                </div>
            </main>
        </>
    )
}
