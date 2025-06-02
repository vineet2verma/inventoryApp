import { NextResponse } from 'next/server'
import connectToDatabase from '@/app/api/models/connectDB'
import morbiorder from '@/app/api/models/morbiDB'

// GET All Orders
export async function GET () {
  try {
    await connectToDatabase()
    const records = await morbiorder.find().sort({ createdAt: -1 }) // Newest first
    return NextResponse.json(records, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: 'Failed to fetch records' },
      { status: 500 }
    )
  }
}

// CREATE New Order
export async function POST (req) {
  try {
    await connectToDatabase()
    const data = await req.json()
    const newRecord = new morbiorder(data)
    await newRecord.save()
    return NextResponse.json(
      { message: 'morbi Order record created successfully', success: true },
      { status: 200 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: 'Failed to create record' },
      { status: 500 }
    )
  }
}

// UPDATE Order
export async function PUT (req) {
  const { _id, ...updatedData } = await req.json()

  try {
    await connectToDatabase()
    const updated = await morbiorder.findByIdAndUpdate(_id, updatedData, {
      new: true
    })
    // console.log(_id, "Data   =>  ", updated);
    if (!updated) {
      return NextResponse.json({ message: 'Record not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'morbi record updated successfully', success: true },
      { status: 200 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: 'Failed to update record' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a stock in record
export async function DELETE (req) {
  try {
    const { id } = await req.json()

    console.log('Deleting record with ID:', id)
    await connectToDatabase()

    const deleted = await morbiorder.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ message: 'Record not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'Record deleted successfully', success: true },
      { status: 200 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: 'Failed to delete record' },
      { status: 500 }
    )
  }
}
