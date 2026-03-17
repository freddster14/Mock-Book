# Installation

## Prerequisites
- Node.js
- PostgreSQL running locally
- Git
- Cloudinary Account

Clone this repository in your desired location
```bash
  git clone https://github.com/freddster14/Mock-Book
```

Open up the app location
```bash
  cd Mock-Book
```

Configure environment variables:
- Copy server variables from `.env.example` to `server/.env`
- Copy your Cloudinary info into the server env, else change the API endpoints and multer to use local folder for storage.

See `.env.example` at the project root for required values.

Now in the terminal build Shared-Types
```bash
  cd shared-types
  npm run build
  cd .. # Go to root porject
```

In the terminal configure the backend
```bash
  cd Mock-App  # If starting fresh terminal
  cd server
  npm install
```

Run Prisma database migrations
```bash
  npx prisma migrate dev
```

Generate Prisma Client
```bash
  npx prisma generate
```

Start the backend
```bash 
    node index.js
```

In another terminal (from the project root):
```bash
  cd Message-App  # If starting fresh terminal
  cd client
  npm install
  npm run dev
```
The app should now be running:
- Backend: http://localhost:3000
- Frontend: http://localhost:5173

Visit http://localhost:5173 in your browser.