import fs from "fs";

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const deleteIn15Minutes = (file) => {
  setTimeout(() => {
    fs.unlinkSync(file);
    console.log(`Deleted ${file}`);
  }, FIFTEEN_MINUTES);
};

const saveImage = async (imageUrl, filename) => {
  filename = filename.replace(/\W/g, "_");
  if (!fs.existsSync(`public/data/${filename}.jpg`)) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = `public/data/${filename}.jpg`;
    const buffer = await blob.arrayBuffer();
    fs.writeFileSync(file, Buffer.from(buffer));
    deleteIn15Minutes(file);
    return file.slice(6);
  }
  return `/data/${filename}.jpg`;
};

const getChannelData = async (channelId) => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=id%2C+snippet&id=${channelId}&key=${process.env.YOUTUBE_API_KEY}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  if (response.ok) {
    const { items } = await response.json();
    const [channel] = items;
    const { snippet } = channel;
    const thumbnail = snippet.thumbnails.default.url;
    channel.thumbnail = await saveImage(thumbnail, channel.id);
    return channel;
  }
  return null;
};

/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default async (req, res) => {
  const videoId = req.query.id;
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet%2C+contentDetails%2C+statistics&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  if (response.ok) {
    const { items } = await response.json();
    const [video] = items;
    const { snippet } = video;
    const thumbnailUrl = snippet.thumbnails.maxres.url;
    const channelId = snippet.channelId;
    const channelData = await getChannelData(channelId);
    const thumbnail = await saveImage(thumbnailUrl, video.id);
    const channelThumbnail = await saveImage(channelData.thumbnail, channelId);
    const views = Number(video.statistics.viewCount);
    const duration = video.contentDetails.duration;
    const date = new Date(video.snippet.publishedAt);
    const title = snippet.title;
    return res.status(200).json({
      title,
      thumbnail,
      channel: {
        id: channelId,
        name: channelData.snippet.title,
        thumbnail: channelThumbnail,
      },
      views,
      duration,
      uploaded: date.toISOString(),
    });
  }
  return res.status(404).json({ message: "Video not found" });
};
