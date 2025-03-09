"use client"

import { useState, useEffect, useRef } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, ChevronDown } from "lucide-react"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentColor, setCurrentColor] = useState(color)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setCurrentColor(color)
  }, [color])

  const handleColorChange = (newColor: string) => {
    setCurrentColor(newColor)
    onChange(newColor)
  }

  const presetColors = [
    "#f44336", // Red
    "#e91e63", // Pink
    "#9c27b0", // Purple
    "#673ab7", // Deep Purple
    "#3f51b5", // Indigo
    "#2196f3", // Blue
    "#03a9f4", // Light Blue
    "#00bcd4", // Cyan
    "#009688", // Teal
    "#4caf50", // Green
    "#8bc34a", // Light Green
    "#cddc39", // Lime
    "#ffeb3b", // Yellow
    "#ffc107", // Amber
    "#ff9800", // Orange
    "#ff5722", // Deep Orange
    "#795548", // Brown
    "#607d8b", // Blue Grey
    "#9e9e9e", // Grey
    "#000000", // Black
  ]

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between" onClick={() => setIsOpen(true)}>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: currentColor }} />
            <span>{currentColor}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="color-picker">Color</Label>
            <div className="flex gap-2">
              <div
                className="h-9 w-9 rounded-md border cursor-pointer"
                style={{ backgroundColor: currentColor }}
                onClick={() => inputRef.current?.click()}
              />
              <Input
                ref={inputRef}
                id="color-picker"
                type="color"
                value={currentColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="sr-only"
              />
              <Input value={currentColor} onChange={(e) => handleColorChange(e.target.value)} className="flex-1" />
            </div>
          </div>

          <div>
            <Label className="text-xs">Presets</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  className="h-6 w-6 rounded-md border flex items-center justify-center"
                  style={{ backgroundColor: presetColor }}
                  onClick={() => handleColorChange(presetColor)}
                  type="button"
                >
                  {currentColor.toLowerCase() === presetColor.toLowerCase() && <Check className="h-3 w-3 text-white" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

