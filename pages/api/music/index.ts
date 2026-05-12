import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import * as mm from "music-metadata";
import mime from "mime-types";
import prisma from "../../../lib/prisma";
import { validateRoute } from "../../../lib/auth";

// Configure formidable options
const uploadDir = path.join(process.cwd(), "music-library");
const MAX_FILE_SIZE = 100 * 1024 * 1024;

fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default validateRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
      await fs.mkdir(path.join(uploadDir, "musics"), { recursive: true });

      const form = formidable({
        uploadDir,
        keepExtensions: true,
        maxFileSize: MAX_FILE_SIZE,
        multiples: false,
      });

      try {
        const [fields, files] = await form.parse(req);

        const musicFile = files.music?.[0];
        if (!musicFile) {
          return res.status(400).json({ message: "No music file uploaded." });
        }

        // --- 1. File Type Validation ---
        const allowedMimeTypes = [
          "audio/mpeg",
          "audio/wav",
          "audio/aac",
          "audio/ogg",
          "audio/flac",
        ];
        if (
          !musicFile.mimetype ||
          !allowedMimeTypes.includes(musicFile.mimetype)
        ) {
          await fs.unlink(musicFile.filepath);
          return res
            .status(400)
            .json({
              message: "Invalid file type. Only audio files are allowed.",
            });
        }

        // --- 2. Extract Metadata ---
        let metadata;
        try {
          metadata = await mm.parseFile(musicFile.filepath);
        } catch (metaError) {
          console.error("Error parsing music metadata:", metaError);
          await fs.unlink(musicFile.filepath);
          return res
            .status(500)
            .json({ message: "Failed to extract music metadata." });
        }

        const { title, artist, album, genre, year, picture } = metadata.common;
        const { duration } = metadata.format;

        const newFileName = `${artist}-${title}`;
        let coverArtUrl: string | null = null;
        if (picture && picture.length > 0) {
          const pic = picture[0];
          const imageExtension = mime.extension(pic.format || "");
          if (imageExtension) {
            const coverArtFileName = `${
              path.parse(musicFile.newFilename).name
            }.${imageExtension}`;
            const coverArtPath = path.join(
              uploadDir,
              "covers",
              coverArtFileName,
            );
            await fs.mkdir(path.dirname(coverArtPath), { recursive: true });
            await fs.writeFile(coverArtPath, pic.data);
            coverArtUrl = `/music-library/covers/${coverArtFileName}`; // Publicly accessible URL
          }
        }

        // --- 3. Storage ---
        const finalFilePath = path.join(
          uploadDir,
          "musics",
          `${newFileName}.mp3`,
        );

        await fs.rename(musicFile.filepath, finalFilePath);
        const finalFileUrl = `/music-uploads/${newFileName}.mp3`;

        // --- 4. Save to Database ---

        const newSong = await prisma.song.create({
          data: {
            name: newFileName,
            genre: genre?.join(", ") || "Unknown",
            year: year ? String(year) : "Unknown",
            duration: duration || 0,
            filePath: finalFileUrl,
            coverArtUrl,
            artist: {
              connectOrCreate: {
                where: { name: artist || "Unknown Artist" },
                create: { name: artist || "Unknown Artist" },
              },
            },
            album: {
              connectOrCreate: {
                where: { name: album || "Unknown Album" },
                create: {
                  name: album || "Unknown Album",
                  genre: genre?.join(", ") || "Unknown",
                  year: year ? String(year) : "Unknown",
                  albumArtUrl: coverArtUrl,
                  artist: {
                    connectOrCreate: {
                      where: { name: artist || "Unknown Artist" },
                      create: { name: artist || "Unknown Artist" },
                    },
                  },
                },
              },
            },
            playlists: {
              connect: { id: 2 },
            },
          },
        });

        return res
          .status(201)
          .json({ message: "Music uploaded successfully!", newSong });
      } catch (error: any) {
        console.log(error);

        if (error.code === formidable.errors.biggerThanMaxFileSize) {
          return res.status(413).json({
            message: `File size exceeds limit of ${
              MAX_FILE_SIZE / (1024 * 1024)
            } MB.`,
          });
        }
        console.error("Music upload failed:", error);
        return res
          .status(500)
          .json({ message: "Internal server error during upload." });
      }
    }
    return res.status(405).json({ message: "Method not allowed" });
  },
);
