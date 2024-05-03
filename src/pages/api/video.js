import { youtube } from "scrape-youtube";
import fs from "fs";

const saveImage = async (imageUrl, filename) => {
  filename = filename.replace(/\W/g, "_");
  if (!fs.existsSync(`public/data/${filename}.jpg`)) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = `public/data/${filename}.jpg`;
    const buffer = await blob.arrayBuffer();
    fs.writeFileSync(file, Buffer.from(buffer));
    return file.slice(6);
  }
  return `/data/${filename}.jpg`;
};

/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default async (req, res) => {
  const videoId = req.query.id;
  console.log(videoId);
  const { videos } = await youtube.search(videoId);
  if (!videos.length) {
    return NextResponse.error("Video not found", 404);
  }
  const video = videos[0];
  const thumbnail = `https://i.ytimg.com/vi/${video.id}/hq720.jpg`;
  const channelThumbnail = video.channel.thumbnail;
  video.thumbnail = await saveImage(thumbnail, video.id);
  video.channel.thumbnail = await saveImage(channelThumbnail, video.channel.id);
  return res.status(200).json(video);
};
