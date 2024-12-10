import {useSearchParams} from "react-router-dom";

const usePageQuery = () => {
    const [params, setParams] = useSearchParams({page: '1'});
    const page = params.get('page');

    return {
        page,
        prevPage: () => setParams(prev => {
            const currentPage = +(prev.get('page') ?? '1');
            prev.set('page', (currentPage - 1).toString());
            return prev;
        }),
        nextPage: () => setParams(prev => {
            const currentPage = +(prev.get('page') ?? '1');
            prev.set('page', (currentPage + 1).toString());
            return prev;
        })

    }
}
export {
    usePageQuery
}