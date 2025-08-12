export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options = { day: "numeric", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-US", options); // e.g., 2 Jan 2025
};
