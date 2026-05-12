/* eslint-disable no-shadow */
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import cookie from "cookie";
import prisma from "../../lib/prisma";
import { signJwt } from "../../lib/auth";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { email, password } = req.body;
    let user;

    try {
      user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (user && bcrypt.compareSync(password, user.password)) {
        const { password, ...userWithoutPassword } = user;
        const token = signJwt(user)

        res.setHeader(
          "Set-Cookie",
          cookie.serialize("ACCESS_TOKEN", token, {
            httpOnly: true,
            maxAge: 8 * 60 * 60,
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          }),
        );

        return res.json({
          user: userWithoutPassword,
        });
      }
      res.status(401);
      return res.json({ error: "Unauthorized user" });
    } catch (e) {
      res.status(401);
      return res.json({ error: "Unauthorized user" });
    }
  }
  return res.status(405).json({ message: "Method not allowed" });
};
