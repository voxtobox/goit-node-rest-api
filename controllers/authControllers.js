import * as authServices from '../services/authServices.js';

export const createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authServices.addUser(email, password);

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
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
