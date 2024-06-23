import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './components/Navigators/MainNavigator';
import { Providers } from './providers/Providers';

export default function App() {
    return (
        <Providers>
            <NavigationContainer>
                <MainNavigator />
            </NavigationContainer>
        </Providers>
    );
}
