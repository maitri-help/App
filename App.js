import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './components/Navigators/MainNavigator';
import { Providers } from './providers/Providers';
import LogRocket from '@logrocket/react-native';
import { LOGROCKET_APP_ID } from './constants/config';
import IAPService from './services/IAPService';

LogRocket.init(LOGROCKET_APP_ID);

export default function App() {
    useEffect(() => {
        const initIAP = async () => {
            try {
                await IAPService.init();
                const products = await IAPService.getAvailableSubscriptions();
                if (products.length > 0) {
                    console.log('Available subscriptions:', products.map(p => ({
                        id: p.productId,
                        title: p.title,
                        price: p.localizedPrice
                    })));
                } else {
                    console.log('No subscriptions available');
                }
            } catch (error) {
                console.log('Failed to initialize IAP');
            }
        };

        initIAP();

        return () => {
            IAPService.cleanup();
        };
    }, []);

    return (
        <Providers>
            <NavigationContainer>
                <MainNavigator />
            </NavigationContainer>
        </Providers>
    );
}
