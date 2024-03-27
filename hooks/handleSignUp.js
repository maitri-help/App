import axios from 'axios';

export default async function handleSignUp(values, navigation) {
    const { fullName, email, phoneNumber } = values;
    const sendOtpUrl = 'http://34.253.29.107:3000/auth/otp/send';
    const createUserUrl = 'http://34.253.29.107:3000/users';
    const getUserUrl = `http://34.253.29.107:3000/users/${phoneNumber}`;

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const existingUserResponse = await axios.get(getUserUrl);
        if (existingUserResponse.data) {
            console.log('User with phone number already exists:', phoneNumber);
            return { exists: true };
        }

        const [firstName, ...lastNameArray] = fullName.split(' ');
        const lastName = lastNameArray.join(' ');

        const userResponse = await axios.post(createUserUrl, { firstName, lastName, email, phoneNumber }, config);
        console.log('User Created:', userResponse.data);

        const otpResponse = await axios.post(sendOtpUrl, { phoneNumber });
        console.log('OTP Sent:', otpResponse.data);

        return { exists: false };
    } catch (error) {
        console.error('Sign Up Error:', error);
        throw error;
    }
}
