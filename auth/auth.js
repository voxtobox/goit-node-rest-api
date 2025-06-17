import HttpError from '../helpers/HttpError.js';
import { verifyToken } from '../services/authServices.js';
import { User } from '../db/user.js';

function getNotAuthorizeError() {
  return HttpError(401, 'Not authorized');
}

export const auth = async (req, res, next) => {
  try {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');
    console.log('token: ', token);

    if (bearer !== 'Bearer') throw getNotAuthorizeError();

    const { id } = await verifyToken(token);

    const user = await User.findByPk(id);

    if (!user?.token || user.token !== token) throw getNotAuthorizeError();

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
