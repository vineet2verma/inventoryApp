
import { NextResponse } from "next/server";
import connectToDatabase from "@/app/api/models/connectDB";
import TileMaster from "@/app/api/models/tileMast";
// import { uploadImageToDrive } from "../../lib/googledrive"; // Adjust the import path as necessary
// import { parseFormData } from "@/utils/parseFormData";
// import formidable from "formidable";
// import fs from "fs-extra";

// GET all type records
export async function GET() {
    try {
        await connectToDatabase();
        const tile = await TileMaster.find().sort({ createdAt: -1 }); // newest first
        return NextResponse.json(tile, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to fetch records" }, { status: 500 });
    }
}

// POST create tile and upload image
export async function POST(req) {
    try {
        const formData = await req.formData();
        const tile = formData.get("tile");
        const createdBy = formData.get("createdBy");
        const status = formData.get("status") || "Active";
        // const file = formData.get("image");

        // if (!file || typeof file === "string") {
        //     return NextResponse.json({ message: "No image file uploaded" }, { status: 400 });
        // }

        // Save file temporarily
        // const buffer = Buffer.from(await file.arrayBuffer());
        // const tempDir = os.tmpdir();
        // const filePath = path.join(tempDir, `${Date.now()}-${file.name}`);
        // await fs.writeFile(filePath, buffer);

        // const folderId = "1thS61_ycCnjWj-pPSbqgqAstjg-5Ilou"; // 🔁 Replace this
        // const driveFile = await uploadImageToDrive(filePath, folderId);

        const newTile = new TileMaster({
            tile,
            // image: driveFile.webViewLink,
            createdBy,
            status,
        });

        await newTile.save();
        // await fs.remove(filePath);

        return NextResponse.json({ message: "Tile created successfully", data: newTile }, { status: 200 });
    } catch (err) {
        console.error("POST error:", err);
        return NextResponse.json({ message: "Failed to create tile" }, { status: 500 });
    }
}

export const config = {
    api: {
        bodyParser: false, // required to access formData
    },
};

// PUT update a type record
export async function PUT(req) {
    try {
        const { id, tile, image, createdBy, status } = await req.json();
        await connectToDatabase();

        const updated = await TileMaster.findByIdAndUpdate(
            id,
            { tile, createdBy, status, image },
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
        const { id } = await req.json();
        await connectToDatabase();

        const deleted = await TileMaster.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ message: "Record not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Type deleted successfully" }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to delete type" }, { status: 500 });
    }
}
