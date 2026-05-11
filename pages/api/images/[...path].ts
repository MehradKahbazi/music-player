import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { validateRoute } from "../../../lib/auth";

export default validateRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { path: pathSegments } = req.query;

    if (!pathSegments || !Array.isArray(pathSegments)) {
      return res.status(400).json({ error: "Invalid path" });
    }

    const ROOT_DIRECTORY = process.cwd();

    const relativePath = path.join(...pathSegments);

    const fullPath = path.join(ROOT_DIRECTORY, relativePath);

    if (!fullPath.startsWith(ROOT_DIRECTORY)) {
      return res.status(403).send("Forbidden");
    }

    try {
      if (fs.existsSync(fullPath)) {
        const imageBuffer = fs.readFileSync(fullPath);

        const ext = path.extname(fullPath).toLowerCase();
        const mimeTypes: { [key: string]: string } = {
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".png": "image/png",
          ".gif": "image/gif",
          ".webp": "image/webp",
        };

        res.setHeader(
          "Content-Type",
          mimeTypes[ext] || "application/octet-stream",
        );
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        return res.send(imageBuffer);
      }
      return res.status(404).send("Image not found");
    } catch (error) {
      return res.status(500).send("Server Error");
    }
  },
);
