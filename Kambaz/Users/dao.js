import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

// The user CRUD, written with the mongoose model.
// The screens never see mongoose. They only call these names.

export const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    return model.create(newUser);
};

export const findAllUsers = () => model.find();

export const findUsersByRole = (role) => model.find({ role: role });

// A part of a name. The regex ignores big and small letters.
export const findUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i");
    return model.find({
        $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
};

export const findUserById = (userId) => model.findById(userId);

export const findUserByUsername = (username) => model.findOne({ username: username });

export const findUserByCredentials = (username, password) =>
    model.findOne({ username: username, password: password });

// I drop _id and __v first. Mongo does not let me change them.
export const updateUser = (userId, user) => {
    const { _id, __v, ...userUpdates } = user;
    return model.updateOne({ _id: userId }, { $set: userUpdates });
};

export const deleteUser = (userId) => model.deleteOne({ _id: userId });
