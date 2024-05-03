"use client";

import { formatViews, shrinkTitle } from "@/utils/format";
import {
  Button,
  ChakraProvider,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Switch,
  Text,
  border,
  useToast,
} from "@chakra-ui/react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from "@chakra-ui/react";
import { CheckCircleIcon, DownloadIcon, LinkIcon } from "@chakra-ui/icons";
import { toPng, toSvg } from "html-to-image";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const TRANSPARENT = "/assets/img/transparent.png";

const mockData = {
  id: "DanJ4sb6KxY",
  thumbnail: "/data/DanJ4sb6KxY.jpg",
  durationString: "2:38:55",
  title:
    "Bafé Gomis, La Grande Carrière de la Panthère - Zack en Roue Libre avec Bafé Gomis (S07E29)",
  channel: {
    name: "ZACK",
    verified: true,
    thumbnail: "/data/UCSJxne19pJyW7l7HjHM_LRg.jpg",
  },
  uploaded: "2 jours",
  views: 101000,
};

function VerifiedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      focusable="false"
      style={{
        pointerEvents: "none",
        display: "block",
        width: 14,
        height: 14,
      }}
    >
      <path
        d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zM9.8 17.3l-4.2-4.1L7 11.8l2.8 2.7L17 7.4l1.4 1.4-8.6 8.5z"
        className="fill-secondary"
      ></path>
    </svg>
  );
}

const defaultPadding = 25;
const defaultBorderRadius = 25;
const defaultWatchbarProgress = 0;
const defaultNightMode = false;

export default function CardEditor() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(mockData);
  const [padding, setPadding] = useState(defaultPadding);
  const [borderRadius, setBorderRadius] = useState(defaultBorderRadius);
  const [watchbarProgress, setWatchbarProgress] = useState(
    defaultWatchbarProgress
  );
  const [nightMode, setNightMode] = useState(defaultNightMode);
  const [cardRef, setCardRef] = useState(null);
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState("png");
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const toggleCopied = () => {
    setCopied(true);
    toast({
      title: "Link copied",
      description: "The shareable link has been copied to your clipboard.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const getFromLocalStorageOrDefault = (key, defaultValue) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  };

  useEffect(() => {
    if (searchParams.has("video")) {
      handleUrlChange(
        `https://www.youtube.com/watch?v=${searchParams.get("video")}`
      );
    }
    if (
      searchParams.has("padding") ||
      searchParams.has("borderRadius") ||
      searchParams.has("watchbarProgress") ||
      searchParams.has("nightMode")
    ) {
      setPadding(searchParams.get("padding") || defaultPadding);
      setBorderRadius(searchParams.get("borderRadius") || defaultBorderRadius);
      setWatchbarProgress(
        parseInt(
          searchParams.get("watchbarProgress") || defaultWatchbarProgress
        )
      );
      setNightMode(
        searchParams.get("nightMode") === "true" || defaultNightMode
      );
    } else {
      setPadding(getFromLocalStorageOrDefault("padding", defaultPadding));
      setBorderRadius(
        getFromLocalStorageOrDefault("borderRadius", defaultBorderRadius)
      );
      setWatchbarProgress(
        getFromLocalStorageOrDefault(
          "watchbarProgress",
          defaultWatchbarProgress
        )
      );
      setNightMode(getFromLocalStorageOrDefault("nightMode", defaultNightMode));
    }
  }, [searchParams]);

  const isValidUrl = (url) => {
    const pattern = new RegExp("^(https?://)?(www.youtube.com|youtu.?be)/.+$");
    return pattern.test(url);
  };

  const getId = (url) => {
    const pattern = new RegExp(
      "^(https?://)?(www.youtube.com|youtu.?be)/(watch\\?v=|embed/|v/|.+/|)([a-zA-Z0-9_-]{11})"
    );
    const match = url.match(pattern);
    return match ? match[4] : null;
  };

  const handleDownload = () => {
    const node = document.querySelector(".card");
    const convert = format === "svg" ? toSvg : toPng;
    convert(node, {
      canvasWidth: node.offsetWidth * 2,
      canvasHeight: node.offsetHeight * 2,
    }).then(
      (dataUrl) => {
        let img = new Image();
        img.src = dataUrl;
        let a = document.createElement("a");
        a.href = dataUrl;
        a.download = `${data.title}.${format}`;
        a.click();
      },
      (error) => {
        console.error("Failed to generate image", error);
      }
    );
  };

  const handleUrlChange = async (url) => {
    if (isValidUrl(url)) {
      const id = getId(url);
      if (id) {
        setLoading(true);
        const response = await fetch(`/api/video?id=${id}`);
        if (response.ok) {
          const video = await response.json();
          setLoading(false);
          setError(null);
          setData(video);
        } else {
          setError("Failed to fetch video");
        }
      }
    }
  };

  const resetProperties = () => {
    setPadding(defaultPadding);
    setBorderRadius(defaultBorderRadius);
    setWatchbarProgress(defaultWatchbarProgress);
    setNightMode(defaultNightMode);
    localStorage.clear();
  };

  const saveProperties = () => {
    localStorage.setItem("padding", JSON.stringify(padding));
    localStorage.setItem("borderRadius", JSON.stringify(borderRadius));
    localStorage.setItem("watchbarProgress", JSON.stringify(watchbarProgress));
    localStorage.setItem("nightMode", JSON.stringify(nightMode));
    toast({
      title: "Properties saved",
      description: "Your properties have been saved successfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const getShareableLink = () => {
    if (typeof window !== "undefined" || !data)
      return `${window.location.origin}/?video=${data.id}&padding=${padding}&borderRadius=${borderRadius}&watchbarProgress=${watchbarProgress}&nightMode=${nightMode}`;
  };

  return (
    <main>
      {data && (
        <section className="flex-column gap-20">
          {error && (
            <Text
              color="red.500"
              fontWeight="bold"
              textAlign="center"
              paddingBottom="20px"
            >
              {error}
            </Text>
          )}
          <div
            className="card-container"
            style={{
              borderRadius: `${borderRadius}px`,
            }}
          >
            <div
              className={`card ${nightMode ? "dark" : ""}`}
              style={{
                padding: `${padding}px`,
                borderRadius: `${borderRadius}px`,
              }}
              ref={setCardRef}
            >
              <div className="card-thumb-container">
                <img
                  src={loading ? TRANSPARENT : data.thumbnail}
                  alt="placeholder"
                  className={`card-thumb ${loading ? "loading" : ""}`}
                  crossOrigin="anonymous"
                />
                <span
                  className="card-duration"
                  style={watchbarProgress === 0 ? { bottom: 8 } : {}}
                >
                  {data.durationString}
                </span>
                <div
                  className="card-watchbar"
                  style={{
                    display: watchbarProgress === 0 ? "none" : "block",
                  }}
                >
                  <div
                    className="card-watchbar-progress"
                    style={{
                      width: `${Math.min(watchbarProgress, 100)}%`,
                      borderRadius: `0 0 ${
                        watchbarProgress === 100 ? 8 : 0
                      }px 8px`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="card-info">
                <div className="card-avatar-title">
                  <img
                    className={`card-channel-avatar ${
                      loading ? "loading" : ""
                    }`}
                    src={loading ? TRANSPARENT : data.channel.thumbnail}
                    alt="channel-avatar"
                    crossOrigin="anonymous"
                  />
                  <div className="card-meta-container">
                    <h2
                      className={`card-title ${
                        loading ? "box-loading full-width" : ""
                      }`}
                    >
                      {shrinkTitle(data.title)}
                    </h2>
                    <div>
                      <span
                        className={`card-channel card-subtitle ${
                          loading ? "box-loading quarter-width" : ""
                        }`}
                      >
                        {data.channel.name}
                        {!loading && data.channel.verified && <VerifiedIcon />}
                      </span>
                      <div
                        className={`card-meta ${
                          loading ? "box-loading half-width" : ""
                        }`}
                      >
                        <span className="card-views card-subtitle">
                          {formatViews(data.views)} vues
                        </span>
                        <span className="card-date card-subtitle">
                          {data.uploaded}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Stack spacing={4}>
            <Input
              placeholder="YouTube URL"
              type="url"
              onChange={(e) => {
                handleUrlChange(e.target.value);
              }}
              className="full-width"
              focusBorderColor={"#ff0000"}
              width="100%"
            />
            <Stack direction="row" spacing={4} justifyContent="center">
              <Button
                leftIcon={<DownloadIcon />}
                isLoading={loading}
                colorScheme="red"
                variant="solid"
                flex={1}
                onClick={handleDownload}
              >
                Download
              </Button>
              <Select
                value={format}
                onChange={(e) => {
                  setFormat(e.target.value);
                }}
                focusBorderColor={"#ff0000"}
                width={"max-content"}
              >
                <option value="png">PNG</option>
                <option value="svg">SVG</option>
              </Select>
            </Stack>
          </Stack>
        </section>
      )}
      <article
        className="full-width flex-column gap-20"
        style={{
          maxWidth: "400px",
        }}
      >
        <section className="properties">
          <div className="property">
            <h3>Padding</h3>
            <NumberInput
              value={padding}
              onChange={(value) => {
                setPadding(value);
              }}
              className="full-width"
              focusBorderColor={"#ff0000"}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Slider
              aria-label="slider-ex-1"
              value={padding}
              colorScheme={"red"}
              onChange={(value) => {
                setPadding(value);
              }}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
              <SliderMark value={padding} label="16px" />
            </Slider>
          </div>
          <div className="property">
            <h3>Border Radius</h3>
            <NumberInput
              value={borderRadius}
              onChange={(value) => {
                setBorderRadius(value);
              }}
              className="full-width"
              focusBorderColor={"#ff0000"}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Slider
              aria-label="slider-ex-1"
              value={borderRadius}
              colorScheme={"red"}
              onChange={(value) => {
                setBorderRadius(value);
              }}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
              <SliderMark value={borderRadius} label="8px" />
            </Slider>
          </div>
          <div className="property">
            <h3>Watchbar Progress</h3>
            <NumberInput
              value={watchbarProgress}
              min={0}
              max={100}
              onChange={(value) => {
                setWatchbarProgress(value);
              }}
              className="full-width"
              focusBorderColor={"#ff0000"}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Slider
              aria-label="slider-ex-1"
              value={watchbarProgress}
              colorScheme={"red"}
              min={0}
              max={100}
              onChange={(value) => {
                setWatchbarProgress(value);
              }}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
              <SliderMark value={watchbarProgress} label="0%" />
            </Slider>
          </div>
          <div className="property">
            <h3>Night mode</h3>
            <Switch
              colorScheme={"red"}
              isChecked={nightMode}
              onChange={(e) => {
                setNightMode(e.target.checked);
              }}
            />
          </div>
        </section>
        <Stack direction="row" spacing={4} justifyContent="center">
          <Button
            colorScheme="red"
            variant="outline"
            onClick={resetProperties}
            flex={1}
          >
            Reset
          </Button>
          <Button
            colorScheme="red"
            variant="solid"
            onClick={saveProperties}
            flex={1}
          >
            Save
          </Button>
        </Stack>
        <Stack direction="row" spacing={4} justifyContent="center">
          <Input
            value={getShareableLink()}
            isReadOnly
            className="full-width"
            colorScheme={"red"}
          />
          <Button
            leftIcon={copied ? <CheckCircleIcon /> : <LinkIcon />}
            colorScheme="red"
            variant="solid"
            onClick={(e) => {
              navigator.clipboard.writeText(getShareableLink());
              toggleCopied();
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </Stack>
      </article>
    </main>
  );
}
