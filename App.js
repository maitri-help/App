import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './components/Navigators/MainNavigator';
import { Providers } from './providers/Providers';
import LogRocket from '@logrocket/react-native';
import { LOGROCKET_APP_ID } from './constants/config';

LogRocket.init(LOGROCKET_APP_ID);

export default function App() {
    return (
        <Providers>
            <NavigationContainer>
                <MainNavigator />
            </NavigationContainer>
        </Providers>
    );
}
