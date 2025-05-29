// lib/getNextSequence.js
import Counter from '@/models/Counter'

export async function getNextSequence (sequenceName) {
  const result = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true } // Create if not exists
  )

  return result.sequence_value
}
