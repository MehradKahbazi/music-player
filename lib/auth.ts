import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import prisma from "./prisma";

export const validateRoute = (handler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies.ACCESS_TOKEN;
    if (token) {
      let user;
      try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        user = await prisma.user.findUnique({
          where: { id },
        });
        if (!user) {
          throw new Error("Not a Real User");
        }
      } catch (e) {
        res.status(401);
        res.json({ error: "Noth authorized" });
        return;
      }
      return handler(req, res, { ...user, password: undefined });
    }
    res.status(401);
    res.json({ error: "Noth authorized" });
  };
};

export const validateToken = (token) => {
  const user = jwt.verify(token, process.env.JWT_SECRET);
  return user;
};

export const signJwt = (user) => {
  return jwt.sign(
    {
      email: user.email,
      id: user.id,
      time: Date.now(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "8h",
    },
  );
};
