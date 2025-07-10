export const stringInReadabaleFormat = (value) => {
  const parsedValue = value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return parsedValue;
};
