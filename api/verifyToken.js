import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
  console.log(req.session);

  const token = req.cookies.token;
  if (!token) return next(createError(401, "You are not authenticated!"));

  jwt.verify(token, process.env.JWT_SECRET, (err, jwtPayload) => {
    if (err) return next(createError(403, "Invalid token!"));

    req.jwtPayload = jwtPayload;
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.jwtPayload.id === req.params.id) {
      next();
    } else {
      return next(createError(403, "You are not authenticated!"));
    }
  });
};
