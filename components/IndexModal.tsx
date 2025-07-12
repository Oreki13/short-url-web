import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition } from '@headlessui/react'
import React, { FC, Fragment, type JSX } from 'react';

type ParamModalIndex = {
    isOpen: boolean
    onClose: () => any
    children: JSX.Element
}

export const ModalIndex: FC<ParamModalIndex> = ({ isOpen, onClose, children }) => {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/60 backdrop-blur-sm duration-300 ease-out data-[closed]:opacity-0"
            />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel
                    transition
                    className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                    {children}
                </DialogPanel>
            </div>
        </Dialog>
    )
}


export default ModalIndex