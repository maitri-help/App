import axios from 'axios';
import { storeAccessToken } from '../authStorage';

export default function handleSignUp(values, navigation) {
    const { fullName, email, phoneNumber } = values;
    const sendOtpUrl = 'http://34.253.29.107:3000/auth/otp/send';
    const createUserUrl = 'http://34.253.29.107:3000/users';

    axios.post(sendOtpUrl, { phoneNumber })
        .then(otpResponse => {
            console.log('OTP Sent:', otpResponse.data);

            const userData = {
                fullName,
                email,
                phoneNumber,
            };

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            axios.post(createUserUrl, userData, config)
                .then(userResponse => {
                    console.log('User Created:', userResponse.data);

                    const accessToken = userResponse.data.accessToken;
                    if (accessToken) {
                        storeAccessToken(accessToken);
                    }

                    navigation.navigate('VerifyNumber');
                })
                .catch(userError => {
                    console.error('User Creation Error:', userError);
                });
        })
        .catch(otpError => {
            console.error('OTP Sending Error:', otpError);
        });
}