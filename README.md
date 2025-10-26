Match Me ❤️

A modern, fast, and engaging dating application built with the power of Next.js 15. This platform connects people through a seamless and intuitive user experience.

✨ Features

🔐 Secure Authentication: Easy and secure sign-up/login with providers like Google, GitHub, or email (using NextAuth.js).

👤 Custom User Profiles: Users can create, edit, and upload photos to their public profiles.

❤️ Matching: Users can like profiles and see profiles that likes back.

💬 Real-time Chat: Instantly connect and chat with your matches in real-time using Pusher.

📱 Fully Responsive: A beautiful, mobile-first design that works perfectly on all devices.

⚡ Blazing Fast: Built with the Next.js 15 App Router for a near-instant user experience.


🛠️ Tech Stack

This project uses a modern, performant, and scalable tech stack:

Framework: Next.js 15 (App Router)

Styling: Tailwind CSS

UI Components: shadcn/ui

Database: PostgreSQL

ORM: Prisma

Authentication: NextAuth.js

Real-time: Pusher

Deployment: Vercel


🚀 Getting Started

Follow these instructions to get a local copy up and running for development and testing.

Prerequisites

You must have the following installed on your local machine:

Node.js (v18.17 or later recommended)

npm, yarn, pnpm, or bun

A running instance of your chosen database (e.g., PostgreSQL).

Installation & Setup

Clone the repository:

git clone https://github.com/mjdc/match-me.git
cd match-me


Install dependencies:

npm install
# or
yarn install
# or
pnpm install
# or
bun install


Set up environment variables:

Create a .env.local file in the root of your project by copying the example file:

cp .env.example .env.local


Now, open .env.local and fill in the necessary values


Sync the database schema:

If you are using Prisma, run this command to apply your schema to the database:

npx prisma db push


(Or npx prisma migrate dev if you are managing migrations)

Run the development server:

npm run dev


Open the app:
Open http://localhost:3000 with your browser to see the result!

🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📜 License

This project is licensed under the MIT License. See the LICENSE file for more details.

🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.

Check out our Next.js deployment documentation for more details.