import { storeUserData } from '../authStorage';
import { sendOtp, getUser } from './api';

export default function handleSignIn(values) {
    const { phoneNumber } = values;

    return new Promise((resolve, reject) => {
        getUser(phoneNumber)
            .then((response) => {
                if (response.status === 200) {
                    storeUserData(response.data);
                    return { userId: response.data.userId };
                } else {
                    reject(new Error('Phone number not found'));
                }
            })
            .then(({ userId }) => {
                return sendOtp(phoneNumber).then((otpResponse) => {
                    if (otpResponse && otpResponse.data) {
                        resolve({ userId, otpResponse: otpResponse.data });
                    } else {
                        reject(new Error('No OTP response received'));
                    }
                });
            })
            .catch((error) => {
                console.error('Sign In Error:', error);
                reject(error);
            });
    });
}
