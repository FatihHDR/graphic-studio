"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Dot, Minus, Square, Circle } from "lucide-react"

interface ToolPanel2DProps {
  selectedTool: string
  onToolChange: (tool: string) => void
  selectedColor: string
  onColorChange: (color: string) => void
  lineThickness: number
  onThicknessChange: (thickness: number) => void
}

const colors = ["#000000", "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#6b7280"]

export default function ToolPanel2D({
  selectedTool,
  onToolChange,
  selectedColor,
  onColorChange,
  lineThickness,
  onThicknessChange,
}: ToolPanel2DProps) {
  return (
    <div className="space-y-4">
      {/* Drawing Tools */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Drawing Tools</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={selectedTool === "point" ? "default" : "outline"}
            size="sm"
            onClick={() => onToolChange("point")}
            className="flex items-center justify-center"
          >
            <Dot className="w-4 h-4 mr-1" />
            Point
          </Button>
          <Button
            variant={selectedTool === "line" ? "default" : "outline"}
            size="sm"
            onClick={() => onToolChange("line")}
            className="flex items-center justify-center"
          >
            <Minus className="w-4 h-4 mr-1" />
            Line
          </Button>
          <Button
            variant={selectedTool === "rectangle" ? "default" : "outline"}
            size="sm"
            onClick={() => onToolChange("rectangle")}
            className="flex items-center justify-center"
          >
            <Square className="w-4 h-4 mr-1" />
            Rectangle
          </Button>
          <Button
            variant={selectedTool === "ellipse" ? "default" : "outline"}
            size="sm"
            onClick={() => onToolChange("ellipse")}
            className="flex items-center justify-center"
          >
            <Circle className="w-4 h-4 mr-1" />
            Ellipse
          </Button>
        </div>
      </div>

      <Separator />

      {/* Color Palette */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Colors</Label>
        <div className="grid grid-cols-4 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded border-2 ${
                selectedColor === color ? "border-slate-400" : "border-slate-200"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onColorChange(color)}
            />
          ))}
        </div>
        <div className="mt-2">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-full h-8 rounded border border-slate-200"
          />
        </div>
      </div>

      <Separator />

      {/* Line Thickness */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Line Thickness: {lineThickness}px</Label>
        <Slider
          value={[lineThickness]}
          onValueChange={(value) => onThicknessChange(value[0])}
          max={10}
          min={1}
          step={1}
          className="w-full"
        />
      </div>

      <Separator />

      {/* Keyboard Shortcuts */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Shortcuts</Label>
        <div className="text-xs text-slate-600 space-y-1">
          <div>P - Point tool</div>
          <div>L - Line tool</div>
          <div>R - Rectangle tool</div>
          <div>E - Ellipse tool</div>
        </div>
      </div>
    </div>
  )
}
