import React, { useContext } from 'react';

const defaultValue = {
    deviceLocation: null
};

export const LocationContext = React.createContext(defaultValue);

export const useLocation = () => useContext(LocationContext);
