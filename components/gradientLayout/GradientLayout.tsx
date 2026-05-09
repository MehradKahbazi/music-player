import { Box, Flex, Text } from "@chakra-ui/layout";
import { Button, Image } from "@chakra-ui/react";
import { useRef } from "react";

const GradientLayout = ({
  color,
  children,
  image,
  subtitle,
  title,
  description,
  roundImage,
  edit = false,
  id,
}) => {
  const fileRef = useRef(null);

  const handleClick = () => {
    fileRef.current?.click();
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file); // Matches 'files.image' in API
    formData.append("type", "user"); // 'user' or 'artist'
    formData.append("id", id); // The record ID

    try {
      const response = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Success:", result);
        return result.url;
      }
      alert(result.message);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <Box
      height="calc(100vh - 100px)"
      overflowY="auto"
      bgGradient={`linear(${color}.500 0%, ${color}.600 15%, ${color}.700 40%, rgba(0,0,0,0.95) 75%)`}
    >
      <Flex bg={`${color}.600`} padding="40px" align="end">
        <Box padding="20px">
          <Box
            position="relative"
            overflow="hidden"
            borderRadius={roundImage ? "100%" : "3px"}
          >
            <Image
              boxSize="160px"
              boxShadow="2xl"
              src={`api/images/${image}`}
              borderRadius={roundImage ? "100%" : "3px"}
            />
            {edit && (
              <Box
                position="absolute"
                bg="#00000077"
                zIndex={10}
                width="100%"
                height="30%"
                bottom="0"
                left="0"
                textAlign="center"
                paddingY="10px"
                sx={{
                  "&: hover": {
                    transition: ".1s",
                    bg: "#0000008c",
                  },
                }}
                onClick={handleClick}
                cursor="pointer"
              >
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={fileRef}
                  onChange={handleUpload}
                />
                <Text color="white">Edit</Text>
              </Box>
            )}
          </Box>
        </Box>
        <Box padding="20px" lineHeight="40px" color="white">
          <Text fontSize="x-small" fontWeight="bold" casing="uppercase">
            {subtitle}
          </Text>
          <Text fontSize="6xl">{title}</Text>
          <Text fontSize="x-small">{description}</Text>
        </Box>
      </Flex>
      <Box paddingY="50px">{children}</Box>
    </Box>
  );
};

export default GradientLayout;
