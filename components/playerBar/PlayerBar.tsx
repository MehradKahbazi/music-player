import { Box, Flex, Text } from "@chakra-ui/layout";
import Player from "../player/Player";

const PlayerBar = () => {
  return (
    <Box height="100px" width="100vw" bg="grey.900" padding="10px">
      <Flex align="center">
        <Box padding="20px" color="white" width="30%">
          <Text fontSize="large">Song Name</Text>
          <Text fontSize="sm">Artist Name</Text>
        </Box>
        <Box width="40%" color="white">
          <Player />
        </Box>
      </Flex>
    </Box>
  );
};

export default PlayerBar;
