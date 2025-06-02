// Password: at least 8 chars, at least one letter and one number
export function validatePassword(password) {
    if (typeof password !== "string") return { success: false, message: "Password must be a string" };
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/.test(password)) return { success: false, message: "Password must be at least 8 characters long and contain at least one letter and one number" };

    return { success: true };
}

// Email: basic RFC 5322 compliant regex
export function validateEmail(email) {
    if (typeof email !== "string") return { success: false, message: "Email must be a string" };
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { success: false, message: "Email is not valid" };

    return { success: true };
}

// Username: 3-20 chars, letters, numbers, underscores, no spaces
export function validateUsername(username) {
    if (typeof username !== "string") return { success: false, message: "Username must be a string" };
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) return { success: false, message: "Username must be between 3 and 20 characters long and can only contain letters, numbers, and underscores" };

    return { success: true };
}

// User ID
export function validateUserId(userId) {
    if (typeof userId !== "number") return { success: false, message: "User ID must be a number" };

    // I dont think that just plain integer can be anyhow exploited

    return { success: true };
}

// Text: 1-1000 chars, no HTML tags
export function validateText(text) {
    if (typeof text !== "string") return { success: false, message: "Text must be a string" };
    if (text.length < 1 || text.length > 1000) return { success: false, message: "Text must be between 1 and 1000 characters" };
    if (/<[^>]+>/.test(text)) return { success: false, message: "Text contains invalid characters" }; // no HTML tags

    return { success: true };
}

export function validateFullName(fullname) {
    if (typeof fullname !== "string") return { success: false, message: "Full name must be a string" };
    if (fullname.length < 1 || fullname.length > 100) return { success: false, message: "Full name must be between 1 and 100 characters" };
    if (!/^[\p{L}\s'-]+$/u.test(fullname)) return { success: false, message: "Full name can only letters, spaces, apostrophes and hyphens" }; // only letters, spaces, apostrophes and hyphens

    return { success: true };
}

