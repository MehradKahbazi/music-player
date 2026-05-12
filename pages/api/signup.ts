import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import cookie from "cookie";
import prisma from "../../lib/prisma";
import { signJwt } from "../../lib/auth";

// todo: handle other http verbs
// todo: proper error handling and response
// todo: modularize reusable code
// todo: put secret in an env var✅

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const salt = bcrypt.genSaltSync();
  const { email, password } = req.body;
  let user;

  try {
    user = await prisma.user.create({
      data: {
        email,
        password: bcrypt.hashSync(password, salt),
      },
    });
  } catch (e) {
    res.status(401);
    return res.json({ error: "User already exists" });
    
  }
  const token = signJwt(user);

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
    user,
  });
}
return res.status(405).json({ message: "Method not allowed" });
};
