import {useSearchParams} from "react-router-dom";

const usePageQuery = () => {
    const [params, setParams] = useSearchParams({ page: '1' });
    const page = parseInt(params.get('page') || '1', 10);

    return {
        page,
        setPage: (newPage: number) => setParams({ ...Object.fromEntries(params.entries()), page: newPage.toString() }),
        prevPage: () => setParams({ ...Object.fromEntries(params.entries()), page: Math.max(1, page - 1).toString() }),
        nextPage: (totalPages: number) => setParams({ ...Object.fromEntries(params.entries()), page: Math.min(totalPages, page + 1).toString() }),
    };
};

const generatePageNumbers = (currentPage: number, totalPages: number) => {
    const pageNumbers = [];

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else if (currentPage <= 4) {
        for (let i = 1; i <= 7; i++) {
            pageNumbers.push(i);
        }
        pageNumbers.push('...', totalPages);
    } else if (currentPage > totalPages - 4) {
        pageNumbers.push(1, '...');
        for (let i = totalPages - 6; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        pageNumbers.push(1, '...');
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
            pageNumbers.push(i);
        }
        pageNumbers.push('...', totalPages);
    }

    return pageNumbers;
};

export {
    usePageQuery,
    generatePageNumbers
}