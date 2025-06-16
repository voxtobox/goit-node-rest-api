import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SECRET } from '../config/config.js';
import HttpError from '../helpers/HttpError.js';
import { User } from '../db/index.js';

export async function getUserByEmail(email) {
  return await User.findOne({ where: { email } });
}

export async function addUser(email, password) {
  const existingUser = await getUserByEmail(email);

  if (existingUser) throw HttpError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword });
  return user.toJSON();
}

export async function loginUser(email, password) {
  const user = await getUserByEmail(email);
  if (!user) throw HttpError(401, 'Email or password is wrong');
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw HttpError(401, 'Email or password is wrong');
  const userData = { email, subscription: user.subscription };

  const token = jwt.sign(userData, SECRET);

  return { token, user: userData };
}
