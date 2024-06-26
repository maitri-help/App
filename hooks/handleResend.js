import { resendOtp } from './api';

export function handleResend(
    phoneNumber,
    setCountdown,
    setResendClickable,
    toast
) {
    resendOtp(phoneNumber)
        .then((response) => {
            toast.show('Code sent successfully to: ' + phoneNumber, {
                type: 'success'
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
        })
        .catch((error) => {
            console.error('OTP Resend Error:', error);
            toast.show('Error in sending code to:' + phoneNumber, {
                type: 'error'
            });
        });
}
