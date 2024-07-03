import { getAccessToken, storeUserData } from '../authStorage';
import { sendOtp, getUser } from './api';

export default async function handleSignIn(values) {
    const { phoneNumber } = values;
    const accessToken = await getAccessToken();

    return new Promise((resolve, reject) => {
        getUser(phoneNumber, accessToken)
            .then((response) => {
                if (response.status === 200) {
                    storeUserData(response.data);

                    return response.data;
                } else {
                    reject(new Error('Phone number not found'));
                }
            })
            .then((userData) => {
                return sendOtp(phoneNumber).then((otpResponse) => {
                    if (otpResponse && otpResponse.data) {
                        resolve(userData);
                    } else {
                        reject(new Error('No OTP response received'));
                    }
                });
            })
            .catch((error) => {
                const e = error.toJSON();
                if (e.status) {
                    switch (e.status) {
                        case 404:
                            reject(new Error(`Phone number doesn't exist`));
                            break;
                        case 500:
                            reject(new Error('Server error'));
                            break;
                        default:
                            reject(new Error('Unknown error'));
                            break;
                    }
                } else if (!e.status && e.message) {
                    reject(new Error(e.message));
                } else {
                    reject(new Error('Unknown error'));
                }
                /* console.error('Sign In Error:', error);
                reject(error); */
            });
    });
}
