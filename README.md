# Ñ

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

