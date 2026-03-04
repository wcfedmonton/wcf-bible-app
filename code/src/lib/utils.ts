export type FormState = {
    full_name?: string;
    email: string;
    password: string;
    loading?: boolean;
};

/**
 * Determines whether a form submission should be disabled based on the current form state.
 * 
 * @param {FormState} state - The current state of the form containing validation and submission information
 * @returns {boolean} True if the form submission should be disabled, false otherwise
 */
export function disabledCondition(state: FormState) {
    const invalidEmail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email);
    const emptyField = Object.values(state).some((field) => field === '');

    // the existence of the full_name field is used to verify whether or not the password length 
    // should be verified -- it's verified on the sign up page, but not the sign in page
    return invalidEmail || emptyField || (state.full_name ? state.password.length < 8 : false) || state.loading;
}