import {useFetchListShortUrl} from "@/lib/hooks/useFetchListShortUrl";
import {CircularProgress} from "@/components/CircularProgress";
import {NoDataFound} from "@/components/NoDataFound";
import dayjs from "dayjs";
import {Button} from "@headlessui/react";
import {PaginateSection} from "@/components/PaginateSection";
import {usePaginationStore} from "@/lib/stores/dashboard/paginationStore";
import {useModalFormLinkStore} from "@/lib/stores/dashboard/modalFormLinkStore";
import {useModalDeleteConfirmStore} from "@/lib/stores/dashboard/modalDeleteConfirm";

export const ContentHome = () => {
    const {currentPage, setCurrentPage} = usePaginationStore(state => state)
    const {setOpen, setDataLink} = useModalFormLinkStore(state => state)
    const {setOpen: openDeleteDialog} = useModalDeleteConfirmStore(state => state)
    const {data, error, isLoading} = useFetchListShortUrl();
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

    if (isLoading) return <CircularProgress/>
    if (error) return <p>Error</p>
    if (data === undefined || data.data === undefined || data!.status == "ERROR") return <p>Data is undefined</p>
    if (data!.data.data.length === 0) return <NoDataFound/>

    return (
        <>
            <div className="mt-7 overflow-scroll">
                <table className="border-collapse min-w-[650px] w-full ">
                    <thead className="rounded-t-lg ">
                    <tr className='bg-sky-900'>
                        <th className="rounded-tl-lg text-white p-2">Name</th>
                        <th className="text-white">Path</th>
                        <th className="text-white">Clicked</th>
                        <th className="text-white">Updated At</th>
                        <th className="text-white rounded-tr-lg">Action</th>
                    </tr>
                    </thead>

                    <tbody className="rounded-b-lg">
                    {
                        data!.data.data.map((val, index) =>
                            <tr className="rounded-b-lg" key={index}>
                                <td className="border border-sky-900 px-2 py-1 rounded-bl-lg">{val.title}</td>
                                <td onClick={() => redirect(val.path)}
                                    className="border border-sky-900 px-2 py-1 cursor-pointer hover:text-sky-600 ">{val.destination}</td>
                                <td className="border border-sky-900 px-2 py-1 rounded-br-lg">{val.count_clicks}</td>
                                <td className="border border-sky-900 px-2 py-1 rounded-br-lg">{dayjs(val.createdAt).format('D MMMM YYYY')}</td>
                                <td className="border border-sky-900 px-2 py-1 text-center ">
                                    <div className="flex">
                                        <Button className='text-white bg-sky-900 px-2 py-1 rounded mr-1 w-full'
                                                onClick={() => {
                                                    setOpen()
                                                    setDataLink(val)
                                                }}>Edit</Button>
                                        <Button className='text-white bg-orange-800 px-2 py-1 rounded w-full'
                                                onClick={() => openDeleteDialog(val.id)}>Delete</Button>
                                    </div>
                                </td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>

            <PaginateSection paging={data!.data.paging} page={currentPage} handleChangePage={handleChangePage}/>
        </>

    )
}