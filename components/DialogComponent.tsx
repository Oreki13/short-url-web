import {Button, Dialog, DialogPanel, DialogTitle, Transition, TransitionChild} from "@headlessui/react";
import {FC} from "react";

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
                                className="w-full max-w-md rounded-xl bg-gray-300/30 backdrop-blur-md p-6  shadow-gray-700 shadow-2xl">
                                <DialogTitle as="h3" className="text-xl font-bold text-black text-center">
                                    {title}
                                </DialogTitle>
                                <p className="mt-2 text-sm/6 text-black/70 text-center">
                                    {content}
                                </p>
                                <div className="mt-4 flex">
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

const ButtonActionDialog: FC<ButtonActionDialogProps> = ({onClickYes, onClickNo, actionType, textYes, textNo,}) => {
    const buttonColor = actionType === "YES" ? "bg-sky-700 data-[hover]:bg-sky-600 data-[open]:bg-sky-700" : "bg-red-700 data-[hover]:bg-red-600 data-[open]:bg-red-700";
    const buttonClass = "inline-flex items-center gap-2 rounded-md  py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white w-full flex justify-center " + buttonColor;
    if (actionType === "YES") {
        return (
            <Button
                className={buttonClass}
                onClick={() => onClickYes!()}
            >
                {textYes}
            </Button>
        )
    }
    if (actionType === "NO") {
        return (
            <Button
                className={buttonClass}
                onClick={() => onClickNo!()}
            >
                {textNo}
            </Button>
        )
    }

    return (
        <>
            <Button
                className={buttonClass}
                onClick={() => onClickYes!()}
            >
                {textYes}
            </Button>
            <Button
                className={buttonClass}
                onClick={() => onClickNo!()}
            >
                {textNo}
            </Button>
        </>
    )

}