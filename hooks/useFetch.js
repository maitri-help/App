import { useState, useEffect } from 'react';
import { api } from '../lib/axios';
import { checkAuthentication } from '../authStorage';

const useFetch = (url) => {
    // Loading state
    const [isLoading, setIsLoading] = useState(true);
    // Error state
    const [isError, setIsError] = useState(false);

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            //TODO: improve userdata fetching
            const userData = await checkAuthentication();

            if (userData) {
                try {
                    const response = await api.get(
                        `${url}/${userData?.userId}`,
                        {
                            headers: {
                                //TODO: improve authorization header
                                Authorization: `Bearer ${userData?.accessToken}`
                            }
                        }
                    );
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
            }
        };

        fetchData();
    }, [url]);

    return { data, isLoading, isError };
};

export default useFetch;
