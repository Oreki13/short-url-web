import {create} from "zustand/react";

export type PaginationState = {
    currentPage: number,
    limit: number,
}

export type PaginationAction = {
    setCurrentPage: (currentPage: number) => void
}

export type PaginationStore = PaginationState & PaginationAction

export const initPaginationStore = (): PaginationState => {
    return {
        currentPage: 1,
        limit: 5
    }
}

export const usePaginationStore =  create<PaginationStore>((set) => ({
    currentPage: 1,
    limit: 5,
    setCurrentPage: (currentPage: number) => set({currentPage}),
}))