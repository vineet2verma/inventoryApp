import { NextResponse } from 'next/server'
import connectToDatabase from '@/app/api/models/connectDB'
import quotationOrder from '@/app/api/models/quotationOrder'

export async function GET (req) {
  let params = req.nextUrl.searchParams

  const orderId = params.get('orderId')
  console.log('orderId', orderId)
  if (!orderId) {
    return NextResponse.json(
      { success: false, error: 'orderId is required' },
      { status: 400 }
    )
  }

  await connectToDatabase()
  try {
    const quotation = await quotationOrder.findOne({ _id: orderId })
    if (!quotation) {
      return NextResponse.json(
        { success: false, error: 'Quotation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: quotation })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
