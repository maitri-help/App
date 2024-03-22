import axios from 'axios';

export default function handleSignIn(phoneNumber) {
    return new Promise((resolve, reject) => {
        const signInUrl = `http://34.253.29.107:3000/users/${phoneNumber}`;
        const sendOtpUrl = 'http://34.253.29.107:3000/auth/otp/send';

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        axios.get(signInUrl, config)
            .then(response => {
                console.log('Sign In Success:', response.data);

                if (response.status === 200) {
                    return axios.post(sendOtpUrl, { phoneNumber }, config);
                } else {
                    reject(new Error('Phone number not found'));
                }
            })
            .then(otpResponse => {
                console.log('OTP Sent:', otpResponse.data);
                resolve();
            })
            .catch(error => {
                console.error('Sign In Error:', error);
                reject(error);
            });
    });
}