module.exports = {
    expo: {
        name: 'MaitriApp',
        slug: 'MaitriApp',
        version: '1.0.8',
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
            bundleIdentifier: 'MaitriApp'
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/adaptive-icon.png',
                backgroundColor: '#ffffff'
            },
            package: 'com.Maitri.MaitriApp',
            config: {
                googleMaps: {
                    apiKey: process.env.GOOGLE_MAPS_API_KEY
                }
            },
            permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
            versionCode: 1,
            versionName: '1.0.8'
        },
        web: {
            favicon: './assets/favicon.png'
        },
        plugins: ['expo-font', 'expo-location', 'expo-calendar'],
        extra: {
            eas: {
                projectId: '3a482699-39fe-4fe2-880c-012d3fed9f60'
            }
        }
    }
};