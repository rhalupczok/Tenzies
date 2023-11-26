import { useState, useEffect } from "react";

const getLocalValue = (key: string, initValue: string | boolean | Function) => {
    //SSR Next.js
    if (typeof window === "undefined") return initValue;

    // if a value is already store
    const value = localStorage.getItem(key);
    if (typeof value === "string") {
        const localValue = JSON.parse(value);
        if (localValue) return localValue;
    }

    // return result of a function
    if (initValue instanceof Function) return initValue();

    return initValue;
};

const useLocalStorage = (
    key: string,
    initValue: string | boolean | Function
) => {
    const [value, setValue] = useState(() => {
        return getLocalValue(key, initValue);
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};

export default useLocalStorage;
