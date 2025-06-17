import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SECRET } from '../config/config.js';
import HttpError from '../helpers/HttpError.js';
import { User } from '../db/index.js';

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

  const user = await User.create({ email, password });
  return user.toJSON();
}

export async function loginUser(email, password) {
  const user = await getUserByEmail(email);
  if (!user) throw HttpError(401, 'Email or password is wrong');
  const isMatch = await user.validatePassword(password);
  if (!isMatch) throw HttpError(401, 'Email or password is wrong');

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
  return { email: user.email, subscription: user.subscription };
}
