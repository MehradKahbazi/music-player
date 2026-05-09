import { Box, Flex, Text } from "@chakra-ui/layout";
import { Button, Image, Input } from "@chakra-ui/react";
import GradientLayout from "../components/gradientLayout/GradientLayout";
import { useMe } from "../lib/hooks";
import { useState } from "react";

const Profile = () => {
  const { user, isLoading } = useMe();
  const [message, setMessage] = useState("");
  return (
    <GradientLayout
      color="blue"
      subtitle="profile"
      title={`${user?.firstName} ${user?.lastName}`}
      description={`${user?.playListCount} public playlist`}
      image={user?.imageUrl || "/prof.avif"}
      roundImage
      edit
      id={user?.id}
    >
      <Box color="white" paddingX="40px">
        <Flex justify="space-around" width="100%">
          {/* <Box
            borderRadius="5px"
            overflow="hidden"
            position="relative"
            width="250px"
            height="250px"
          >
            {message && (
              <Flex
                align="center"
                justify="center"
                height="250px"
                width="250px"
                bg="#00000094"
                position="absolute"
                zIndex="100"
              >
                <Text>{message}</Text>
              </Flex>
            )}
          </Box> */}
          <Flex width="50%" direction="column" justify="space-between">
            <Box>
              <Text fontSize="sm" margin="5px">
                First Name
              </Text>
              <Input type="text" />
            </Box>
            <Box marginTop="15px">
              <Text fontSize="sm" margin="5px">
                Last Name
              </Text>
              <Input type="text" />
            </Box>
            <Box marginTop="15px">
              <Text fontSize="sm" margin="5px">
                Email
              </Text>
              <Input type="text" />
            </Box>
            

            <Box marginTop="30px">
              <Button
                isFullWidth
                variant="outline"
                borderColor="green.500"
                color="green.500"
                sx={{
                  "&:hover": {
                    bg: "green.500",
                    color: "white",
                  },
                }}
              >
                Update
              </Button>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </GradientLayout>
  );
};

export default Profile;
