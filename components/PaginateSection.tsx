import {FC} from "react";
import {PagingData} from "@/type/ApiResponse";

type ParamPaginateSection = {
    page: number
    handleChangePage: (page: number) => void,
    paging: PagingData,
}

export const PaginateSection: FC<ParamPaginateSection> = ({page, handleChangePage, paging}) => {

    return (
        <>
            <div
                className="flex  items-center justify-between border-t border-gray-200 bg-white  py-3 overflow-scroll">
                <div className=" sm:flex sm:flex-1 sm:items-center sm:justify-between w-full">
                    <div className="hidden sm:block">
                        <p className="text-sm text-gray-700">
                            Showing
                            <span className="font-medium"> {paging.current_page} </span>
                            to
                            <span className="font-medium"> {paging.total_page} </span>
                            of
                            <span className="font-medium"> {paging.total_data} </span>
                            results
                        </p>
                    </div>
                    <div className="w-full text-center sm:w-auto ">
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                             aria-label="Pagination">
                            <button onClick={() => (page - 1) >= 1 ? handleChangePage(page - 1) : null}
                                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                <span className="sr-only">Previous</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"
                                     aria-hidden="true">
                                    <path fillRule="evenodd"
                                          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                          clipRule="evenodd"/>
                                </svg>
                            </button>
                            {generatePages(paging.total_page, paging.current_page, 3, handleChangePage)}
                            <button onClick={() => (page + 1) <= paging.total_page ? handleChangePage(page + 1) : null}
                                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                <span className="sr-only">Next</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"
                                     aria-hidden="true">
                                    <path fillRule="evenodd"
                                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                          clipRule="evenodd"/>
                                </svg>
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    )
}

const generatePages = (totalPages: number, currentPage: number, rangePage: number, handleChangePage: (page: number) => void) => {
    const pages = [];
    const classUnselected: string = "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0";
    const classSelected: string = "relative z-10 inline-flex items-center bg-sky-950 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";

    if (totalPages <= rangePage * 2 + 1) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        const startPages = Array.from({ length: rangePage }, (_, i) => i + 1);
        const endPages = Array.from({ length: rangePage }, (_, i) => totalPages - rangePage + 1 + i);
        const middlePages = Array.from({ length: rangePage * 2 + 1 }, (_, i) => currentPage - rangePage + i).filter(page => page > rangePage && page <= totalPages - rangePage);

        pages.push(...startPages);

        if (middlePages[0] > rangePage + 1) {
            pages.push('...');
        }

        pages.push(...middlePages);

        if (middlePages[middlePages.length - 1] < totalPages - rangePage) {
            pages.push('...');
        }

        pages.push(...endPages);
    }

    return pages.map((page, index) => {
        if (page === '...') {
            return (
                <span key={index}
                      className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span>
            );
        }
        return (
            <button onClick={() => handleChangePage(Number(page))} aria-current="page" key={page}
                    className={currentPage === page ? classSelected : classUnselected}>{page}</button>
        );
    });
}

const generateListPages = (totalPages: number, rangePage: number,) => {
    const pages: Array<number> = [];
    const endRange: number = totalPages - rangePage;

    if (totalPages <= rangePage || totalPages <= endRange) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        for (let i = 1; i <= rangePage; i++) {
            pages.push(i);
        }

        for (let i = endRange; i <= totalPages; i++) {
            pages.push(i);
        }
    }

    return pages;
}

