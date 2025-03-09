"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Image, Upload, X } from "lucide-react"

interface ImageUploaderProps {
  value?: string
  onChange: (value: string) => void
  aspectRatio?: "square" | "wide"
  maxSize?: number
  description?: string
  className?: string
}

export function ImageUploader({
  value,
  onChange,
  aspectRatio = "square",
  maxSize = 2,
  description,
  className,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setIsUploading(true)
        const file = acceptedFiles[0]
        
        // Create FormData
        const formData = new FormData()
        formData.append("file", file)
        
        // Upload to your API
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        
        if (!response.ok) {
          throw new Error("Upload failed")
        }
        
        const data = await response.json()
        onChange(data.url)
      } catch (error) {
        console.error("Upload error:", error)
      } finally {
        setIsUploading(false)
      }
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxSize: maxSize * 1024 * 1024,
    multiple: false,
  })

  return (
    <div className={cn("space-y-2", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-colors",
          "hover:bg-muted/50 cursor-pointer",
          aspectRatio === "square" ? "aspect-square" : "aspect-video",
          isDragActive && "border-primary bg-muted/50",
          value && "border-none"
        )}
      >
        <input {...getInputProps()} />
        
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Uploaded image"
              className="w-full h-full object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation()
                onChange("")
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
            {isUploading ? (
              <LoadingSpinner className="w-8 h-8" />
            ) : (
              <>
                <div className="p-4 rounded-full bg-muted">
                  {isDragActive ? (
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  ) : (
                    <Image className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">
                    {isDragActive ? "Drop the image here" : "Click or drag image to upload"}
                  </p>
                  {description && (
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 