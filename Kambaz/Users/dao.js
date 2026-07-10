import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const createUser = (user) => {
    const newUser = { ...user, _id: user._id || uuidv4() };
    return model.create(newUser);
};
export const findAllUsers = () => model.find();
export const findUsersByRole = (role) => model.find({ role });
export const findUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i");
    return model.find({
        $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
};
export const findUsersByIds = (ids) => model.find({ _id: { $in: ids } });
export const findUserById = (userId) => model.findById(userId);
export const findUserByUsername = (username) => model.findOne({ username });
export const findUserByCredentials = (username, password) =>
    model.findOne({ username, password });
export const updateUser = (userId, user) => {
    const { _id, ...rest } = user;
    return model.updateOne({ _id: userId }, { $set: rest });
};
export const deleteUser = (userId) => model.deleteOne({ _id: userId });
