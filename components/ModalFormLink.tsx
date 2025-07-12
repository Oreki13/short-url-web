'use client'

import React, { useCallback, useEffect, useMemo } from 'react'
import { TextInput } from './TextInput'
import ModalIndex from './IndexModal'
import { TypeFormAddLink, useManageLink } from "@/lib/hooks/useManageLink";
import { useModalFormLinkStore } from "@/lib/stores/dashboard/modalFormLinkStore";


export const ModalFormLink = () => {
    const { isOpen, setClose, dataLink, setDataLink } = useModalFormLinkStore(state => state)
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
        setIdLink(dataLink?.id ?? "")
        setValue('Title', dataLink?.title ?? "")
        setValue('Destination', dataLink?.destination ?? "")
        setValue('Path', dataLink?.path ?? "")
        handleSetDataLink();

    }, [isOpen, setValue, handleSetDataLink, dataLink])

    return (
        <ModalIndex isOpen={isOpen} onClose={() => {
            setClose()
        }}>
            <div className="p-6">
                {/* Header */}
                <div className='text-center mb-6'>
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-sky-500/20 rounded-xl mb-4">
                        <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </div>
                    <h1 className='text-2xl font-bold text-white mb-2'>{title} Link</h1>
                    <p className='text-gray-400 text-sm'>
                        {title === "Add" ? "Create a new short link for easy sharing" : "Update your existing short link"}
                    </p>
                    {errorMessage && (
                        <div className='mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg'>
                            <p className='text-red-400 text-sm flex items-center gap-2'>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errorMessage}
                            </p>
                        </div>
                    )}
                </div>

                {/* Form */}
                <form onSubmit={typeForm !== TypeFormAddLink.add ? handleSubmit(editLink) : handleSubmit(addLink)} className="space-y-5">
                    <TextInput
                        register={register}
                        label='Title'
                        textOnError={errors.Title?.message}
                    />

                    <TextInput
                        register={register}
                        type='url'
                        name='Destination'
                        label='Destination URL'
                        textOnError={errors.Destination?.message}
                    />

                    {/* Custom Path Input */}
                    <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Custom Path</label>
                        <div className='flex items-center bg-gray-900/50 border border-gray-600 rounded-xl overflow-hidden focus-within:border-sky-500 transition-colors'>
                            <span className='px-4 py-3 text-gray-400 text-sm font-mono bg-gray-800/50 border-r border-gray-600'>
                                https://go.one/
                            </span>
                            <div className="flex-1">
                                <input
                                    {...register("Path")}
                                    className="w-full bg-transparent px-4 py-3 text-white text-sm focus:outline-none placeholder-gray-500"
                                    placeholder="your-custom-path"
                                />
                            </div>
                        </div>
                        {errors.Path?.message && (
                            <p className='text-red-400 text-xs mt-2 flex items-center gap-1'>
                                <span className="text-red-400">⚠</span>
                                {errors.Path?.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading || isSubmitting}
                            className="w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {isLoading || isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {title} Link
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </ModalIndex>
    )
}