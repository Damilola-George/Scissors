## Scissors - URL Shortener
Scissor is a URL shortening service that allows users to create shortened links, customize URLs, and generate QR codes. It also provides basic analytics

# Features
URL Shortening: Shorten long URLs into easy-to-share links.
Custom URLs: Create custom, branded short URLs.
QR Code Generation: Generate QR codes for shortened URLs.
Analytics: Track clicks and view performance analytics for your shortened URLs.
Link History: View the history of all the links you've created.

# Technologies Used
Frontend: HTML, CSS, and Javasct.rip
Backend: Node.js, TypeScript, Express, MongoDb, Node-Cache
Deployment: Vercel, Render

# Usage
Web Interface
Visit the deployed application at :
https://scissors-frontend.vercel.app
https://scissors-5.onrender.com


# Installation
Prerequisites
Node.js
npm or yarn
MongoDB (locally or via a cloud provider like MongoDB Atlas)

# Setup
1. Clone the repository
   git clone https://github.com/Damilola-George/Scissors.git

# 2. Navigate into the repository:
cd Server-app
cd frontend

# 3. Install dependencies for backend:
cd server-app && npm install

# 4. Create a .env file in the server-app directory and add your environment variables:
PORT= 5000
CONNECTION_STRING= ""

# 5. Start the development servers:
 Backend Server
npm run start

# 6. Testing
To run the tests, use the following command:

npm test


## API Endpoints: Base Url: http://localhost:5000/api/
Here are the primary API endpoints:

POST /api/shorten

Shorten a URL or create a custom short URL.
Request Body:
{
  "originalUrl": "https://example.com",
  "customUrl": "mycustomalias"
}
Response:
{
  "shortUrl": "http://localhost:5000/mycustomalias",
  "customUrl": "mycustomalias"
}
GET /api/:shortUrl

Redirects to the original URL.
Response: Redirects to the original URL.
GET /api/qr/:shortUrl

Generate a QR code for a shortened URL.
Response:
{
  "qrCode": "<base64-encoded-qr-code>"
}
GET /api/history

Retrieve the history of all shortened URLs.
Response:
[
  {
    "_id": "unique-id",
    "originalUrl": "https://example.com",
    "shortUrl": "mycustomalias",
    "clicks": 10,
    "createdAt": "2024-08-01T10:12:34.567Z"
  }
]

