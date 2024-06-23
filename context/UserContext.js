import React, { useContext } from 'react';

export const userDefaultValue = {
    user: {},
    setUser: () => {}
};

export const UserContext = React.createContext(userDefaultValue);

export const useUser = () => useContext(UserContext);
