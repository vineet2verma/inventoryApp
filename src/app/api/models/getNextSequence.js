import Counter from "@/app/api/models/counter.js";

export async function getNextSequence(dateStr) {
  const counter = await Counter.findByIdAndUpdate(
    dateStr,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}
