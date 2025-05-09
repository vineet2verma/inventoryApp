
// fetching inv mast
export const fetchMastData = async () => {
    try {
        const res = await fetch("/api/createinvmast");
        const data = await res.json();
        return data
    } catch (err) {
        return console.error("Failed to fetch records:", err);
    }
}
