
import { NextResponse } from "next/server";
import connectToDatabase from "@/app/api/models/connectDB";
import PaymentMast from "@/app/api/models/paymentTypeDB";

// GET all type records
export async function GET() {
    try {
        await connectToDatabase();
        const payment = await PaymentMast.find().sort({ createdAt: -1 }); // newest first
        return NextResponse.json(payment, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to fetch records" }, { status: 500 });
    }
}

// POST create a new type record
export async function POST(req) {
    console.log("POST request received");
    console.log("Request body:", req.body);
    try {
        const data = await req.json();
        console.log("Data received:", data);
        await connectToDatabase();

        const newPayment = new PaymentMast({
            payment: data.payment,
            createdBy: data.createdBy,
            status: data.status || "Active",
        });
        console.log("New payment object:", newPayment);

        await newPayment.save();
        return NextResponse.json({ message: "Payment created successfully" }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to create payment type" }, { status: 500 });
    }
}

// PUT update a type record
export async function PUT(req) {
    try {
        const { id, payment, createdBy, status } = await req.json();
        await connectToDatabase();

        const updated = await PaymentMast.findByIdAndUpdate(
            id,
            { payment, createdBy, status },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ message: "Record not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Type updated successfully" }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to update type" }, { status: 500 });
    }
}

// DELETE a type record by ID
export async function DELETE(req) {
    try {
        console.log("-----------", req)
        const { id } = await req.json();
        await connectToDatabase();

        const deleted = await PaymentMast.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ message: "Record not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Type deleted successfully" }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to delete type" }, { status: 500 });
    }
}
