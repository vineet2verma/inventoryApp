import { NextResponse } from 'next/server'

import connectToDatabase from '@/app/api/models/connectDB'
import quotationOrder from '@/app/api/models/quotationOrder'


// By Page No
// GET all inventory records
export async function GET (req) {
  const param = await req.nextUrl.searchParams

  //   console.log('param => ', param)
  //   console.log('param page', param.get('page'))
  //   console.log('param limit', param.get('limit'))

  const page = param.get('page')
  const limit = param.get('limit')
  const skip = (page - 1) * limit
  try {
    await connectToDatabase()
    // Get total count of records
    const totalCount = await quotationOrder.countDocuments()

    const records = await quotationOrder
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    return NextResponse.json(
      {
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        records
      },
      { status: 200 }
    )
    console.log('Fetched records:', records) // Log the fetched records
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: 'Failed to fetch records' },
      { status: 500 }
    )
  }
}
