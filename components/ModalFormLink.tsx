'use client'

import React, {useCallback, useEffect, useMemo} from 'react'
import {TextInput} from './TextInput'
import ModalIndex from './IndexModal'
import {TypeFormAddLink, useManageLink} from "@/lib/hooks/useManageLink";
import {useModalFormLinkStore} from "@/lib/stores/dashboard/modalFormLinkStore";


export const ModalFormLink = () => {
    const {isOpen, setClose, dataLink, setDataLink} = useModalFormLinkStore(state => state)
    const {
        register,
        errors,
        isSubmitting,
        isLoading,
        addLink,
        editLink,
        errorMessage,
        setValue,
        handleSubmit,
        setIdLink,
    } = useManageLink();
    const title = useMemo(() => dataLink !== null ? "Edit" : "Add", [dataLink]);
    const typeForm = useMemo(() => dataLink !== null ? TypeFormAddLink.edit : TypeFormAddLink.add, [dataLink]);

    const handleSetDataLink = useCallback(() => {
        if (dataLink !== null && !isOpen) {
            setTimeout(() => {
                setDataLink(null)
            }, 300)
        }
    }, [dataLink, isOpen, setDataLink]);

    useEffect(() => {
        handleSetDataLink();
        setIdLink(dataLink?.id ?? "")
        setValue('Title', dataLink?.title ?? "")
        setValue('Destination', dataLink?.destination ?? "")
        setValue('Path', dataLink?.path ?? "")
    }, [isOpen, dataLink, setValue, handleSetDataLink])


    return (
        <ModalIndex isOpen={isOpen} onClose={() => {
            setClose()
        }}>
            <>
                <div className='text-center'>
                    <h1 className='text-2xl font-semibold'>{title} Link</h1>
                    {errorMessage && <p className='text-red-500 font-semibold text-xs mt-1'>{errorMessage}</p>}
                </div>
                <form onSubmit={typeForm !== TypeFormAddLink.add ? handleSubmit(editLink) : handleSubmit(addLink)}>
                    <div className="mt-3">
                        <TextInput register={register} label='Title' textOnError={errors.Title?.message}
                        />
                        <div className='h-2'></div>
                        <TextInput register={register} label='Destination' textOnError={errors.Destination?.message}
                        />
                        <div className='mt-3'>
                            <span className='font-semibold'>Short Url</span>
                            <div className='flex items-center mt-3'>
                                <span className='mr-2'>https://go.one/</span>
                                <TextInput register={register} label='' name="Path" textOnError={errors.Path?.message}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            type="submit"
                            className=" w-full rounded-md border border-transparent bg-sky-900 px-4 py-2 text-sm font-medium text-sky-50 hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                            onClick={typeForm !== TypeFormAddLink.add ? handleSubmit(editLink) : handleSubmit(addLink)}
                        >
                            {isLoading || isSubmitting ? "Loading" : title + " Link"}
                        </button>
                    </div>
                </form>
            </>
        </ModalIndex>
    )
}