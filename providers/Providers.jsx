import { Text, View } from 'react-native';
import { LocationProvider } from './LocationProvider';
import { ToastProvider } from 'react-native-toast-notifications';
import styles from '../Styles';

export function Providers({ children }) {
    return (
        <ToastProvider
            placement="top"
            offsetTop={30}
            renderType={{
                error: (toast) => (
                    <View style={[styles.toast, styles.toastError]}>
                        <Text style={styles.toastText}>{toast.message}</Text>
                    </View>
                ),
                success: (toast) => (
                    <View style={[styles.toast, styles.toastSuccess]}>
                        <Text style={styles.toastText}>{toast.message}</Text>
                    </View>
                )
            }}
        >
            <LocationProvider>{children}</LocationProvider>
        </ToastProvider>
    );
}
