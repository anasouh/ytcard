export function formatViews(views) {
  if (views < 1_000) {
    return views;
  } else if (views < 1_000_000) {
    return `${(views / 1_000).toFixed()} k`;
  } else {
    return `${(views / 1_000_000).toFixed()}M`;
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
