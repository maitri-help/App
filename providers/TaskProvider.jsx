import { useEffect, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import useFetch from '../hooks/useFetch';
import { useUser } from '../context/UserContext';

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [fetchUrl, setFetchUrl] = useState('');
    const { data, isLoading, isError } = useFetch(fetchUrl);

    const { userData } = useUser();

    useEffect(() => {
        if (!userData) return;

        if (userData?.userType === 'Lead') {
            setFetchUrl(`/task/user/${userData?.userId}`);
        } else {
            setFetchUrl(`/users/supporter/lead-user`);
        }
    }, [userData]);

    useEffect(() => {
        setTasks(data);
    }, [data]);

    return (
        <TaskContext.Provider
            value={{
                tasks,
                setTasks,
                isLoading,
                isError
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};
