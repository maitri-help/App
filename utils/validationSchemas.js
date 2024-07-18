import * as yup from 'yup';
import { OTP_LENGTH, TRIBE_LENGTH } from '../constants/variables';

export const loginValidationSchema = yup.object().shape({
    phoneNumber: yup
        .string()
        /* .matches(
            /^(?:(?:\+|00)(?:[1-9]\d{0,2}))?(?:\s*\d{7,})$/,
            'Enter a valid phone number - No spaces or any special characters only "+" allowed.'
        ) */
        .required('Phone Number is required')
});

export const tribeValidationSchema = yup.object().shape({
    tribe: yup
        .string()
        .required('Code is required')
        .matches(/^\d+$/, 'Code must be numeric')
        .min(TRIBE_LENGTH, `Code must be exactly ${TRIBE_LENGTH} digits`)
        .max(TRIBE_LENGTH, `Code must be exactly ${TRIBE_LENGTH} digits`)
});

export const registrationValidationSchema = yup.object().shape({
    fullName: yup
        .string()
        .matches(
            /^[\p{L}\s'‘’"”]+$/u,
            'Full Name can only contain letters, spaces, and certain punctuation (e.g., \' " ‘ ’)'
        )
        .matches(
            /^[\p{L}]+\s[\p{L}][\p{L}\s]*$/u,
            'Full Name should be at least 2 words long'
        )
        .required('Full Name is required'),
    email: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
    phoneNumber: yup
        .string()
        /* .matches(
            /^(?:(?:\+|00)(?:[1-9]\d{0,2}))?(?:\s*\d{7,})$/,
            'Enter a valid phone number - No spaces or any special characters only "+" allowed.'
        ) */
        .required('Phone Number is required'),
    acceptedTerms: yup
        .boolean()
        .oneOf(
            [true],
            'You must accept the Privacy Policy and Terms & Conditions'
        )
});
