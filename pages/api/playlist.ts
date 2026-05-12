import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { validateRoute } from "../../lib/auth";

export default validateRoute(
  async (req: NextApiRequest, res: NextApiResponse, user) => {
    if (req.method === "GET") {
      const playlists = await prisma.playlist.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          name: "asc",
        },
      });

      return res.json(playlists);
    }
    return res.status(405).json({ message: "Method not allowed" });
  },
);
