import { validateRoute } from "../../lib/auth";
import prisma from "../../lib/prisma";

export default validateRoute(async (req, res, user) => {
  if (req.method === "GET") {
    const playListCount = await prisma.playlist.count({
      where: {
        userId: user.id,
      },
    });
    return res.json({ ...user, playListCount });
  }
  if (req.method === "PUT") {
    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { firstName, lastName, email },
    });
    return res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  }
  return res.status(405).json({ message: "Method not allowed" });
});
