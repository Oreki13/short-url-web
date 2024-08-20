import {Button, Description, Dialog, DialogPanel, DialogTitle, Transition, TransitionChild} from "@headlessui/react";
import {FC} from "react";

interface DialogComponentProps {
    isOpen: boolean;
    onClickClose: () => void;
}

export const DialogComponent: FC<DialogComponentProps> = ({isOpen, onClickClose}) => {
    return (
        <Transition appear show={isOpen}>
            <Dialog as="div" className="relative z-10 focus:outline-none" onClose={() => onClickClose()}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <TransitionChild
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 transform-[scale(95%)]"
                            enterTo="opacity-100 transform-[scale(100%)]"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 transform-[scale(100%)]"
                            leaveTo="opacity-0 transform-[scale(95%)]"
                        >
                            <DialogPanel
                                className="w-full max-w-md rounded-xl bg-white/10 p-6 backdrop-blur-2xl shadow-gray-400 shadow-lg">
                                <DialogTitle as="h3" className="text-base/7 font-medium text-black">
                                    Payment successful
                                </DialogTitle>
                                <p className="mt-2 text-sm/6 text-black/50">
                                    Your payment has been successfully submitted. We’ve sent you an email with all of
                                    the details of
                                    your order.
                                </p>
                                <div className="mt-4 flex">
                                    <Button
                                        className="inline-flex items-center gap-2 rounded-md bg-sky-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-sky-600 data-[open]:bg-sky-700 data-[focus]:outline-1 data-[focus]:outline-white w-full flex justify-center"
                                        onClick={() => onClickClose()}
                                    >
                                        Yes
                                    </Button>
                                    <div className="mx-2"></div>
                                    <Button
                                        className="inline-flex items-center gap-2 rounded-md bg-red-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-red-600 data-[open]:bg-red-700 data-[focus]:outline-1 data-[focus]:outline-white w-full flex justify-center"
                                    onClick={() => onClickClose()}
                                >
                                    No
                                </Button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}