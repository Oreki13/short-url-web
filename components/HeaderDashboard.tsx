'use client'

import { Menu, Transition } from '@headlessui/react'
import React, { FC } from 'react'
import { useAuth } from '@/lib/context/AuthContext';

interface HeaderParam {
    title: string
}

const HeaderDashboard: FC<HeaderParam> = ({ title }) => {
    const { logout, user, isLoading } = useAuth();

    const handleLogout = async () => {
        await logout();
    }

    return (
        <header className='h-16 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50'>
            <div className='max-w-7xl mx-auto px-6 h-full flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg flex items-center justify-center'>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </div>
                    <span className='text-white text-xl font-bold'>{title}</span>
                </div>

                <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center gap-3 px-3 py-1 rounded-xl bg-gray-800/50 border border-gray-700 hover:bg-gray-800 transition-all duration-200">
                        <div className='w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center'>
                            <span className='font-semibold text-white text-sm'>
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </span>
                        </div>
                        <div className='text-left'>
                            <p className='text-white font-medium text-sm'>{user?.name || 'User'}</p>
                            <p className='text-gray-400 text-xs'>{user?.email || 'user@example.com'}</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </Menu.Button>

                    <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <Menu.Items className='absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden'>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={handleLogout}
                                        disabled={isLoading}
                                        className={`${active ? "bg-red-500/10" : ''} w-full text-left px-4 py-3 text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 transition-colors`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        {isLoading ? 'Signing out...' : 'Sign Out'}
                                    </button>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </header>
    )
}

export default HeaderDashboard
