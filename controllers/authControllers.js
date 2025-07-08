import path from 'path';
import fs from 'fs/promises';
import * as authServices from '../services/authServices.js';

export const createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authServices.addUser(email, password);

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authServices.loginUser(email, password);
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    await authServices.logoutUser(id);

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export const getUserDataById = async (req, res, next) => {
  const { id } = req.user;
  const userData = await authServices.getUserDataById(id);
  res.json(userData);
};

export const setUserAvatar = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { path: oldPath, filename } = req.file;
    const newPath = path.join('public', 'avatars', filename);
    await fs.rename(oldPath, newPath);
    const avatarURL = `/avatars/${filename}`;
    const result = await authServices.setUserAvatar(id, avatarURL);
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const result = await authServices.verifyEmail(verificationToken);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const result = await authServices.resendVerificationEmail(email);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
