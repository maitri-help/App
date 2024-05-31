module.exports = {
    expo: {
        name: 'Maitri',
        slug: 'Maitri',
        version: '1.0.9',
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
            bundleIdentifier: 'Maitri'
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
            versionCode: 1,
            versionName: '1.0.9'
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
