import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { validateRoute } from "../../../lib/auth";

export const config = {
  api: {
    responseLimit: false,
    bodyParser: false,
    externalResolver: true,
  },
};

export default validateRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
      const { name } = req.query;

      const filePath = path.join(
        process.cwd(),
        "music-library",
        "musics",
        `${name}.mp3`,
      );

      if (!fs.existsSync(filePath)) {
        return res.status(404).send("Not Found");
      }

      const stat = fs.statSync(filePath);

      res.writeHead(200, {
        "Content-Type": "audio/mpeg",
        "Content-Length": stat.size,
        "Accept-Ranges": "bytes",
      });

      const readStream = fs.createReadStream(filePath);

      readStream.on("error", (error) => {
        console.error(error);
        res.end();
      });
      readStream.pipe(res);
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  },
);
