import * as Font from "expo-font";

export default useFonts = async () =>
    await Font.loadAsync({
        'poppins-light': require('../assets/fonts/Poppins/Poppins-Light.ttf'),
        'poppins-regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
        'poppins-medium': require('../assets/fonts/Poppins/Poppins-Medium.ttf'),
        'poppins-semibold': require('../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
        'poppins-bold': require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
        'poppins-extrabold': require('../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
        'poppins-black': require('../assets/fonts/Poppins/Poppins-Black.ttf'),
    });