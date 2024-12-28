import {Inter} from 'next/font/google'
import HeaderDashboard from '@/components/HeaderDashboard'
import {useState} from 'react'
import HeadHtml from "@/components/HeadHtml";
import {ContentHome} from "@/components/ContentHome";
import { ModalFormLink} from "@/components/ModalFormLink";
import {useCheckUserLogin} from "@/lib/hooks/useCheckUserLogin";
import {useModalFormLinkStore} from "@/lib/stores/modalFormLinkStore";

const inter = Inter({subsets: ['latin']})


export default function Home() {
    const setOpen= useModalFormLinkStore(state => state.setOpen)

    useCheckUserLogin()
    return (
        <>
            <HeadHtml title='Dashboard'/>
            <main className={inter.className}>
                <HeaderDashboard title='ShortURL'/>
                <div className='max-w-screen-lg mx-auto mt-12'>
                    <div className='flex justify-between'>
                        <h1 className='text-3xl font-semibold'>Links</h1>
                        <button onClick={() => {
                            setOpen()
                        }} className='bg-sky-900 text-white py-2 px-5 rounded hover:bg-sky-950'>Add Link
                        </button>
                    </div>
                    <div className='mt-7'>
                        {ContentHome()}
                    </div>
                </div>
            </main>
            <ModalFormLink />
        </>
    )
}

