import GradientLayout from "../../components/gradientLayout/GradientLayout";
import { validateToken } from "../../lib/auth";
import prisma from "../../lib/prisma";
import ContentCard from "../../components/content/ContentCard";

const getBGColor = (id) => {
  const colors = [
    "red",
    "green",
    "blue",
    "orange",
    "purple",
    "grey",
    "teal",
    "yellow",
  ];

  return colors[id - 1] || colors[Math.floor(Math.random() * colors.length)];
};

const Artist = ({ artist }) => {
  const color = getBGColor(artist?.id);

  return (
    <GradientLayout
      color={color}
      roundImage
      title={artist?.name}
      subtitle="playlist"
      description={`${artist?._count.songs} ${
        artist?._count.songs === 1 ? "song" : "songs"
      }`}
      image={artist?.imageUrl || "/artist.avif"}
      type="artist"
      id={artist.id}
      edit
    >
      <ContentCard items={artist?.albums} cat="album" />
    </GradientLayout>
  );
};

export const getServerSideProps = async ({ query, req }) => {
  try {
    validateToken(req.cookies.ACCESS_TOKEN);
  } catch (e) {
    return {
      redirect: {
        permanent: false,
        destination: "/signin",
      },
    };
  }
  const artist = await prisma.artist.findUnique({
    where: { name: query.name },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      albums: {
        select: {
          id: true,
          name: true,
          albumArtUrl: true,
          year: true,
        },
      },
      _count: {
        select: {
          songs: true,
        },
      },
    },
  });
  

  return {
    props: {
      artist,
    },
  };
};

export default Artist;
