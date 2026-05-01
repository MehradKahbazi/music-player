import NextImage from "next/image";
import NextLink from "next/link";
import { As } from "@chakra-ui/react";
import {
  Box,
  Divider,
  LinkBox,
  LinkOverlay,
  List,
  ListItem,
} from "@chakra-ui/layout";
import {
  MdHome,
  MdSearch,
  MdLibraryMusic,
  MdPlaylistAdd,
  MdFavorite,
} from "react-icons/md";
import CustomMenuItem from "./CustomMenuItem";

// export interface NavItem {
//   name: string;
//   route: string;
//   icon: As; // This tells Chakra "This is a component we can use in the 'as' prop"
// }

const navMenu = [
  { name: "Home", icon: MdHome, route: "/" },
  { name: "Search", icon: MdSearch, route: "/search" },
  { name: "Your Library", icon: MdLibraryMusic, route: "/library" },
];

const musicMenu = [
  { name: "Create Playlist", icon: MdPlaylistAdd, route: "/" },
  { name: "Favorites", icon: MdFavorite, route: "/favorites" },
];

const playListz = new Array(30).fill(1).map((_, i) => `playlist ${i + 1}`);

const Sidebar = () => {
  return (
    <Box
      width="100%"
      height="calc(100vh - 100px)"
      paddingX="5px"
      bg="black"
      color="grey"
    >
      <Box paddingY="20px" height="100%">
        <Box width="120px" marginBottom="20px" paddingX="20px">
          <NextImage src="/logo.svg" height={60} width={120} />
        </Box>
        <Box>
          <List spacing={2}>
            {navMenu.map((menu) => (
              <CustomMenuItem menu={menu} key={menu.name} />
            ))}
          </List>
        </Box>
        <Box marginTop="20px">
          <List spacing={2}>
            {musicMenu.map((menu) => (
              <CustomMenuItem menu={menu} key={menu.name} />
            ))}
          </List>
        </Box>
        <Divider marginY="20px" color="grey.700" />
        <Box height="66%" overflowY="auto" paddingY="20px">
          <List spacing={2}>
            {playListz.map((playList) => (
              <ListItem paddingX="20px" key={playList}>
                <LinkBox>
                  <NextLink href="/" passHref>
                    <LinkOverlay>{playList}</LinkOverlay>
                  </NextLink>
                </LinkBox>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
