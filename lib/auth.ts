import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import prisma from "./prisma";

export const validateRoute = (handler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies.ACCESS_TOKEN;
    if (token) {
      let user;
      try {
        const { id } = jwt.verify(token, "hello");
        user = prisma.user.findUnique({
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
      return handler(req, res, user);
    }
    res.status(401);
    res.json({ error: "Noth authorized" });
  };
};
