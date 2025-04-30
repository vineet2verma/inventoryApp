import formidable from "formidable";

export function parseFormData(req) {
    return new Promise((resolve, reject) => {
        const form = formidable({ multiples: false, keepExtensions: true });
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });
}

// Next.js Edge functions don't support formidable, so use "dynamic = force-static"
export const config = {
    api: {
        bodyParser: false,
    },
};
