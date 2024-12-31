import {create} from "zustand/react";
import {ShortUrlData} from "@/type/AddShortUrl";

export type ModalFormLinkState = {
    isOpen: boolean
    dataLink: ShortUrlData | null
}

export type ModalFormLinkAction = {
    setOpen: () => void
    setClose: () => void
    setDataLink: (data?: ShortUrlData | null) => void
}

export type ModalFormLinkStore = ModalFormLinkState & ModalFormLinkAction

export const useModalFormLinkStore = create<ModalFormLinkStore>((set) => ({
    isOpen: false,
    dataLink: null,
    setOpen: () => set({isOpen: true}),
    setClose: () => set({isOpen: false}),
    setDataLink: (data) => set({dataLink: data})
}))