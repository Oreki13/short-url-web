import {useFetchListShortUrl} from "@/lib/hooks/useFetchListShortUrl";
import {CircularProgress} from "@/components/CircularProgress";
import {NoDataFound} from "@/components/NoDataFound";
import dayjs from "dayjs";
import {Button} from "@headlessui/react";
import {PaginateSection} from "@/components/PaginateSection";
import {usePaginationStore} from "@/lib/stores/paginationStore";
import {useModalFormLinkStore} from "@/lib/stores/modalFormLinkStore";

export const ContentHome = () => {
    const {currentPage, setCurrentPage}= usePaginationStore(state => state)
    const {setOpen, setDataLink} = useModalFormLinkStore(state => state)
    const {data, error, isLoading} = useFetchListShortUrl(currentPage, 5);
    const handleChangePage = (toPage: number) => {
        setCurrentPage(toPage);
    }
    const redirect = async (path:string) => {
        const host = process.env.NEXT_PUBLIC_GO_HOST
        try {
            return await fetch(host +'/' +  path);
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
            <table className="border-collapse w-full ">
                <thead className="rounded-t-lg ">
                <tr className='bg-sky-900'>
                    <th className="rounded-tl-lg text-white p-2" >Name</th>
                    <th className="text-white" >Path</th>
                    <th className="text-white">Updated At</th>
                    <th className="text-white rounded-tr-lg" >Action</th>
                </tr>
                </thead>
                <tbody className="rounded-b-lg">
                {
                    data!.data.data.map((val, index) =>
                        <tr className="rounded-b-lg" key={index}>
                            <td className="border border-sky-900 px-2 py-1 rounded-bl-lg">{val.title}</td>
                            <td onClick={()=>redirect(val.path)} className="border border-sky-900 px-2 py-1 cursor-pointer hover:text-sky-600 ">{val.destination}</td>
                            <td className="border border-sky-900 px-2 py-1 rounded-br-lg">{dayjs(val.createdAt).format('D MMMM YYYY')}</td>
                            <td className="border border-sky-900 px-2 py-1 text-center flex">
                                <Button className='text-white bg-sky-900 px-2 py-1 rounded mr-1 w-full' onClick={()=>{
                                    setOpen()
                                    setDataLink(val)
                                }}>Edit</Button>
                                <Button className='text-white bg-orange-800 px-2 py-1 rounded w-full'>Delete</Button>
                            </td>
                        </tr>
                    )
                }
                </tbody>
            </table>
            <PaginateSection paging={data!.data.paging} page={currentPage} handleChangePage={handleChangePage}/>
        </>

    )
}