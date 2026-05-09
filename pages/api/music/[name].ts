import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    // This tells Next.js to allow responses larger than 4MB
    responseLimit: false,
    // Optional: if you are also handling file uploads, you might want to disable this too
    bodyParser: false,
    externalResolver: true,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { name } = req.query;

  const filePath = path.join(
    process.cwd(),
    "music-library",
    "musics",
    `${name}.mp3`,
  );

  console.log(filePath);

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
};
