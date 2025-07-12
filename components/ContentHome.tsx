import { useFetchListShortUrl } from "@/lib/hooks/useFetchListShortUrl";
import { CircularProgress } from "@/components/CircularProgress";
import { NoDataFound } from "@/components/NoDataFound";
import dayjs from "dayjs";
import { Button } from "@headlessui/react";
import { PaginateSection } from "@/components/PaginateSection";
import { usePaginationStore } from "@/lib/stores/dashboard/paginationStore";
import { useModalFormLinkStore } from "@/lib/stores/dashboard/modalFormLinkStore";
import { useModalDeleteConfirmStore } from "@/lib/stores/dashboard/modalDeleteConfirm";

export const ContentHome = () => {
    const { currentPage, setCurrentPage } = usePaginationStore(state => state)
    const { setOpen, setDataLink } = useModalFormLinkStore(state => state)
    const { setOpen: openDeleteDialog } = useModalDeleteConfirmStore(state => state)
    const { data, error, isLoading } = useFetchListShortUrl();

    const handleChangePage = (toPage: number) => {
        setCurrentPage(toPage);
    }

    const redirect = async (path: string) => {
        const host = process.env.NEXT_PUBLIC_GO_HOST
        try {
            return await fetch(host + '/' + path);
        } catch (err) {
            console.log(err);
        }
    }

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            // You can add a toast notification here
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }

    if (isLoading) return <CircularProgress />
    if (error) return <p>Error</p>
    if (data === undefined || data.data === undefined || data!.status == "ERROR") return <p>Data is undefined</p>
    if (data!.data.data.length === 0) return <NoDataFound />

    return (
        <div className="space-y-4">
            {/* Compact List Layout */}
            <div className="space-y-3">
                {data!.data.data.map((val) => (
                    <div key={val.id} className="group bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/60 hover:border-gray-600 transition-all duration-200">
                        {/* Header Row - Title, Date, Actions */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-base font-semibold text-white group-hover:text-sky-400 transition-colors truncate">
                                        {val.title}
                                    </h3>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-sky-500/10 rounded-md border border-sky-500/20 shrink-0">
                                        <svg className="w-3.5 h-3.5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span className="text-sky-400 font-medium text-xs">{val.count_clicks}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {dayjs(val.createdAt).format('D MMM YYYY')}
                                </div>
                            </div>

                            {/* Action Buttons - Compact */}
                            <div className="flex gap-2 shrink-0">
                                <button
                                    className='p-2 bg-sky-600/80 hover:bg-sky-600 text-white rounded-lg transition-all duration-200 group/edit'
                                    onClick={() => {
                                        setOpen()
                                        setDataLink(val)
                                    }}
                                    title="Edit Link"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    className='p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-all duration-200 group/delete'
                                    onClick={() => openDeleteDialog(val.id)}
                                    title="Delete Link"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* URLs Row - Compact */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            {/* Short URL */}
                            <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-600/50">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-400 mb-1">Short URL</p>
                                        <a
                                            href={"https://s.ar-fandy.dev/" + val.path}
                                            target="_blank"
                                            className="text-sky-400 hover:text-sky-300 font-mono text-sm truncate block transition-colors"
                                        >
                                            s.ar-fandy.dev/{val.path}
                                        </a>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(process.env.NEXT_PUBLIC_GO_HOST + "/" + val.path)}
                                        className="p-1.5 hover:bg-gray-700/50 rounded-md transition-colors group/copy shrink-0"
                                        title="Copy Short URL"
                                    >
                                        <svg className="w-4 h-4 text-gray-400 group-hover/copy:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Destination URL */}
                            <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-600/50">
                                <p className="text-xs text-gray-400 mb-1">Destination</p>
                                <a
                                    href={val.destination}
                                    target="_blank"
                                    className="text-gray-300 hover:text-white text-sm transition-colors truncate block"
                                    title={val.destination}
                                >
                                    {val.destination}
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <PaginateSection paging={data!.data.paging} page={currentPage} handleChangePage={handleChangePage} />
        </div>
    )
}