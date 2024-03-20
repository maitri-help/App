
import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    splashImg: {
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        fontFamily: 'poppins-medium',
    },
    text: {
        color: '#7A7A7A',
        fontSize: 15,
    },
});