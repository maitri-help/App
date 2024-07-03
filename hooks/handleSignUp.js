import { sendOtp, createUser } from './api';

export default async function handleSignUp(values) {
    const { fullName, email, phoneNumber } = values;
    const [firstName, ...lastNameArray] = fullName.split(' ');
    const lastName = lastNameArray.join(' ');

    return new Promise((resolve, reject) => {
        createUser({ firstName, lastName, email, phoneNumber })
            .then((response) => {
                if (response.status === 201) {
                    return sendOtp(phoneNumber).then((otpResponse) => {
                        if (otpResponse && otpResponse.data) {
                            resolve(response.data);
                        } else {
                            reject(new Error('No OTP response received'));
                        }
                    });
                } else {
                    reject(new Error('Unknown error'));
                }
            })
            .catch((error) => {
                const e = error.response?.data || error;
                if (e.statusCode) {
                    switch (e.statusCode) {
                        case 409:
                            reject(new Error(e.message || 'User already exists'));
                            break;
                        case 500:
                            reject(new Error('Server error'));
                            break;
                        default:
                            reject(new Error('Unknown error'));
                            break;
                    }
                } else {
                    reject(new Error('Unknown error'));
                }
            });
    });
}
