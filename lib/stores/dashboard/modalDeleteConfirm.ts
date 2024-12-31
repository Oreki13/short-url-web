import {create} from "zustand/react";

export type ModalDeleteConfirmState = {
    isOpen: boolean
    id: string | null
}

export type ModalDeleteConfirmAction = {
    setOpen: (id: string) => void
    setClose: () => void
}

export type ModalDeleteConfirmStore = ModalDeleteConfirmState & ModalDeleteConfirmAction

export const useModalDeleteConfirmStore = create<ModalDeleteConfirmStore>((set) => ({
    isOpen: false,
    id: null,
    setOpen: (id: string) => set({isOpen: true, id}),
    setClose: () => set({isOpen: false}),
}))