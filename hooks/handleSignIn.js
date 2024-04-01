import { storeUserData } from '../authStorage';
import { sendOtp, getUser } from './api';

export default function handleSignIn(phoneNumber) {
    return new Promise((resolve, reject) => {
        getUser(phoneNumber)
            .then(response => {
                console.log('Sign In Success:', response.data);

                if (response.status === 200) {
                    storeUserData(response.data);
                    return sendOtp(phoneNumber);
                } else {
                    reject(new Error('Phone number not found'));
                }
            })
            .then(otpResponse => {
                if (otpResponse && otpResponse.data) {
                    console.log('OTP Sent:', otpResponse.data);
                    resolve();
                } else {
                    reject(new Error('No OTP response received'));
                }
            })
            .catch(error => {
                console.error('Sign In Error:', error);
                reject(error);
            });
    });
}