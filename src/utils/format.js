export function formatViews(views) {
  if (views < 1_000) {
    return views;
  } else if (views < 1_000_000) {
    return `${(views / 1_000).toFixed()} k`;
  } else {
    return `${(views / 1_000_000).toFixed()}M`;
  }
}

export function formatDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  return `${hours ? `${hours}:` : ""}${minutes}:${
    seconds < 10 ? `0${seconds}` : seconds
  }`;
}

export function formatDate(date) {
  date = new Date(date);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} jour${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    return `${hours} heure${hours > 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else {
    return `quelques secondes`;
  }
}

export function shrinkTitle(title, maxLength = 74) {
  if (title.length > maxLength) {
    return title.slice(0, maxLength).split(" ").slice(0, -1).join(" ") + "...";
  }
  return title;
}

export const numberInputFormatterAndParser = (unit) => ({
  format: (value) => `${value} ${unit}`,
  parse: (value) => value.replace(` ${unit}`, ""),
});
