import NextImage from "next/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import Player from "../player/Player";
import { useStoreState } from "easy-peasy";

const PlayerBar = () => {
  const songs = useStoreState((state: any) => state.activeSongs);
  const activeSong = useStoreState((state: any) => state.activeSong);

  return (
    <Box height="100px" width="100vw" bg="grey.900" padding="10px">
      <Flex align="center">
        {activeSong ? (
          <Flex width="30%" align="center">
            <Box>
              <NextImage
                width="60px"
                height="60px"
                unoptimized={true}
                src={`/api/images/${activeSong?.coverArtUrl}`}
              />
            </Box>
            <Box padding="20px" color="white">
              <Text fontSize="large">{activeSong.name}</Text>
              <Text fontSize="sm">{activeSong.artist.name}</Text>
            </Box>
          </Flex>
        ) : null}
        <Box width="40%" color="white">
          {activeSong ? <Player songs={songs} activeSong={activeSong} /> : null}
        </Box>
      </Flex>
    </Box>
  );
};

export default PlayerBar;
