import { User } from '../types';

const LOGGED_IN_USER_KEY = 'loggedInUserEmail';
const USERS_DB_KEY = 'usersDatabase';

// Helper to get all stored users
const getUsers = (): User[] => {
    try {
        const stored = localStorage.getItem(USERS_DB_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to parse users from localStorage", e);
        return [];
    }
};

// Helper to save all users
const saveUsers = (users: User[]) => {
    try {
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    } catch (e) {
        console.error("Failed to save users to localStorage", e);
    }
};

/**
 * Signs up a new user.
 * @param newUser The user object with name, email, and password.
 * @returns The created user object or throws an error if email exists.
 */
export const signUp = (newUser: User): User => {
    const users = getUsers();
    const existingUser = users.find(u => u.email === newUser.email);

    if (existingUser) {
        throw new Error('An account with this email already exists.');
    }

    // In a real app, you would hash the password here.
    // For this mock, we'll just store it.
    users.push(newUser);
    saveUsers(users);

    // Automatically log the user in
    localStorage.setItem(LOGGED_IN_USER_KEY, newUser.email);

    return newUser;
};

/**
 * Logs in a user.
 * @param email The user's email.
 * @param password The user's password.
 * @returns The user object if login is successful, otherwise null.
 */
export const login = (email: string, password?: string): User | null => {
    const users = getUsers();
    const user = users.find(u => u.email === email);

    // In a real app, you would compare a hashed password.
    if (user && user.password === password) {
        localStorage.setItem(LOGGED_IN_USER_KEY, email);
        return user;
    }

    return null;
};

/**
 * Logs out the current user.
 */
export const logout = () => {
    localStorage.removeItem(LOGGED_IN_USER_KEY);
};

/**
 * Gets the currently logged-in user's data.
 * @returns The user object or null if not logged in.
 */
export const getCurrentUser = (): User | null => {
    try {
        const loggedInEmail = localStorage.getItem(LOGGED_IN_USER_KEY);
        if (!loggedInEmail) {
            return null;
        }
        const users = getUsers();
        return users.find(u => u.email === loggedInEmail) || null;
    } catch (e) {
        console.error("Failed to get current user", e);
        return null;
    }
};

/**
 * Updates a logged-in user's profile data.
 * @param updatedUserData The partial or full user object with new data.
 */
export const updateUser = (updatedUserData: User) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === currentUser.email);

    if (userIndex !== -1) {
        // Merge the new data with existing data
        users[userIndex] = { ...users[userIndex], ...updatedUserData };
        saveUsers(users);
    }
};
