"use client";

import { formatViews, shrinkTitle } from "@/utils/format";
import {
  ChakraProvider,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Switch,
  border,
} from "@chakra-ui/react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from "@chakra-ui/react";
import { useState } from "react";

const mockData = {
  id: "DanJ4sb6KxY",
  thumbnail:
    "https://i.ytimg.com/vi/DanJ4sb6KxY/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAIXExV7S_DnrHmJMn6U3a6HQyzgg",
  durationString: "2:38:55",
  title:
    "Bafé Gomis, La Grande Carrière de la Panthère - Zack en Roue Libre avec Bafé Gomis (S07E29)",
  channel: {
    name: "ZACK",
    verified: true,
    thumbnail:
      "https://yt3.ggpht.com/ytc/AIdro_kDPp1JFfNZw1d-bzKRR1k5CRHqWQrm74Eoxe7akk2Xsak=s68-c-k-c0x00ffffff-no-rj",
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

export default function CardEditor() {
  const [data, setData] = useState(mockData);
  const [padding, setPadding] = useState(25);
  const [borderRadius, setBorderRadius] = useState(25);
  const [watchbarProgress, setWatchbarProgress] = useState(0);
  const [nightMode, setNightMode] = useState(false);

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

  const sanitizeHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    doc.querySelectorAll("script").forEach((script) => script.remove());
    doc.querySelectorAll("style").forEach((style) => style.remove());
    return doc.body.innerHTML;
  };

  const handleUrlChange = async (url) => {
    if (isValidUrl(url)) {
      const id = getId(url);
      if (id) {
        const response = await fetch(`/api/video?id=${id}`);
        if (response.ok) {
          const video = await response.json();
          setData(video);
        }
      }
    }
  };

  return (
    <main className="flex screen-height screen-width">
      {data && (
        <section>
          <div
            className={`card ${nightMode ? "dark" : ""}`}
            style={{
              padding: `${padding}px`,
              borderRadius: `${borderRadius}px`,
            }}
          >
            <div className="card-thumb-container">
              <img
                src={data.thumbnail}
                alt="placeholder"
                className="card-thumb"
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
                    width: `${watchbarProgress}%`,
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
                  className="card-channel-avatar"
                  src={data.channel.thumbnail}
                  alt="channel-avatar"
                />
                <div className="card-meta-container">
                  <h2 className="card-title">{shrinkTitle(data.title)}</h2>
                  <div>
                    <span className="card-channel card-subtitle">
                      {data.channel.name}
                      {data.channel.verified && <VerifiedIcon />}
                    </span>
                    <div className="card-meta">
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
        </section>
      )}
      <article
        className="full-width flex-column gap-20"
        style={{
          maxWidth: "400px",
        }}
      >
        <Input
          placeholder="YouTube URL"
          type="url"
          onChange={(e) => {
            handleUrlChange(e.target.value);
          }}
          className="full-width"
          focusBorderColor={"#ff0000"}
        />
        <section className="properties">
          <div className="property">
            <h3>Horizontal Padding</h3>
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
              onChange={(e) => {
                setNightMode(e.target.checked);
              }}
            />
          </div>
        </section>
      </article>
    </main>
  );
}
