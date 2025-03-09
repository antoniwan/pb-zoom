# PB-Zoom - Profile Builder Application

A modern, feature-rich profile builder application built with Next.js 15, React 19, and TypeScript. Create, customize, and share professional profiles with ease.

## 🚀 Features

- **Authentication & Security**
  - Email/password authentication
  - Secure session management
  - (Coming soon: OAuth providers, 2FA)

- **Profile Management**
  - Multiple layout options (Standard, Grid, Magazine)
  - Theme customization with preset palettes
  - Section management (Bio, Attributes, Gallery, Videos, Markdown)
  - Real-time preview
  - Social media integration

- **Advanced Customization**
  - Custom themes and layouts
  - Rich text editing
  - Image management
  - SEO optimization

## 🛠️ Tech Stack

- **Frontend**
  - Next.js 15.1.0
  - React 19
  - TypeScript
  - Tailwind CSS
  - Radix UI Components
  - Framer Motion
  - SWR for data fetching

- **Backend**
  - MongoDB
  - NextAuth.js
  - Upstash Redis
  - Node.js

- **Development Tools**
  - ESLint
  - PostCSS
  - TypeScript

## 🚦 Getting Started

1. **Prerequisites**
   - Node.js (LTS version)
   - npm or yarn
   - MongoDB instance
   - Redis instance (optional)

2. **Installation**
   ```bash
   # Clone the repository
   git clone [repository-url]

   # Install dependencies
   npm install

   # Set up environment variables
   cp .env.example .env.local
   # Fill in your environment variables

   # Run development server
   npm run dev
   ```

3. **Environment Variables**
   Create a `.env.local` file with the following variables:
   ```
   # Required environment variables will be listed here
   DATABASE_URL=
   NEXTAUTH_SECRET=
   # ... (other variables)
   ```

## 📦 Project Structure

```
pb-zoom/
├── app/           # Next.js app directory
├── components/    # Reusable React components
├── lib/          # Utility functions and configurations
├── hooks/        # Custom React hooks
├── public/       # Static assets
├── styles/       # Global styles
├── types/        # TypeScript type definitions
└── scripts/      # Build and utility scripts
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

The application is designed to be deployed on Vercel or similar platforms:

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy!

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support, email [support-email] or open an issue in the repository.

