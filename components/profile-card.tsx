import type React from "react"

interface ProfileCardProps {
  name: string
  title: string
  imageUrl: string
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, title, imageUrl }) => {
  return (
    <div className="bg-white rounded-md shadow-md p-4">
      <div className="flex flex-col xs:flex-row gap-3 mb-4">
        <div className="w-14 h-14 xs:w-16 xs:h-16 rounded-md overflow-hidden flex-shrink-0 border mx-auto xs:mx-0">
          <img src={imageUrl || "/placeholder.svg"} alt={name} className="object-cover w-full h-full" />
        </div>
        <div className="flex-1 min-w-0 text-center xs:text-left mt-2 xs:mt-0">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{name}</h3>
          <p className="text-sm text-gray-500 truncate">{title}</p>
        </div>
      </div>
      {/* You can add more details or actions here if needed */}
    </div>
  )
}

export default ProfileCard

