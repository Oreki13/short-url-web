import React, { FC } from 'react'
import { TextInput } from './textInput'
import ModalIndex from './indexModal'

type ParamModalAddLink = {
    isOpen: boolean
    onClose: () => any
}

export const ModalAddLink: FC<ParamModalAddLink> = ({ isOpen, onClose }) => {
    return (
        <ModalIndex isOpen={isOpen} onClose={onClose}>
            <>
                <div className="mt-3">
                    <TextInput name='title' label='Title' />
                    <div className='h-2'></div>
                    <TextInput name='destination' label='Destination' />
                    <div className='mt-3'>
                        <span className='font-semibold'>Short Url</span>
                        <div className='flex items-center'>
                            <span className='mr-2'>https://go.one/</span>
                            <TextInput name='backHalf' label='' />
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        type="submit"
                        className=" w-full rounded-md border border-transparent bg-sky-100 px-4 py-2 text-sm font-medium text-sky-900 hover:bg-sky-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                        onClick={onClose}
                    >
                        Add Link
                    </button>
                </div>
            </>
        </ModalIndex>
    )
}


export default ModalAddLink