import { NextResponse } from 'next/server'
import connectToDatabase from '@/app/api/models/connectDB'
import createInvMaster from '@/app/api/models/createInvMast'

// GET all inventory records
export async function GET (req) {
  const param = await req.nextUrl.searchParams
  const page = param.get('page')
  const limit = 10
  const skip = (page - 1) * limit

  try {
    await connectToDatabase()
    const records = await createInvMaster
      .find({
        $expr: { $lte: ['$closingstock', '$minqty'] }
      })
      .skip(skip)
      .limit(limit)
    return NextResponse.json(records, { status: 200 })
    console.log('Fetched records:', records) // Log the fetched records
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: 'Failed to fetch records' },
      { status: 500 }
    )
  }
}
