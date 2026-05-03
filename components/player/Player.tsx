import {
  ButtonGroup,
  Box,
  IconButton,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderTrack,
  RangeSliderThumb,
  Center,
  Flex,
  Text,
} from "@chakra-ui/react";
import ReactHowler from "react-howler";
import { useEffect, useRef, useState } from "react";
import {
  MdShuffle,
  MdSkipPrevious,
  MdSkipNext,
  MdOutlinePlayCircleFilled,
  MdOutlinePauseCircleFilled,
  MdOutlineRepeat,
} from "react-icons/md";

import { useStoreActions } from "easy-peasy";

const Player = ({ songs, activeSong }) => {
  const [playing, setPlaying] = useState(true);
  const [index, setIndex] = useState(0);
  const [seek, setSeek] = useState(0.0);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [duration, setDuration] = useState(0.0);

  const setPlayState = (value) => {
    setPlaying(value);
  };

  return (
    <Box>
      <Box>{/* <ReactHowler playing={playing} src={activeSong?.url} /> */}</Box>
      <Center>
        <ButtonGroup>
          <IconButton
            outline="none"
            variant="link"
            // color="gray.600"
            aria-label="shuffle"
            fontSize="24px"
            color={shuffle ? "white" : "gray.600"}
            onClick={() => setShuffle((prev) => !prev)}
            icon={<MdShuffle />}
          />
          <IconButton
            outline="none"
            variant="link"
            color="gray.600"
            aria-label="prev"
            fontSize="24px"
            icon={<MdSkipPrevious />}
          />
          {playing ? (
            <IconButton
              outline="none"
              variant="link"
              color="gray.600"
              aria-label="pause"
              fontSize="40px"
              color="white"
              icon={<MdOutlinePauseCircleFilled />}
              onClick={() => setPlaying(false)}
            />
          ) : (
            <IconButton
              outline="none"
              variant="link"
              color="gray.600"
              aria-label="play"
              fontSize="40px"
              color="white"
              icon={<MdOutlinePlayCircleFilled />}
              onClick={() => setPlaying(true)}
            />
          )}

          <IconButton
            outline="none"
            variant="link"
            color="gray.600"
            aria-label="next"
            fontSize="24px"
            icon={<MdSkipNext />}
          />
          <IconButton
            outline="none"
            variant="link"
            color={repeat ? "white" : "gray.600"}
            aria-label="repeat"
            fontSize="24px"
            onClick={() => setRepeat((prev) => !prev)}
            icon={<MdOutlineRepeat />}
          />
        </ButtonGroup>
      </Center>
      <Box color="grey.600">
        <Flex justify="center" align="center">
          <Box width="10%">
            <Text fontSize="xs">1:21</Text>
          </Box>
          <Box width="80%">
            <RangeSlider
              aria-label={["min", "max"]}
              step={0.1}
              min={0}
              max={300}
              id="player-range"
            >
              <RangeSliderTrack bg="grey.800">
                <RangeSliderFilledTrack bg="grey.600" />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
            </RangeSlider>
          </Box>

          <Box width="10%" textAlign="right">
            <Text fontSize="xs">1:21</Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Player;
