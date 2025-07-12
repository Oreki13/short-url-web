import HeaderDashboard from '@/components/HeaderDashboard'
import { useState } from 'react'
import HeadHtml from "@/components/HeadHtml";
import { ContentHome } from "@/components/ContentHome";
import { ModalFormLink } from "@/components/ModalFormLink";
import { useAuth, withAuth } from "@/lib/context/AuthContext";
import { useModalFormLinkStore } from "@/lib/stores/dashboard/modalFormLinkStore";
import { useModalDeleteConfirmStore } from "@/lib/stores/dashboard/modalDeleteConfirm";
import { ModalDeleteConfirmation } from "@/components/ModalDeleteConfirmation";

function Home() {
    const setOpen = useModalFormLinkStore(state => state.setOpen)
    const { user, isLoading } = useAuth()

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <HeadHtml title='Dashboard' />

            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-40 right-20 w-72 h-72 bg-sky-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-40 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>

            <HeaderDashboard title='ShortURL' />

            <main className="relative">
                <div className='max-w-6xl mx-auto px-6 py-6'>
                    {/* Header Section */}
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
                        <div>
                            <h1 className='text-3xl font-bold text-white mb-2'>
                                Your Links {user?.name && <span className="text-lg font-normal text-gray-400">- Welcome {user.name}!</span>}
                            </h1>
                            <p className='text-gray-400'>Manage and track your shortened URLs</p>
                        </div>

                        <button
                            onClick={() => setOpen()}
                            className='inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-sky-500/25'
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add New Link
                        </button>
                    </div>

                    {/* Content */}
                    <div className="bg-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-4">
                        <ContentHome />
                    </div>
                </div>
            </main>

            {/* Modals */}
            <ModalFormLink />
            <ModalDeleteConfirmation />
        </div>
    )
}

// Export the component wrapped with authentication protection
export default withAuth(Home)

