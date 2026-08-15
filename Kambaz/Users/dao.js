import db from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

let { users } = db;

export const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    users = [...users, newUser];
    db.users = users;
    return newUser;
};

export const findAllUsers = () => users;

// The Users screen filters by role, or by a part of a name.
export const findUsersByRole = (role) =>
    users.filter((u) => u.role === role);

export const findUsersByPartialName = (name) => {
    const wanted = name.toLowerCase();
    return users.filter((u) => {
        const first = u.firstName ? u.firstName.toLowerCase() : "";
        const last = u.lastName ? u.lastName.toLowerCase() : "";
        return first.includes(wanted) || last.includes(wanted);
    });
};

export const findUserById = (userId) =>
    users.find((u) => u._id === userId);

export const findUserByUsername = (username) =>
    users.find((u) => u.username === username);

export const findUserByCredentials = (username, password) =>
    users.find((u) => u.username === username && u.password === password);

export const updateUser = (userId, user) => {
    users = users.map((u) => (u._id === userId ? { ...u, ...user } : u));
    db.users = users;
    return true;
};

export const deleteUser = (userId) => {
    users = users.filter((u) => u._id !== userId);
    db.users = users;
    return true;
};
