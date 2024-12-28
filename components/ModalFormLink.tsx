import React, {FC} from 'react'
import {TextInput} from './TextInput'
import ModalIndex from './IndexModal'
import {useAddLink} from "@/lib/hooks/useAddLink";
import {useModalFormLinkStore} from "@/lib/stores/modalFormLinkStore";


export const ModalFormLink = () => {
    const {isOpen, setClose, dataLink, setDataLink}= useModalFormLinkStore(state => state)
    const {register, handleSubmit, errors, isSubmitting, isLoading, onSubmit, errorMessage} = useAddLink(setClose);
    const title = dataLink !== null ? "Edit" : 'Add'
    return (
        <ModalIndex isOpen={isOpen} onClose={()=> {
            setClose()
            setDataLink(null)
        }}>
            <>
                <div className='text-center'>
                    <h1 className='text-2xl font-semibold'>{title} Link</h1>
                    {errorMessage && <p className='text-red-500 font-semibold text-xs mt-1'>{errorMessage}</p>}
                </div>
                <form onSubmit={() => handleSubmit(onSubmit)}>
                    <div className="mt-3" onSubmit={() => handleSubmit(onSubmit)}>
                        <TextInput register={register} label='Title' textOnError={errors.Title?.message} value={dataLink?.title}/>
                        <div className='h-2'></div>
                        <TextInput register={register} label='Destination' textOnError={errors.Destination?.message} value={dataLink?.destination}/>
                        <div className='mt-3'>
                            <span className='font-semibold'>Short Url</span>
                            <div className='flex items-center mt-3'>
                                <span className='mr-2'>https://go.one/</span>
                                <TextInput register={register} label='' name="Path" textOnError={errors.Path?.message} value={dataLink?.path}/>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            type="submit"
                            className=" w-full rounded-md border border-transparent bg-sky-100 px-4 py-2 text-sm font-medium text-sky-900 hover:bg-sky-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                            onClick={handleSubmit(onSubmit)}
                        >
                            {isLoading || isSubmitting ? "Loading" : title + " Link"}
                        </button>
                    </div>
                </form>
            </>
        </ModalIndex>
    )
}