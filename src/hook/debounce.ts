const debounce = <T extends (...args: any[]) => void>(callback: T, delay = 1000) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            callback(...args);
        }, delay);
    };
};
export {
    debounce
}