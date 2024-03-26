import axios from 'axios';

export default function handleSignUp(values, navigation) {
    const { fullName, email, phoneNumber } = values;
    const sendOtpUrl = 'http://34.253.29.107:3000/auth/otp/send';
    const createUserUrl = 'http://34.253.29.107:3000/users';

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return axios.post(sendOtpUrl, { phoneNumber })
        .then(otpResponse => {
            console.log('OTP Sent:', otpResponse.data);

            const userData = {
                fullName,
                email,
                phoneNumber,
            };

            return axios.post(createUserUrl, userData, config);
        })
        .then(userResponse => {
            console.log('User Created:', userResponse.data);
            return userResponse;
        })
        .catch(error => {
            console.error('Sign Up Error:', error);
            throw error;
        });
}