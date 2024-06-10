import { useEffect, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import useFetch from '../hooks/useFetch';

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    const { data, isLoading, isError } = useFetch(`/task/user`);

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
