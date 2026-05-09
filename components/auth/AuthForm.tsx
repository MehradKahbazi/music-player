import NextLink from "next/link";
import { Box, Flex, Input, Button, Text, Divider } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSWRConfig } from "swr";
import NextImage from "next/image";
import { auth } from "../../lib/mutations";

const AuthForm = ({ mode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    await auth(mode, { email, password });
    setIsLoading(false);
    router.push("/");
  };

  return (
    <>
      <Box
        height="100vh"
        width="100vw"
        backgroundImage="/bg.png"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
      />
      <Box
        height="100vh"
        width="100vw"
        bg="rgba(0,0,0,0.5)"
        backdropFilter="blur(5px)"
        color="white"
        position="absolute"
        zIndex={10}
        top="0"
        left="0"
      >
        {/* <Flex
        justify="center"
        align="center"
        height="100px"
        borderBottom="white 1px solid"
      >
        <NextImage src="/logo.svg" height={60} width={120} />
      </Flex> */}
        <Flex justify="center" align="center" height="calc(100vh - 100px)">
          <Box
            padding="50px"
            bg="#121212"
            borderRadius="6px"
            width="30%"
            boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.37)"
          >
            <Flex
              justify="center"
              align="center"
              height="100px"
              direction="column"
              marginBottom="2rem"
            >
              <NextImage src="/logo.svg" height={60} width={120} />
              <Text fontSize="2xl" fontWeight="500">
                Music for everyone
              </Text>
            </Flex>

            <form onSubmit={handleSubmit}>
              <Input
                paddingY="1.4rem"
                placeholder="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                marginBottom="1.3rem"
                bg="grey.800"
              />
              <Input
                paddingY="1.4rem"
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                marginBottom="1.5rem"
                bg="grey.800"
              />
              <Button
                type="submit"
                bg="white"
                color="grey.900"
                isFullWidth
                borderRadius="100px"
                paddingY="1.7rem"
                textTransform="uppercase"
                isLoading={isLoading}
                sx={{
                  "&:hover": {
                    bg: "green.300",
                  },
                }}
              >
                {mode === "signin" ? "login" : mode}
              </Button>
            </form>
            <Flex align="center" width="100%" marginY="1.5rem">
              <Divider />
              <Text px="4" fontSize="sm" whiteSpace="nowrap">
                OR
              </Text>
              <Divider />
            </Flex>
            <Box>
              <Button
                type="submit"
                bg="blue.700"
                color="white"
                isFullWidth
                borderRadius="100px"
                paddingY="1.7rem"
                textTransform="uppercase"
                sx={{
                  "&:hover": {
                    bg: "blue.600",
                  },
                }}
              >
                login with facebook
              </Button>
            </Box>
            <Flex
              textTransform="uppercase"
              align="center"
              justify="center"
              marginTop="1.2rem"
              fontSize="sm"
              width="100%"
              gap={2}
            >
              <Text>don't have an account?</Text>
              <Text textDecoration="underline">
                <NextLink href="/signup">signup</NextLink>
              </Text>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default AuthForm;
