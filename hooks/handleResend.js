import axios from 'axios';

export function resendOtp(phoneNumber) {
    const resendOtpUrl = 'http://34.253.29.107:3000/auth/otp/resend';

    return axios.post(resendOtpUrl, { phoneNumber });
}

export function handleResend(phoneNumber, setCountdown, setResendClickable, toast) {
    resendOtp(phoneNumber)
        .then((response) => {
            console.log('OTP Resent:', response.data);
            toast.show('Code sent successfully to: ' + phoneNumber, { type: 'success' });
        })
        .catch((error) => {
            console.error('OTP Resend Error:', error);
            toast.show('Error in sending code to:' + phoneNumber, { type: 'error' });
        });

    setCountdown(30);
    setResendClickable(false);

    const timer = setInterval(() => {
        setCountdown((prevCount) => {
            if (prevCount === 1) {
                clearInterval(timer);
                setResendClickable(true);
            }
            return prevCount - 1;
        });
    }, 1000);
};