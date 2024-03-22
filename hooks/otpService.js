import axios from 'axios';

const sendOtpUrl = 'http://34.253.29.107:3000/auth/otp/send';
const verifyOtpUrl = 'http://34.253.29.107:3000/auth/otp/verify';
const resendOtpUrl = 'http://34.253.29.107:3000/auth/otp/resend';

export const sendOtp = (phoneNumber) => {
    return axios.post(sendOtpUrl, { phoneNumber });
};

export const verifyOtp = (otp) => {
    return axios.post(verifyOtpUrl, { otp });
};

export const resendOtp = () => {
    return axios.post(resendOtpUrl);
};