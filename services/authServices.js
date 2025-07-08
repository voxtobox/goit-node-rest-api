import jwt from 'jsonwebtoken';
import { SECRET } from '../config/config.js';
import HttpError from '../helpers/HttpError.js';
import { User } from '../db/index.js';
import { nanoid } from 'nanoid';
import { sendVerificationEmail } from './emailServices.js';

export function signToken(id) {
  return jwt.sign({ id }, SECRET, { expiresIn: '24h' });
}

export async function verifyToken(token) {
  return await jwt.verify(token, SECRET);
}

export async function getUserByEmail(email) {
  return await User.findOne({ where: { email } });
}

export async function addUser(email, password) {
  const existingUser = await getUserByEmail(email);

  if (existingUser) throw HttpError(409, 'Email in use');

  const verificationToken = nanoid();

  const user = await User.create({ email, password, verificationToken });

  await sendVerificationEmail(email, verificationToken);
  return user.toJSON();
}

export async function loginUser(email, password) {
  const user = await getUserByEmail(email);
  if (!user) throw HttpError(401, 'Email or password is wrong');
  const isMatch = await user.validatePassword(password);
  if (!isMatch) throw HttpError(401, 'Email or password is wrong');

  if (!user.verify) {
    throw HttpError(401, 'Email not verified');
  }

  const token = signToken(user.id);

  await user.update({ token });

  return { token, user: { email, subscription: user.subscription } };
}

export async function logoutUser(id) {
  const user = await User.findByPk(id);
  if (!user) throw HttpError(401, 'Not authorized');
  user.update({ token: null });
  return true;
}

export async function getUserDataById(id) {
  const user = await User.findByPk(id);
  return {
    email: user.email,
    subscription: user.subscription,
    avatarURL: user.avatarURL,
  };
}

export async function setUserAvatar(id, avatarURL) {
  const user = await User.findByPk(id);
  await user.update({ avatarURL });
  return { avatarURL };
}

export async function verifyEmail(verificationToken) {
  const user = await User.findOne({ where: { verificationToken } });

  if (!user) {
    throw HttpError(404, 'User not found');
  }

  await user.update({ verify: true, verificationToken: null });

  return { message: 'Verification successful' };
}

export async function resendVerificationEmail(email) {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw HttpError(404, 'User not found');
  }

  if (user.verify) {
    throw HttpError(400, 'Verification has already been passed');
  }

  let { verificationToken } = user;

  if (!verificationToken) {
    verificationToken = nanoid();
    await user.update({ verificationToken });
  }

  await sendVerificationEmail(email, verificationToken);

  return { message: 'Verification email sent' };
}
