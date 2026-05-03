import prisma from "../../lib/prisma";
import GradientLayout from "../../components/gradientLayout/GradientLayout";
import { validateToken } from "../../lib/auth";
import SongsTable from "../../components/songsTable/SongsTable";

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

const Playlist = ({ playList }) => {
  const color = getBGColor(playList.id);

  return (
    <GradientLayout
      color={color}
      roundImage={false}
      title={playList.name}
      subtitle="playlist"
      description={`${playList.songs.length} songs`}
      image="/sample2.jpg"
    >
      <SongsTable songs={playList.songs} />
    </GradientLayout>
  );
};

export const getServerSideProps = async ({ query, req }) => {
  let user;
  try {
    user = validateToken(req.cookies.ACCESS_TOKEN);
  } catch (e) {
    return {
      redirect: {
        permanent: false,
        destination: "/signin",
      },
    };
  }

  const playList = await prisma.playlist.findFirst({
    where: {
      id: +query.id,
      userId: user.id,
    },
    include: {
      songs: {
        include: {
          artist: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });

  return {
    props: {
      playList,
    },
  };
};

export default Playlist;
