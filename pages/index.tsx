import { Box, Flex, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/react";
import GradientLayout from "../components/gradientLayout/GradientLayout";
import prisma from "../lib/prisma";
import { useMe } from "../lib/hooks";
import ContentCard from "../components/content/ContentCard";

const Home = ({ artists }) => {
  const { user, isLoading } = useMe();

  if (isLoading) {
    return null;
  }
  return (
    <GradientLayout
      color="blue"
      subtitle="profile"
      title={`${user?.firstName} ${user?.lastName}`}
      description={`${user?.playListCount} public playlist`}
      image={user?.imageUrl || "/prof.avif"}
      roundImage
    >
      <Box color="white" paddingX="40px">
        <Box marginBottom="40px">
          <Text fontSize="2xl" fontWeight="bold">
            Top artists this month
          </Text>
          <Text fontSize="md">Only visible to you</Text>
        </Box>
        <ContentCard items={artists} cat="artist" />
      </Box>
    </GradientLayout>
  );
};

export const getServerSideProps = async () => {
  const artists = await prisma.artist.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select:{
      id: true,
      imageUrl: true,
      name: true,
      _count:{
        select:{
          songs: true,
        }
      }
    }
  });

  return {
    props: {
      artists,
    },
  };
};

export default Home;
