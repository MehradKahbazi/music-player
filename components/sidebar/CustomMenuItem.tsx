import NextLink from "next/link";
import { ListItem, ListIcon, LinkBox, LinkOverlay } from "@chakra-ui/layout";


// interface MenuProps {
//   menu: {
//     name: string;
//     route: string;
//     icon: any; // This is the magic fix for the "Too Complex" error
//   };
// }

const CustomMenuItem = ({ menu }) => {
  return (
    <ListItem paddingX="20px" fontSize="16px">
      <LinkBox>
        <NextLink href={menu.route} passHref>
          <LinkOverlay>
            <ListIcon as={menu.icon} color="white" marginRight="20px" />
            {menu.name}
          </LinkOverlay>
        </NextLink>
      </LinkBox>
    </ListItem>
  );
};

export default CustomMenuItem;
