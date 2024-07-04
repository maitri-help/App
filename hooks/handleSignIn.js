import { sendOtp, getUserExists } from './api';

export default async function handleSignIn(values) {
    const { phoneNumber } = values;

    return new Promise((resolve, reject) => {
        getUserExists(phoneNumber)
            .then((response) => {
                if (response.status === 200) {
                    return sendOtp(phoneNumber).then((otpResponse) => {
                        if (otpResponse && otpResponse.data) {
                            resolve(response.data);
                        } else {
                            reject(new Error('No OTP response received'));
                        }
                    });
                } else {
                    reject(new Error('Phone number not found'));
                }
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
            });
    });
}
