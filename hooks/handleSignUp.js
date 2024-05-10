import { sendOtp, createUser, getUser } from './api';

export default async function handleSignUp(values, navigation) {
    const { fullName, email, phoneNumber } = values;

    try {
        const existingUserResponse = await getUser(phoneNumber);
        if (existingUserResponse.data) {
            console.log('User with phone number already exists:', phoneNumber);
            return { exists: true, userId: existingUserResponse.data.userId };
        }

        const [firstName, ...lastNameArray] = fullName.split(' ');
        const lastName = lastNameArray.join(' ');

        const userResponse = await createUser({ firstName, lastName, email, phoneNumber });

        console.log('User Created:', userResponse.data);

        const otpResponse = await sendOtp(phoneNumber);
        console.log('OTP Sent:', otpResponse.data);

        return { exists: false, userId: userResponse.data.userId, firstName, lastName, email, phoneNumber };
    } catch (error) {
        console.error('Sign Up Error:', error);
        throw error;
    }
}