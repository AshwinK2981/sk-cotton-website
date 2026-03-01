# SK Cool Cotton - Simple Upload Server

This is a minimal Express server used during development to accept hero image uploads.

Install dependencies and start server:

```bash
cd server
npm install
npm run start
```

The server exposes:
- POST /api/upload-hero-image (form field `image`) - returns JSON { url: "http://host/uploads/<filename>" }

Uploaded files are saved to `server/public/uploads` and served at `/uploads/<filename>`.

Note: For production, use a proper storage solution (S3, Cloudinary, etc.).
