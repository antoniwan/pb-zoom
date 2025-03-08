# PB Zoom

A modern web application built with Next.js for managing and sharing professional profiles. This project uses MongoDB for data storage, NextAuth.js for authentication, and includes features for creating and managing public profile pages.

## Features

- 🔐 User authentication with multiple providers (GitHub, Google, and email/password)
- 📝 Create and manage multiple professional profiles
- 🎨 Customizable profile themes and layouts
- 🌐 Public profile sharing
- 📱 Responsive design with modern UI components
- 🔄 Real-time preview and editing

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm, yarn, or pnpm
- MongoDB instance (local or Atlas)

## Environment Setup

1. Clone the repository
2. Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB (Required)
MONGODB_URI=your_mongodb_connection_string
# Specify your database name in the connection string, e.g.: mongodb://localhost:27017/your_database_name

# Authentication Providers (Required)
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# GitHub OAuth (Optional - for GitHub authentication)
GITHUB_ID=your_github_oauth_client_id
GITHUB_SECRET=your_github_oauth_client_secret

# Google OAuth (Optional - for Google authentication)
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

## Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Run the development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `/app` - Next.js 13+ app directory containing routes and layouts
- `/components` - Reusable React components
- `/lib` - Utility functions, database connections, and models
- `/types` - TypeScript type definitions
- `/public` - Static assets

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## Tech Stack

- **Framework**: Next.js 15.1
- **Language**: TypeScript
- **Auth**: NextAuth.js
- **Database**: MongoDB
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
