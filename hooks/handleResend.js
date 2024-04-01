import { resendOtp as resendOtpApi } from './api';

export function handleResend(phoneNumber, setCountdown, setResendClickable, toast) {
    resendOtpApi(phoneNumber)
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
}