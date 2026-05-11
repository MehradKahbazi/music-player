import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { artistsData } from "./songsData";

const prisma = new PrismaClient();

const run = async () => {
  await Promise.all(
    artistsData.map(async (artistData) => {
      // 1. First, ensure the Artist exists and get their ID
      const artist = await prisma.artist.upsert({
        where: { name: artistData.name },
        update: {},
        create: { name: artistData.name },
      });

      // 2. Create a "Default Album" for this artist
      // We use connectOrCreate so we don't create duplicate albums
      // if the seed runs twice.
      const album = await prisma.album.create({
        // where: {
        //   // This requires 'name' to be @unique in your Album model
        //   name: `${artistData.name} Collection`
        // },
        // update: {},
        data: {
          name: `${artistData.name} Collection`,
          genre: "Various",
          artistId: artist.id, // We now have the artist ID!
        },
      });

      // 3. Create the Songs and link them to both the Artist and the Album
      // We use Promise.all here to create all songs for this artist
      return Promise.all(
        artistData.songs.map((song) =>
          prisma.song.create({
            data: {
              name: song.name,
              duration: song.duration,
              url: song.url,
              artistId: artist.id, // Link to Artist
              albumId: album.id, // Link to Album
            },
          }),
        ),
      );
    }),
  );
  // const unknownArtist = await prisma.artist.upsert({
  //   where: { name: "Unknown Artist" },
  //   update: {},
  //   create: { name: "Unknown Artist" },
  // });

  // const defaultAlbum = await prisma.album.create({
  //   where: { name: "Single Tracks" },
  //   update: {},
  //   create: {
  //     name: "Single Tracks",
  //     artistId: unknownArtist.id,
  //   },
  // });
  // await Promise.all(
  //   artistsData.map(async (artist) => {
  //     return prisma.artist.upsert({
  //       where: { name: artist.name },
  //       update: {},
  //       create: {
  //         name: artist.name,
  //         songs: {
  //           create: artist.songs.map((song) => ({
  //             name: song.name,
  //             duration: song.duration,
  //             url: song.url,
  //             album: defaultAlbum,
  //           })),
  //         },
  //       },
  //     });
  //   }),
  // );

  const salt = bcrypt.genSaltSync();
  const user = await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      email: "user@test.com",
      password: bcrypt.hashSync("password", salt),
      firstName: "Mehrad",
      lastName: "Kahbazi",
    },
  });

  const songs = await prisma.song.findMany({});
  // 4. Seed Playlist
  await prisma.playlist.upsert({
    where: {
      // Note: You might need a unique constraint on Playlist name or ID
      // For now, we'll use a simple create if you don't have a unique name
      id: 1,
    },
    update: {},
    create: {
      name: "Cloud Playlist",
      user: {
        connect: { id: user.id },
      },
      songs: {
        connect: songs.map((song) => ({ id: song.id })),
      },
    },
  });
  await prisma.playlist.create({
    data: {
      name: `Recently Added`,
      user: {
        connect: { id: user.id },
      },
    },
  });

  // 5. Seed Various Artist and Album
  // Changed to upsert so it doesn't crash on the second run
  // await prisma.artist.upsert({
  //   where: { name: "Various Artist" },
  //   update: {},
  //   create: {
  //     name: "Various Artist",
  //     albums: {
  //       create: {
  //         name: "Cloud Music",
  //         genre: "Unknown",
  //         songs: {
  //           connect: songs.map((song) => ({ id: song.id })),
  //         },
  //       },
  //     },
  //   },
  // });
  // await prisma.playlist.create({
  //   data: {
  //     name: `Cloud Playlist`,
  //     user: {
  //       connect: { id: user.id },
  //     },
  //     songs: {
  //       connect: (await songs).map((song) => ({ id: song.id })),
  //     },
  //   },
  // });

  // const artist = await prisma.artist.create({
  //   data: {
  //     name: "Various Artist",
  //     albums: {
  //       create: {
  //         name: "Cloud Music",
  //         genre: "Unknown",
  //         songs:{
  //           connect: (await songs).map((song) => ({ id: song.id })),
  //         }
  //       },
  //     },
  //   },
  // });
  // const album = await prisma.album.create({
  //   data:{
  //     ,

  //   }
  // });

  // })
  // await Promise.all(
  //   new Array(10).fill(1).map(async (_, i) => {
  //     return prisma.playlist.create({
  //       data: {
  //         name: `Playlist #${i + 1}`,
  //         user: {
  //           connect: { id: user.id },
  //         },
  //         songs: {
  //           connect: (await songs).map((song) => ({ id: song.id })),
  //         },
  //       },
  //     });
  //   }),
  // );
};

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
