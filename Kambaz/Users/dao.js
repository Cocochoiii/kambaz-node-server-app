import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const createUser = async (user) => {
  const newUser = { ...user };
  if (!newUser._id) newUser._id = uuidv4();
  const inserted = await model.create(newUser);
  return inserted.toObject();
};

export const findAllUsers = async () => {
  const users = await model.find();
  return users.map(u => u.toObject());
};

export const findUsersByRole = async (role) => {
  const users = await model.find({ role });
  return users.map(u => u.toObject());
};

export const findUsersByPartialName = async (partialName) => {
  const regex = new RegExp(partialName, "i");
  const users = await model.find({
                                   $or: [
                                     { firstName: { $regex: regex } },
                                     { lastName: { $regex: regex } },
                                   ],
                                 });
  return users.map(u => u.toObject());
};

export const findUserById = async (userId) => {
  const user = await model.findById(userId);
  return user ? user.toObject() : null;
};

export const findUserByUsername = async (username) => {
  const user = await model.findOne({ username });
  return user ? user.toObject() : null;
};

export const findUserByCredentials = async (username, password) => {
  const user = await model.findOne({ username, password });
  return user ? user.toObject() : null;
};

export const updateUser = async (userId, updates) => {
  await model.updateOne({ _id: userId }, { $set: updates });
  const updated = await model.findById(userId);
  return updated ? updated.toObject() : null;
};

export const deleteUser = async (userId) => {
  return model.deleteOne({ _id: userId });
};