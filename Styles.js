
import { StyleSheet, Platform } from 'react-native';

export default styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: (Platform.OS === 'android') ? 40 : 0,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        paddingHorizontal: 25,
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: 25,
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
        paddingHorizontal: 25,
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
        fontFamily: 'poppins-medium',
    },
    text: {
        color: '#7A7A7A',
        fontSize: 14,
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
        fontFamily: 'poppins-regular',
    },
    errorText: {
        color: '#EE0004',
        marginBottom: 5,
        width: '100%',
        fontSize: 13,
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
        color: '#000',
        pointerEvents: 'none',
    },
    backLinkInline: {
        width: 35,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: -8,
        marginVertical: -6,
    },
    backLinkCustom: {
        top: 22,
        left: 20,
    },
    toast: {
        paddingVertical: 12,
        paddingHorizontal: 22,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderRadius: 30,
        shadowColor: (Platform.OS === 'android') ? 'rgba(0,0,0,0.5)' : '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.16,
        shadowRadius: 15,
        elevation: 10,
        marginVertical: 5,
    },
    toastText: {
        color: '#000',
        fontSize: 14,
        lineHeight: 18,
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
        paddingVertical: 18,
        paddingHorizontal: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    topBarBack: {
        justifyContent: 'flex-start',
    },
    modalTopNav: {
        position: 'relative',
        paddingVertical: 25,
        paddingHorizontal: 25,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        width: '100%',
    },
    topBarTitle: {
        fontSize: 18,
        fontFamily: 'poppins-regular',
        lineHeight: 24,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        pointerEvents: 'none',
    },
    floatingButton: {
        backgroundColor: '#1C4837',
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: 1,
        marginRight: 15,
        marginBottom: 30,
        position: 'relative',
        zIndex: 2,
        shadowColor: (Platform.OS === 'android') ? 'rgba(0,0,0,0.7)' : '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 12,
        marginVertical: 5,
    },
    submitButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        paddingTop: 20,
        marginBottom: 30,
    },
    submitButton: {
        backgroundColor: '#1C4837',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: (Platform.OS === 'android') ? 'rgba(0,0,0,0.5)' : '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 10,
    },
    phoneInputStyles: {
        container: {
            height: 50,
            borderColor: 'transparent',
            borderBottomColor: '#666666',
            borderRadius: 0,
            marginBottom: 10,
        },
        flagContainer: {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            backgroundColor: 'transparent',
        },
        caret: {
            // ...
        },
        divider: {
            color: '#1C4837',
        },
        callingCode: {
            fontFamily: 'poppins-regular',
            fontSize: 14,
        },
        input: {
            fontFamily: 'poppins-regular',
            fontSize: 14,
        }
    },
    phoneModalStyles: {
        countriesList: {
            marginTop: 10,
        },
        searchInput: {
            marginTop: 5,
            fontFamily: 'poppins-regular',
            fontSize: 14,
            borderColor: 'transparent',
            borderBottomColor: '#666666',
            borderRadius: 0,
        },
        countryButton: {
            borderColor: 'transparent',
        },
        noCountryText: {
            fontFamily: 'poppins-regular',
            fontSize: 14,
        },
        noCountryContainer: {},
        callingCode: {
            fontFamily: 'poppins-regular',
            fontSize: 14,
        },
        countryName: {
            fontFamily: 'poppins-regular',
            fontSize: 14,
        },
    }
});