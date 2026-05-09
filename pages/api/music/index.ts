import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs/promises"; // Use fs.promises for async operations
import path from "path";
import * as mm from "music-metadata";
import mime from "mime-types"; // For file type validation
import { PrismaClient } from "@prisma/client"; // Assuming your PrismaClient instance
// import { Upload } from '@aws-sdk/lib-storage'; // If using AWS S3
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'; // If using AWS S3

const prisma = new PrismaClient();

// Configure formidable options
const uploadDir = path.join(process.cwd(), "music-library"); // Local storage path
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB limit (adjust as needed)

// Ensure upload directory exists
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

// Disable Next.js body parsing for this route (crucial for formidable)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  await fs.mkdir(path.join(uploadDir, "musics"), { recursive: true });

  const form = formidable({
    uploadDir, // Temporary directory for formidable to save files
    keepExtensions: true,
    maxFileSize: MAX_FILE_SIZE,
    multiples: false, // Only allow single file upload per request
    // filter: ({ mimetype }) => mimetype && mimetype.startsWith('audio/'), // Optional: Basic filter
  });

  try {
    const [fields, files] = await form.parse(req); // Parse the incoming form data

    const musicFile = files.music?.[0]; // Access the uploaded file by its field name 'music'
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
    if (!musicFile.mimetype || !allowedMimeTypes.includes(musicFile.mimetype)) {
      await fs.unlink(musicFile.filepath); // Delete the temporary file
      return res
        .status(400)
        .json({ message: "Invalid file type. Only audio files are allowed." });
    }

    // --- 2. Extract Metadata ---
    let metadata;
    try {
      metadata = await mm.parseFile(musicFile.filepath);
    } catch (metaError) {
      console.error("Error parsing music metadata:", metaError);
      await fs.unlink(musicFile.filepath); // Delete the temporary file
      return res
        .status(500)
        .json({ message: "Failed to extract music metadata." });
    }

    const { title, artist, album, genre, year, picture } = metadata.common;
    const { duration } = metadata.format;

    const newFileName = `${artist}-${title}`;
    // Process Album Art (Optional - save as separate image or base64)
    let coverArtUrl: string | null = null;
    if (picture && picture.length > 0) {
      const pic = picture[0];
      const imageExtension = mime.extension(pic.format || "");
      if (imageExtension) {
        const coverArtFileName = `${
          path.parse(musicFile.newFilename).name
        }.${imageExtension}`;
        const coverArtPath = path.join(uploadDir, "covers", coverArtFileName);
        await fs.mkdir(path.dirname(coverArtPath), { recursive: true });
        await fs.writeFile(coverArtPath, pic.data);
        coverArtUrl = `/music-library/covers/${coverArtFileName}`; // Publicly accessible URL
      }
    }

    // --- 3. Storage ---
    const finalFilePath = path.join(uploadDir, "musics", `${newFileName}.mp3`);

    // Rename the temporary file to its final destination
    await fs.rename(musicFile.filepath, finalFilePath);
    const finalFileUrl = `/music-uploads/${newFileName}.mp3`; // Relative URL for local playback

    // --- 4. Save to Database ---
    const newSong = await prisma.song.create({
      data: {
        name: newFileName,
        // artist: artist || "Unknown Artist", // This assumes `artist` is a string field
        album: album || "Unknown Album",
        genre: genre?.join(", ") || "Unknown",
        year: year ? String(year) : "Unknown", // Convert number to string if year is int
        duration: duration || 0,
        filePath: finalFileUrl, // Store the local path or S3 URL
        coverArtUrl, // Store the cover art URL
        // Link to an actual Artist model if you have one:
        artist: {
          connectOrCreate: {
            where: { name: artist || "Unknown Artist" },
            create: { name: artist || "Unknown Artist" },
          },
        },
        playlists: {
          connect: { id: 2 }, // Connect to an existing playlist
        },
      },
    });

    return res
      .status(201)
      .json({ message: "Music uploaded successfully!", newSong });
  } catch (error: any) {
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
};
