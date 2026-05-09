import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export const config = {
  api: {
    bodyParser: false, // Required for formidable
  },
};

const uploadDir = path.join(process.cwd(), "music-library"); // Local storage path
const MAX_FILE_SIZE = 100 * 1024 * 1024;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  // Ensure directories exist
  await fs.mkdir(path.join(uploadDir, "avatars"), { recursive: true });
  await fs.mkdir(path.join(uploadDir, "artists"), { recursive: true });

  const form = formidable({
    keepExtensions: true,
    maxFileSize: MAX_FILE_SIZE,
  });

  try {
    const [fields, files] = await form.parse(req);

    const type = fields.type?.[0];
    const id = fields.id?.[0];
    const imageFile = files.image?.[0];

    if (!imageFile || !type || !id) {
      return res.status(400).json({ message: "Missing file, type, or id" });
    }

    if (!imageFile.mimetype?.startsWith("image/")) {
      await fs.unlink(imageFile.filepath);
      return res.status(400).json({ message: "File must be an image" });
    }

    const subFolder = type === "user" ? "avatars" : "artists";
    const fileName = `${type}_${id}_${Date.now()}${path.extname(
      imageFile.filepath,
    )}`;
    const finalPath = path.join(uploadDir, subFolder, fileName);
    const imageUrl = path.join("music-library", subFolder, fileName);

    await fs.rename(imageFile.filepath, finalPath);

    let updatedRecord;
    if (type === "user") {
      updatedRecord = await prisma.user.update({
        where: { id: Number(id) },
        data: { imageUrl },
      });
    } else if (type === "artist") {
      updatedRecord = await prisma.artist.update({
        where: { id: Number(id) },
        data: { imageUrl } as any,
      });
    } else {
      await fs.unlink(finalPath);
      return res.status(400).json({ message: "Invalid type" });
    }

    return res.status(200).json({
      message: "Image uploaded successfully",
      url: fileName,
      data: updatedRecord,
    });
  } catch (error: any) {
    console.error("Image Upload Error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};
