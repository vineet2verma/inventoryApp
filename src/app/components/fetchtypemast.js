
export const fetchTypeRecords = async () => {
  try {
    const res = await fetch("/api/typemast");
    const data = await res.json();
    const typemastlist = Array.from(new Set(data.filter((item) => item.status == "Active").map((item) => item.type)));
    return typemastlist
  } catch (err) {
    return console.error("Failed to fetch records:", err);
  }
}