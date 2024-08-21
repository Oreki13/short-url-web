import React, {FC} from 'react'
import {TextInput} from './TextInput'
import ModalIndex from './index_modal'
import {useAddLink} from "@/hooks/useAddLink";

type ParamModalAddLink = {
    isOpen: boolean
    onClose: () => any
}

export const ModalAddLink: FC<ParamModalAddLink> = ({isOpen, onClose}) => {
    const {register, handleSubmit, errors, isSubmitting, isLoading, onSubmit, errorMessage} = useAddLink(onClose);
    return (
        <ModalIndex isOpen={isOpen} onClose={onClose}>
            <>
                <div className='text-center'>
                    <h1 className='text-2xl font-semibold'>Add Link</h1>
                    {errorMessage && <p className='text-red-500 font-semibold text-xs mt-1'>{errorMessage}</p>}
                </div>
                <form onSubmit={() => handleSubmit(onSubmit)}>
                    <div className="mt-3" onSubmit={() => handleSubmit(onSubmit)}>
                        <TextInput register={register} label='Title' textOnError={errors.Title?.message}/>
                        <div className='h-2'></div>
                        <TextInput register={register} label='Destination' textOnError={errors.Destination?.message}/>
                        <div className='mt-3'>
                            <span className='font-semibold'>Short Url</span>
                            <div className='flex items-center mt-3'>
                                <span className='mr-2'>https://go.one/</span>
                                <TextInput register={register} label='' name="Path" textOnError={errors.Path?.message}/>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            type="submit"
                            className=" w-full rounded-md border border-transparent bg-sky-100 px-4 py-2 text-sm font-medium text-sky-900 hover:bg-sky-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                            onClick={handleSubmit(onSubmit)}
                        >

                            {isLoading || isSubmitting ? "Loading" : "Add Link"}

                        </button>
                    </div>
                </form>
            </>
        </ModalIndex>
    )
}


export default ModalAddLink