import { Button, Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { FC } from "react";

interface DialogComponentProps {
    isOpen: boolean;
    onClickClose: () => void;
    onClickYes?: () => void,
    onClickNo?: () => void,
    title: string,
    content: string,
    actionType?: DialogActionType,
    textYes?: string,
    textNo?: string
}

type DialogActionType = "YES" | "NO";

export const DialogComponent: FC<DialogComponentProps> = ({
    isOpen,
    onClickClose,
    onClickNo,
    onClickYes,
    title,
    content,
    actionType,
    textYes,
    textNo,
}) => {
    return (
        <Transition appear show={isOpen}>
            <Dialog as="div" className="relative z-50 focus:outline-none" onClose={() => onClickClose()}>
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"></div>
                <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <TransitionChild
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 transform-[scale(95%)]"
                            enterTo="opacity-100 transform-[scale(100%)]"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 transform-[scale(100%)]"
                            leaveTo="opacity-0 transform-[scale(95%)]"
                        >
                            <DialogPanel className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-2xl">
                                {/* Icon */}
                                <div className="flex justify-center mb-4">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-xl">
                                        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5C3.544 18.333 4.506 20 6.046 20z" />
                                        </svg>
                                    </div>
                                </div>

                                <DialogTitle as="h3" className="text-xl font-bold text-white text-center mb-2">
                                    {title}
                                </DialogTitle>
                                <p className="text-sm text-gray-400 text-center mb-6">
                                    {content}
                                </p>

                                <div className="flex gap-3">
                                    <ButtonActionDialog
                                        onClickYes={() => onClickYes === undefined ? onClickClose() : onClickYes()}
                                        onClickNo={() => onClickNo === undefined ? onClickClose() : onClickNo()}
                                        actionType={actionType}
                                        textYes={textYes ?? "Yes"}
                                        textNo={textNo ?? "No"}
                                    />
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

interface ButtonActionDialogProps {
    onClickYes?: () => void,
    onClickNo?: () => void,
    actionType: DialogActionType | undefined,
    textYes: string,
    textNo: string
}

const ButtonActionDialog: FC<ButtonActionDialogProps> = ({ onClickYes, onClickNo, actionType, textYes, textNo, }) => {
    if (actionType === "YES") {
        return (
            <Button
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                onClick={() => onClickYes!()}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {textYes}
            </Button>
        )
    }
    if (actionType === "NO") {
        return (
            <Button
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                onClick={() => onClickNo!()}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {textNo}
            </Button>
        )
    }

    return (
        <>
            <Button
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                onClick={() => onClickYes!()}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {textYes}
            </Button>
            <Button
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ml-3"
                onClick={() => onClickNo!()}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {textNo}
            </Button>
        </>
    )
}