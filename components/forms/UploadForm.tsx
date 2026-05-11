import NextImage from "next/image";
import { Box, Center, Flex, Text } from "@chakra-ui/layout";
import { Button, Input } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { MdFileUpload } from "react-icons/md";
import * as mm from "music-metadata-browser";
import { useRouter } from "next/router";

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setMessage("Uploading...");

    const formData = new FormData();
    formData.append("music", file); // 'music' must match the field name in API route

    try {
      const response = await fetch("/api/music", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Upload successful! ${data.message}`);
        setFile(null); // Clear file input

        const  timer = setTimeout(() => {
          router.push("/");
          clearTimeout(timer);
        }, 300);
      } else {
        setMessage(`Upload failed: ${data.message || response.statusText}`);
      }
    } catch (error: any) {
      setMessage(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (e) => {
    setFile(e.target.files ? e.target.files[0] : null);
    const inputFile = e.target.files[0];
    if (inputFile) {
      try {
        const metadata = await mm.parseBlob(inputFile);

        let base64String = null;

        if (metadata?.common?.picture?.[0]?.data instanceof Uint8Array) {
          try {
            base64String = Buffer.from(
              metadata.common.picture[0].data,
            ).toString("base64");
          } catch (bufferError) {
            console.error(
              "Error converting image data to Base64:",
              bufferError,
            );
          }
        } else {
          console.warn("No valid album art data found for conversion.");
        }

        setMeta({ ...metadata.common, image: base64String });
      } catch (parseError) {
        console.error("Error parsing audio file metadata:", parseError);
        setMeta(null);
      }
    } else {
      setMeta(null);
    }
  };

  const handleInput = (e) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  return (
    <Box position="relative">
      <Box
        height="calc(100vh - 100px)"
        backgroundImage="/bg.png"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
      />
      <Box
        height="calc(100vh - 100px)"
        width="100%"
        bg="rgba(0,0,0,0.5)"
        backdropFilter="blur(5px)"
        color="white"
        position="absolute"
        zIndex={10}
        top="0"
      >
        <Box padding="2rem" bg="black">
          <Text color="white" fontSize="3xl" fontWeight="500">
            Upload a Music
          </Text>
        </Box>
        <Flex justify="center" align="center" marginTop="1rem">
          <Box
            bg="grey.900"
            width="95%"
            height="calc(100vh - 250px)"
            borderRadius="5px"
            overflowY="auto"
          >
            <Center height="100%">
              <form style={{ width: "100%" }}>
                <input
                  type="file"
                  accept="audio/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleInputChange}
                />
               
                {!meta ? (
                  <Flex
                    width="100%"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Button
                      leftIcon={<MdFileUpload />}
                      colorScheme="teal"
                      onClick={handleInput}
                      variant="solid"
                      //   display={!meta ? 'block' : 'none'}
                    >
                      Select Music
                    </Button>
                  </Flex>
                ) : (
                  <Flex justify="space-around" width="100%">
                    <Box
                      borderRadius="5px"
                      overflow="hidden"
                      position="relative"
                      width="250px"
                      height="250px"
                    >
                      {meta?.image && (
                        <NextImage
                          src={`data:image/png;base64,${meta?.image}`}
                          height={250}
                          width={250}
                          objectFit="cover"
                          layout="fill"
                        />
                      )}
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
                    </Box>
                    <Flex
                      width="50%"
                      direction="column"
                      justify="space-between"
                    >
                      <Box>
                        <Text fontSize="sm" margin="5px">
                          Artist
                        </Text>
                        <Input type="text" value={meta.artist} disabled />
                      </Box>
                      <Box marginTop="15px">
                        <Text fontSize="sm" margin="5px">
                          Album
                        </Text>
                        <Input type="text" value={meta.album} disabled />
                      </Box>
                      <Box marginTop="15px">
                        <Text fontSize="sm" margin="5px">
                          Artist
                        </Text>
                        <Input type="text" value={meta.title} disabled />
                      </Box>
                      <Box marginTop="15px">
                        <Text fontSize="sm" margin="5px">
                          Year
                        </Text>
                        <Input type="text" value={meta.year} disabled />
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
                          isLoading={loading}
                          onClick={handleSubmit}
                        >
                          Upload
                        </Button>
                      </Box>
                    </Flex>
                  </Flex>
                )}
              </form>
            </Center>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default UploadForm;
