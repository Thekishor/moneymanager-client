export const validateEmail = (email) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return false;

    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(trimmedEmail);
}


export const validatePassword = (password) => {
    const trimmedPassword = password.trim();
    if (!trimmedPassword) return false;

    if (trimmedPassword.length < 8 || trimmedPassword.length > 20) {
        return false;
    }

    const hasLowerCase = /[a-z]/.test(trimmedPassword);
    const hasUpperCase = /[A-Z]/.test(trimmedPassword);
    const hasNumber = /\d/.test(trimmedPassword);
    const hasSpecialChar = /[!@#$%^&*()_\-+={}[\]|:;"'<>,.?/~`]/.test(trimmedPassword);

    return hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar;
}