import { useState, useEffect } from 'react';
import { api } from '../lib/axios';

const useFetch = (url) => {
    if (!url) return;

    // Loading state
    const [isLoading, setIsLoading] = useState(true);
    // Error state
    const [isError, setIsError] = useState(false);

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const response = await api.get(`${url}`);
                setData(response?.data);
            } catch (error) {
                // TODO: Add toast notification
                // toast.show(error.response.data.message, {
                //     type: 'error'
                // });
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [url]);

    return { data, isLoading, isError };
};

export default useFetch;
