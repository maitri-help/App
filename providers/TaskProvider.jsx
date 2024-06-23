import { useEffect, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import { useUser } from '../context/UserContext';
import { fetchTasks } from '../hooks/api';

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const { userData } = useUser();

    useEffect(() => {
        const fetchData = async () => {
            if (!userData) return;

            setIsLoading(true);
            setIsError(false);

            try {
                const tasksResponse = await fetchTasks(userData);
                setTasks(tasksResponse);
            } catch (error) {
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userData]);

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
