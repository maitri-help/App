
import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    topTextsContainer: {
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 30,
        marginBottom: 40,
    },
    authContainer: {
        justifyContent: 'flex-start',
        paddingHorizontal: 40,
        paddingVertical: 40,
    },
    formContainer: {
        width: '100%',
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        fontFamily: 'poppins-medium',
    },
    text: {
        color: '#7A7A7A',
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'poppins-regular',
    },
    inputWrapper: {
        marginBottom: 15,
    },
    input: {
        height: 50,
        borderColor: '#666666',
        borderBottomWidth: 1,
        paddingLeft: 15,
        paddingRight: 40,
        paddingVertical: 5,
        fontWeight: '400',
        fontFamily: 'poppins-regular',
    },
    inputIcon: {
        color: '#000',
        position: 'absolute',
        right: 15,
        top: 15,
    },
    inputErrorIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#666666',
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
    },
    checkedCheckbox: {
        backgroundColor: '#1C4837',
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    checkboxText: {
        marginRight: 5,
        lineHeight: 20,
        fontSize: 13,
        fontWeight: '400',
        fontFamily: 'poppins-regular',
    },
    errorText: {
        color: '#EE0004',
        marginBottom: 5,
        width: '100%',
        fontSize: 13,
        fontWeight: '400',
        fontFamily: 'poppins-regular',
    },
    backLink: {
        position: 'absolute',
        top: 38,
        left: 25,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    backLinkIcon: {
        width: 18,
        height: 18,
        color: '#000',
        pointerEvents: 'none',
    },
    backLinkInline: {
        width: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toast: {
        paddingVertical: 12,
        paddingHorizontal: 22,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.16,
        shadowRadius: 15,
        marginVertical: 5,
    },
    toastText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'poppins-regular',
    },
    toastError: {
        borderColor: '#EE0004',
    },
    toastSuccess: {
        borderColor: '#0BE377',
    },
    topBar: {
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1,
        paddingTop: 30,
        paddingBottom: 20,
        paddingHorizontal: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 15,
    },
    topBarBack: {
        justifyContent: 'flex-start',
    },
    topBarTitle: {
        fontSize: 18,
        fontWeight: '400',
        fontFamily: 'poppins-regular',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        pointerEvents: 'none',
    },
    overlayTouchable: {
        flex: 1,
    },
    modal: {
        flex: 1,
    },
    modalContainer: {
        width: '100%',
        height: '66%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalContent: {
        flex: 1,
    }
});