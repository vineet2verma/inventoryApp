// // lib/googledrive.js
// import { google } from "googleapis";
// import fs from "fs";

// const auth = new google.auth.GoogleAuth({
//     credentials: {
//         client_email: process.env.GOOGLE_CLIENT_EMAIL,
//         private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//     },
//     scopes: ["https://www.googleapis.com/auth/drive"],
// });

// const drive = google.drive({ version: "v3", auth });

// export async function uploadImageToDrive(filePath, folderId) {
//     const fileMetadata = {
//         name: `tile-${Date.now()}`,
//         parents: [folderId],
//     };

//     const media = {
//         mimeType: "image/jpeg",
//         body: fs.createReadStream(filePath),
//     };

//     const file = await drive.files.create({
//         requestBody: fileMetadata,
//         media,
//         fields: "id, webViewLink, webContentLink",
//     });

//     await drive.permissions.create({
//         fileId: file.data.id,
//         requestBody: { role: "reader", type: "anyone" },
//     });

//     return {
//         id: file.data.id,
//         webViewLink: file.data.webViewLink,
//         webContentLink: file.data.webContentLink,
//     };
// }
