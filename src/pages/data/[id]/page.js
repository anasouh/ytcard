import { NextResponse } from "next/server";
import { youtube } from "scrape-youtube";

async function DataPage({ params }) {
  const { id: videoId } = params;

  const { videos } = await youtube.search(videoId);
  if (!videos.length) {
    return NextResponse.error("Video not found", 404);
  }
  return JSON.stringify(videos[0]);
}

export default DataPage;
