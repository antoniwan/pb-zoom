# Ñ

A modern web application built with Next.js for managing and sharing professional profiles. This project uses MongoDB for data storage, NextAuth.js for authentication, and includes features for creating and managing public profile pages.

## Features

- 🔐 Secure authentication with email/password and JWT sessions
- 📝 Create and manage multiple professional profiles
- 🎨 Rich theme customization:
  - Custom color schemes with preset palettes
  - Font selection
  - Custom CSS support
  - Background and text color control
- 📊 Flexible section management:
  - Bio sections
  - Attribute lists
  - Image galleries
  - Video collections
  - Markdown content
  - Custom HTML sections
- 🔗 Social media integration with platform-specific icons
- 🌐 Public profile sharing with SEO optimization
- 📱 Responsive design with modern UI components
- 🔄 Real-time preview while editing
- 📂 Category organization for profiles
- 🎯 Multiple layout options:
  - Standard layout
  - Grid layout
  - Magazine layout
  - Custom layout support

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

# Authentication (Required)
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Optional Image Upload Service
# Configure your preferred image upload service (e.g., Cloudinary, AWS S3)
```

## Getting Started

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard and profile management
│   ├── p/                 # Public profile pages
│   └── u/                 # User profile pages
├── components/            # React components
│   ├── profile-editor/    # Profile editing components
│   └── ui/               # Reusable UI components
├── lib/                   # Utility functions and types
│   ├── auth.ts           # Authentication configuration
│   └── db.ts             # Database models and functions
└── public/               # Static assets
```

## Features in Detail

### Profile Sections
- **Bio Sections**: Rich text content for personal information
- **Attribute Lists**: Key-value pairs for skills, details, etc.
- **Image Galleries**: Support for multiple images with captions
- **Video Collections**: Embed videos with titles and descriptions
- **Markdown Support**: Write content in Markdown
- **Custom HTML**: Add custom HTML for advanced customization

### Theme Customization
- **Color Schemes**: Primary, secondary, background, and text colors
- **Font Selection**: Choose from popular web fonts
- **Custom CSS**: Add custom styles for complete control
- **Preset Palettes**: Quick theme selection with predefined color combinations

### Profile Management
- **Multiple Layouts**: Different ways to organize content
- **Category Organization**: Group profiles by purpose or type
- **Visibility Control**: Toggle between public and private
- **SEO Optimization**: Custom meta tags and OpenGraph data
- **Social Links**: Integrated social media profile links

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
