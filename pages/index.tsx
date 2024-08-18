import {Inter} from 'next/font/google'
import HeadHtml from '@/components/headHtml'
import HeaderDashboard from '@/components/HeaderDashboard'
import {CardDashboardShortLink} from '@/components/card_dashboard_short_link'
import {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import ModalAddLink from '@/components/modal_add_link'
import {useCheckToken} from "@/lib/hooks/useCheckToken";
import {useFetchListShortUrl} from "@/lib/hooks/useFetchListShortUrl";
import {PaginateSection} from "@/components/PaginateSection";

const inter = Inter({subsets: ['latin']})

export default function Home() {
    const [isOpenModalAdd, setIsOpenModalAdd] = useState(false)
    const [currentPage, setCurrentPage] = useState<number>(1)

    const handleChangePage = (toPage: number) => {
        console.log(`Change page to: ${toPage}`)
        setCurrentPage(toPage);
        console.log(`Current page: ${currentPage}`)
    }

    useEffect(() => {
        console.log("USE EFFECT")
        useCheckToken();
    }, []);

    return (
        <>
            <HeadHtml title='Dashboard'/>
            <main className={inter.className}>
                <HeaderDashboard title='ShortURL'/>
                <div className='max-w-screen-lg mx-auto mt-12'>
                    <div className='flex justify-between'>
                        <h1 className='text-3xl font-semibold'>Links</h1>
                        <button onClick={() => {
                            setIsOpenModalAdd(true)
                        }} className='bg-sky-900 text-white py-2 px-5 rounded hover:bg-sky-950'>Add Link
                        </button>
                    </div>
                    <div className='mt-7'>

                        {ContentHome(currentPage, handleChangePage)}
                    </div>
                </div>
            </main>
            <ModalAddLink isOpen={isOpenModalAdd} onClose={() => {
                setIsOpenModalAdd(false)
            }}/>

        </>
    )
}

const ContentHome = (page: number, handleChangePage: (toPage: number) => void) => {
    const {data, error, isLoading} = useFetchListShortUrl(page, 5);
    console.log(`Content home page: ${page}`)

    if (isLoading) return <p>Loading</p>
    if (error) return <p>Error</p>
    if (data === undefined && data!.status !== "ERROR") return <p>Data is undefined</p>

    return (
        <>
            {
                data!.data.data.map((val, _) =>
                    <CardDashboardShortLink key={val.id} title={val.title}
                                            count={val.count_clicks.toString()}
                                            date={dayjs(val.createdAt).format('D MMMM YYYY')}
                                            direction={val.destination}/>
                )
            }
            <PaginateSection paging={data!.data.paging} page={page} handleChangePage={handleChangePage}/>
        </>

    )
}
