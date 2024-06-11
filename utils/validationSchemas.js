import * as yup from 'yup';

export const loginValidationSchema = yup.object().shape({
    phoneNumber: yup
        .string()
        .matches(
            /^(?:(?:\+|00)(?:[1-9]\d{0,2}))?(?:\s*\d{7,})$/,
            'Enter a valid phone number - No spaces or any special characters only "+" allowed.'
        )
        .required('Phone Number is required')
});
