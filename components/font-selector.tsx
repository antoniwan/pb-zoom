"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FontSelectorProps {
  value: string
  onChange: (value: string) => void
}

const fonts = [
  { name: "Inter", value: "inter" },
  { name: "Roboto", value: "roboto" },
  { name: "Open Sans", value: "open-sans" },
  { name: "Lato", value: "lato" },
  { name: "Montserrat", value: "montserrat" },
  { name: "Poppins", value: "poppins" },
  { name: "Source Sans Pro", value: "source-sans-pro" },
  { name: "Raleway", value: "raleway" },
  { name: "Playfair Display", value: "playfair-display" },
  { name: "Merriweather", value: "merriweather" },
]

export function FontSelector({ value, onChange }: FontSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a font" />
      </SelectTrigger>
      <SelectContent>
        {fonts.map((font) => (
          <SelectItem key={font.value} value={font.value} className={`font-${font.value}`}>
            {font.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

