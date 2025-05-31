import Counter from "@/models/counter";

/**
 * Get the next sequential number for a collection.
 * @param {string} name - Name of the counter (e.g., "quotationOrder")
 * @returns {Promise<number>} - The next sequence number
 */
export default async function getNextSequence(name) {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}
