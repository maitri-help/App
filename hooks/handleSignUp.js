import { sendOtp, createUser, getUser } from './api';

export default async function handleSignUp(values, navigation) {
    const { fullName, email, phoneNumber } = values;

    try {
        /* const existingUserResponse = await getUser(phoneNumber);
        if (existingUserResponse.data) {
            return { exists: true, userId: existingUserResponse.data.userId };
        } */

        const [firstName, ...lastNameArray] = fullName.split(' ');
        const lastName = lastNameArray.join(' ');

        const userResponse = await createUser({
            firstName,
            lastName,
            email,
            phoneNumber
        });

        // TODO: create user error handling

        const otpResponse = await sendOtp(phoneNumber);

        return {
            exists: false,
            userId: userResponse.data.userId,
            firstName,
            lastName,
            email,
            phoneNumber
        };
    } catch (error) {
        console.error('Sign Up Error:', error);
        throw error;
    }
}
