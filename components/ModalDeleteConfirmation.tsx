import ModalIndex from "@/components/IndexModal";
import {useModalDeleteConfirmStore} from "@/lib/stores/dashboard/modalDeleteConfirm";
import {useManageLink} from "@/lib/hooks/useManageLink";

export const ModalDeleteConfirmation = () => {
    const {isOpen, setClose, id} = useModalDeleteConfirmStore(state => state)
    const {deleteLink, isLoadingDelete} = useManageLink();


    return (
        <ModalIndex isOpen={isOpen} onClose={setClose} >
            <div>
                <h1 className='text-xl text-center font-semibold'>Delete Link</h1>
                <p className='text-lg mt-1'>Are you sure want to delete this link?</p>
                <div className="flex justify-between gap-1 mt-5">
                    <button className='bg-red-800 text-white py-2 px-5 rounded hover:bg-red-900 w-full' onClick={()=> deleteLink(id ?? '')}>{isLoadingDelete ? "Loading": "Delete"}</button>
                    <button className='bg-sky-900 text-white py-2 px-5 rounded hover:bg-sky-950 w-full' onClick={setClose}>Cancel</button>
                </div>
            </div>
        </ModalIndex>
        )
}