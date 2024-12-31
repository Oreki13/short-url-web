import {Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition} from '@headlessui/react'
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
                className="fixed inset-0 bg-black/30 duration-300 ease-out data-[closed]:opacity-0"
            />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-2">
                <DialogPanel
                    transition
                    className="space-y-4 bg-white py-8 px-10 duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 rounded-lg"
                >
                    {children}
                </DialogPanel>
            </div>
        </Dialog>
    )
}


export default ModalIndex