import { Box, Flex, Text } from "@chakra-ui/layout";
import { Button, Input } from "@chakra-ui/react";

const ProfileForm = ({ isLoading, setMessage }) => {
  const handlesubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      firstName: formData.get("first-name"),
      lastName: formData.get("last-name"),
      email: formData.get("email"),
    };
    const res = await fetch("/api/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    setMessage(result.message);
  };
  return (
    <Box color="white" paddingX="40px">
      <Flex justify="space-around" width="100%">
        <Flex width="50%" direction="column" justify="space-between">
          <Box>
            <Text fontSize="sm" margin="5px">
              First Name
            </Text>
            <Input type="text" name="first-name" />
          </Box>
          <Box marginTop="15px">
            <Text fontSize="sm" margin="5px">
              Last Name
            </Text>
            <Input type="text" name="last-name" />
          </Box>
          <Box marginTop="15px">
            <Text fontSize="sm" margin="5px">
              Email
            </Text>
            <Input type="text" name="email" />
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
              isLoading={isLoading}
              onClick={handlesubmit}
            >
              Update
            </Button>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ProfileForm;
