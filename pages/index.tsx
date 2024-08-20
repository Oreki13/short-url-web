import { Inter } from 'next/font/google'
import HeadHtml from '@/components/headHtml'
import HeaderDashboard from '@/components/headerDashboard'
import ShortUrlProvider from '@/lib/provider/short_url'
import useSWR from 'swr'
import ApiEndpoint from '@/lib/helpers/api_endpoint'
import { CardDashboardShortLink } from '@/components/cardDashboardShortLink'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { hasCookie } from 'cookies-next'
import dayjs from 'dayjs'
import ModalAddLink from '@/components/modalAddLink'
import {NextPage} from "next";

const inter = Inter({ subsets: ['latin'] })


const Home:NextPage = () => {
  const { data, error, isLoading } = useSWR(ApiEndpoint.listShortUrl, (url) => ShortUrlProvider.getData(url, 1, 5), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    // revalidateOnMount: false
  })
  const [isOpenModalAdd, setIsOpenModalAdd] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkToken()
    if (data !== undefined) {
      if (data.status === 'ERROR') {
        if (data.code === "TOKEN_EXPIRED" || data.code === "INVALID_TOKEN" || data.code === "INVALID_USER_TOKEN") {
          router.replace('/login')
        }
      }
    }

    return () => {

    }
  }, [data])

  const checkToken = () => {
    console.log("CHECK TOKEN")
    const hasToken = hasCookie('token')
    if (!hasToken) {
      router.replace('/login')
    }
  }


  return (
    <>
      <HeadHtml title='Dashboard' />
      <main className={inter.className}>
        <HeaderDashboard title='ShortURL' />
        <div className='max-w-screen-lg mx-auto mt-12'>
          <div className='flex justify-between'>
            <h1 className='text-3xl font-semibold'>Links</h1>
            <button onClick={() => { setIsOpenModalAdd(true) }} className='bg-sky-900 text-white py-2 px-5 rounded hover:bg-sky-950'>Add Link</button>
          </div>
          <div className='mt-7'>

            {!isLoading && error === undefined ?
              data !== undefined && data.status !== 'ERROR' ?
                data.data.datas.map((val, i) =>
                  <CardDashboardShortLink key={val.id} title={val.title} count={val.count_clicks.toString()} date={dayjs(val.createdAt).format('D MMMM YYYY')} direction={val.destination} />
                )

                : <div>Failed</div> : <div>Loading</div>
            }

            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <a href="#" className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
                <a href="#" className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing
                    <span className="font-medium">1</span>
                    to
                    <span className="font-medium">10</span>
                    of
                    <span className="font-medium">97</span>
                    results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <a href="#" className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                      </svg>
                    </a>
                    {/* <!-- Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" --> */}
                    <a href="#" aria-current="page" className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">1</a>
                    <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">2</a>
                    <a href="#" className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">3</a>
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span>
                    <a href="#" className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">8</a>
                    <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">9</a>
                    <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">10</a>
                    <a href="#" className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                      </svg>
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ModalAddLink isOpen={isOpenModalAdd} onClose={() => { setIsOpenModalAdd(false) }} />

    </>
  )
}

export default Home;
