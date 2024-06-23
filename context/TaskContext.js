import React, { useContext } from 'react';

export const taskDefaultValue = {
    tasks: [],
    setTasks: () => {}
};

export const TaskContext = React.createContext(taskDefaultValue);

export const useTask = () => useContext(TaskContext);
