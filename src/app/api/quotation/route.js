import { NextResponse } from 'next/server'

import connectToDatabase from '@/app/api/models/connectDB'
import quotationOrder from '@/app/api/models/quotationOrder'
import moment from 'moment'

// GET all quotations
export async function GET () {
  await connectToDatabase()
  try {
    const quotations = await quotationOrder.find().sort({createdAt: -1})
    return NextResponse.json({ success: true, data: quotations })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
// CREATE new quotation
export async function POST (req) {
  await connectToDatabase()

  // let lastDoc = await quotationOrder.findOne(  {} )  //  countDocuments({}) // await quotationOrder.findOne({}).sort({ _id: -1 }).lean()
  let lastDoc = await quotationOrder
    .findOne({})
    .sort({ createdAt: -1, _id: -1 })
    .lean()

  console.log('last Doc => ', lastDoc)

  let lastId =  17 // lastDoc?._id

  console.log('last id => ', lastId)

  // console.log('lastDoc', lastDoc)
  const currentPrefix = moment().format('YYMMDD') // "202505"

  try {
    const body = await req.json()
    const newId = (parseInt(lastId) + 1).toString() // Generate new ID with prefix and incremented number
    body._id = newId
    body.orderId = newId

    const quotation = await quotationOrder.create(body) // save
    return NextResponse.json(
      { success: true, data: quotation },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

// UPDATE a quotation by orderId
export async function PUT (req) {
  await connectToDatabase()
  try {
    const body = await req.json()

    const { orderId } = body
    if (!orderId)
      return NextResponse.json(
        { success: false, error: 'orderId is required' },
        { status: 400 }
      )

    const updated = await quotationOrder.findByIdAndUpdate(body._id, body, {
      new: true
    })

    if (!updated)
      return NextResponse.json(
        { success: false, error: 'Quotation not found' },
        { status: 404 }
      )

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
// DELETE a quotation by orderId
export async function DELETE (req) {
  await connectToDatabase()
  try {
    const body = await req.json()

    console.log('body', body)

    // const { orderId } = body
    const { _id } = body
    if (!_id)
      return NextResponse.json(
        { success: false, error: 'Id is required' },
        { status: 400 }
      )

    const deleted = await quotationOrder.findByIdAndDelete({ _id })
    if (!deleted)
      return NextResponse.json(
        { success: false, error: 'Quotation not found' },
        { status: 404 }
      )

    return NextResponse.json({ success: true, message: 'Quotation deleted' })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
