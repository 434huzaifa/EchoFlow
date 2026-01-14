export function extractErrorMessage(error) {
  if (!error) return null;
  return error?.data?.message || error?.message || "An error occurred";
}
