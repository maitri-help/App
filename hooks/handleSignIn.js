import axios from 'axios';

export default function handleSignIn(values, navigation) {
    const { phoneNumber } = values;
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
            navigation.navigate('AlmostThere');

            axios.post(sendOtpUrl, { phoneNumber }, config)
                .then(otpResponse => {
                    console.log('OTP Sent:', otpResponse.data);
                })
                .catch(otpError => {
                    console.error('OTP Sending Error:', otpError);
                });
        })
        .catch(error => {
            console.error('Sign In Error:', error);
        });
}