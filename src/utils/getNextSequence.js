// import Counter from "@/models/counter";
import Counter from "@/utils/counter";
/**
 * Get the next sequential number for a collection.
 * @param {string} name - Name of the counter (e.g., "quotationOrder")
 * @returns {Promise<number>} - The next sequence number
 */
export default async function getNextSequence(dateStr) {
  const counter = await Counter.findByIdAndUpdate(
    dateStr,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}
