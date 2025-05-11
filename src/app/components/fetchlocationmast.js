
// fetch location mast 
export const fetchlocationRecords = async () => {
  try {
    const res = await fetch("api/location");
    const data = await res.json();
    const locationlist = Array.from(new Set(data.filter((item) => item.status == "Active").map((item) => item.location)));
    return locationlist
  } catch (err) {
    return console.error("Failed to fetch records:", err);
  }
};