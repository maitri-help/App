module.exports = {
    expo: {
        name: 'Maitri',
        slug: 'MaitriApp',
        version: '1.0.15',
        orientation: 'portrait',
        icon: './assets/icon.png',
        userInterfaceStyle: 'light',
        splash: {
            image: './assets/splash.png',
            resizeMode: 'contain',
            backgroundColor: '#ffffff'
        },
        assetBundlePatterns: ['**/*'],
        ios: {
            supportsTablet: true,
            bundleIdentifier: 'com.maitrihelp.maitri'
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/adaptive-icon.png',
                backgroundColor: '#ffffff'
            },
            androidStatusBar: {
                backgroundColor: '#ffffff',
                barStyle: 'dark-content',
                translucent: true,
                hidden: false
            },
            package: 'com.Maitri.MaitriApp',
            //softwareKeyboardLayoutMode: 'pan',
            config: {
                googleMaps: {
                    apiKey: process.env.GOOGLE_MAPS_API_KEY
                }
            },
            permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
            versionCode: 1,
            versionName: '1.0.15'
        },
        web: {
            favicon: './assets/favicon.png'
        },
        plugins: [
            'expo-font',
            'expo-location',
            'expo-calendar',
            '@logrocket/react-native'
        ],
        extra: {
            eas: {
                projectId: '3a482699-39fe-4fe2-880c-012d3fed9f60'
            }
        }
    }
};
