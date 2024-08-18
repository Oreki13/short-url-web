import { Menu, Transition } from '@headlessui/react'
import { deleteCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

interface HeaderParam {
    title: string
}

const HeaderDashboard: FC<HeaderParam> = ({ title }) => {
    const router = useRouter()
    const logout = () => {
        deleteCookie('token')
        router.push('/login')
    }
    return (
        <header className='h-14 flex bg-sky-900 items-center justify-between px-10'>
            <div>
                <span className='text-white text-xl font-semibold'>{title}</span>
            </div>
            <Menu as="div" className="relative inline-block text-left">
                <Menu.Button> <div className='flex items-center border-2 border-sky-200 py-1.5 px-3 rounded-sm cursor-pointer hover:bg-sky-800'>
                    <div className='w-7 h-7 rounded-full bg-sky-200 flex items-center justify-center'>
                        <span className='font-semibold text-xl'>A</span>
                    </div>
                    <div className='ml-3'>
                        <p className='text-white'>Arfandy</p>
                    </div>
                </div></Menu.Button>
                <Transition

                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                >
                    <Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border-[1px]'>
                        <Menu.Item >
                            {({ active }) => (
                                <button onClick={logout} className={active ? "bg-sky-100 w-full text-left p-1 rounded-md text-red-500" : 'bg-white w-full text-left p-1 rounded-md text-red-500'}>Logout</button>
                            )}
                        </Menu.Item>

                    </Menu.Items>
                </Transition >

            </Menu>

        </header>
    )
}

export default HeaderDashboard
