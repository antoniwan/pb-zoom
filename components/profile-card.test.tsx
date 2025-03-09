import { render, screen } from '@/lib/test-utils'
import { ProfileCard } from './profile-card'

// Define types for mocked components
type NextImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

type NextLinkProps = {
  href: string;
  children: React.ReactNode;
}

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: NextImageProps) => (
    <img src={src} alt={alt} width={width} height={height} className={className} />
  ),
}))

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: NextLinkProps) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Eye: () => <span>Eye Icon</span>,
  EyeOff: () => <span>EyeOff Icon</span>,
  Pencil: () => <span>Pencil Icon</span>,
  Trash2: () => <span>Trash2 Icon</span>,
}))

// Mock clsx
jest.mock('clsx', () => ({
  __esModule: true,
  clsx: (...classes: string[]) => classes.join(' '),
}))

// Mock tailwind-merge
jest.mock('tailwind-merge', () => ({
  __esModule: true,
  twMerge: (...classes: string[]) => classes.join(' '),
}))

describe('ProfileCard', () => {
  const mockProfile = {
    _id: '123',
    userId: 'user123',
    title: 'Test Profile',
    slug: 'test-profile',
    header: {
      name: 'John Doe',
      title: 'Test Title',
      subtitle: 'Test Subtitle',
      shortBio: 'A short bio',
      pictures: [
        {
          url: 'https://example.com/image.jpg',
          altText: 'Test image',
          isPrimary: true,
        },
      ],
    },
    theme: {
      primaryColor: '#1d4ed8',
      secondaryColor: '#67e8f9',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      fontFamily: 'Inter',
    },
    layout: 'standard',
    sections: [],
    socialLinks: [],
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockProfileWithoutPicture = {
    _id: '123',
    userId: 'user123',
    title: 'Test Profile',
    slug: 'test-profile',
    header: {
      name: 'John Doe',
      title: 'Test Title',
      subtitle: 'Test Subtitle',
      shortBio: 'A short bio',
      pictures: [],
    },
    theme: {
      primaryColor: '#1d4ed8',
      secondaryColor: '#67e8f9',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      fontFamily: 'Inter',
    },
    layout: 'standard',
    sections: [],
    socialLinks: [],
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('renders profile information correctly', () => {
    render(
      <ProfileCard
        profile={mockProfile}
        onDelete={() => {}}
        onToggleVisibility={() => {}}
      />
    )

    expect(screen.getByText('Test Profile')).toBeInTheDocument()
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByAltText('Test image')).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('renders placeholder image when primaryPicture is not provided', () => {
    render(
      <ProfileCard
        profile={mockProfileWithoutPicture}
        onDelete={() => {}}
        onToggleVisibility={() => {}}
      />
    )

    expect(screen.getByAltText('Profile picture')).toHaveAttribute('src', '/placeholder.svg')
  })

  it('calls onDelete when delete button is clicked', () => {
    const handleDelete = jest.fn()
    render(
      <ProfileCard
        profile={mockProfile}
        onDelete={handleDelete}
        onToggleVisibility={() => {}}
      />
    )

    screen.getByText('Trash2 Icon').click()
    expect(handleDelete).toHaveBeenCalledWith(mockProfile._id)
  })

  it('calls onToggleVisibility when visibility button is clicked', () => {
    const handleToggleVisibility = jest.fn()
    render(
      <ProfileCard
        profile={mockProfile}
        onDelete={() => {}}
        onToggleVisibility={handleToggleVisibility}
      />
    )

    screen.getByText('Eye Icon').click()
    expect(handleToggleVisibility).toHaveBeenCalledWith(mockProfile._id, true)
  })

  it('displays correct visibility badge for public profile', () => {
    render(
      <ProfileCard
        profile={mockProfile}
        onDelete={() => {}}
        onToggleVisibility={() => {}}
      />
    )

    expect(screen.getByText('Public')).toBeInTheDocument()
  })

  it('displays correct visibility badge for private profile', () => {
    render(
      <ProfileCard
        profile={{ ...mockProfile, isPublic: false }}
        onDelete={() => {}}
        onToggleVisibility={() => {}}
      />
    )

    expect(screen.getByText('Private')).toBeInTheDocument()
    expect(screen.getByText('EyeOff Icon')).toBeInTheDocument()
  })
}) 