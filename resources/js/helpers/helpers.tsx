export const generatePassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const array = new Uint8Array(20);
    window.crypto.getRandomValues(array);
    return Array.from(array, (num) => characters[num % characters.length]).join('');
};

/**
 * Universal password generator handler
 * @param {Function} setData - your setData function (from useForm or useState)
 * @param {string} field - the field name to update (e.g., 'password' or 'secret_key')
 */
export const handleGeneratePassword = (setData, field = 'password') => {
    const newPassword = generatePassword();
    // Works for Inertia useForm or React useState
    if (typeof setData === 'function') {
        try {
            // For Inertia useForm
            setData(field, newPassword);
        } catch {
            // For useState object syntax
            setData((prev) => ({ ...prev, [field]: newPassword }));
        }
    }
    return newPassword;
};
