import { youtube } from "scrape-youtube";

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
  video.thumbnail = `https://i.ytimg.com/vi/${video.id}/hq720.jpg`;
  return res.status(200).json(video);
};
