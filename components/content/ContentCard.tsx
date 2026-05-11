import NextLink from 'next/link';
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/react";

const ContentCard = ({ items, cat }) => {

  return (
    <Flex>
      {items?.map((item) => (
        <NextLink  key={item.id} href={`${cat}/${item.name}`}>
            <Box paddingX="10px" width="20%" cursor='pointer'>
          <Box bg="grey.900" borderRadius="4px" padding="15px" width="100%">
            <Image
              src={
                !item?.albumArtUrl || item?.imageUrl
                  ? "/artist.avif"
                  : `/api/images/${item?.albumArtUrl || item?.imageUrl}`
              }
              borderRadius="100%"
            />
            <Box marginTop="20px" color="white">
              <Text fontSize="large">{item?.name}</Text>
              <Text fontSize="x-small">
                {item?.year || `${item?._count?.songs} songs`}
              </Text>
            </Box>
          </Box>
        </Box>
        </NextLink>
      ))}
    </Flex>
  );
};

export default ContentCard;
