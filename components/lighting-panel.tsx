"use client"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Sun, Lightbulb, Zap } from "lucide-react"

export default function LightingPanel() {
  return (
    <div className="space-y-4">
      {/* Lighting Model */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Shading Model</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch id="phong" defaultChecked />
            <Label htmlFor="phong" className="text-sm">
              Phong Shading
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="gouraud" />
            <Label htmlFor="gouraud" className="text-sm">
              Gouraud Shading
            </Label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Ambient Light */}
      <div>
        <Label className="text-sm font-medium mb-2 flex items-center">
          <Sun className="w-4 h-4 mr-1" />
          Ambient Light
        </Label>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-slate-600">Intensity</Label>
            <span className="text-xs text-slate-500">0.3</span>
          </div>
          <Slider defaultValue={[30]} max={100} step={1} className="w-full" />
        </div>
      </div>

      <Separator />

      {/* Directional Light */}
      <div>
        <Label className="text-sm font-medium mb-2 flex items-center">
          <Lightbulb className="w-4 h-4 mr-1" />
          Directional Light
        </Label>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-slate-600">Intensity</Label>
            <span className="text-xs text-slate-500">1.0</span>
          </div>
          <Slider defaultValue={[100]} max={200} step={1} className="w-full" />

          <div className="grid grid-cols-3 gap-2 mt-2">
            <div>
              <Label className="text-xs text-slate-600">X</Label>
              <div className="text-xs text-slate-500">10</div>
            </div>
            <div>
              <Label className="text-xs text-slate-600">Y</Label>
              <div className="text-xs text-slate-500">10</div>
            </div>
            <div>
              <Label className="text-xs text-slate-600">Z</Label>
              <div className="text-xs text-slate-500">5</div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Point Light */}
      <div>
        <Label className="text-sm font-medium mb-2 flex items-center">
          <Zap className="w-4 h-4 mr-1" />
          Point Light
        </Label>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-slate-600">Intensity</Label>
            <span className="text-xs text-slate-500">0.5</span>
          </div>
          <Slider defaultValue={[50]} max={200} step={1} className="w-full" />

          <div className="grid grid-cols-3 gap-2 mt-2">
            <div>
              <Label className="text-xs text-slate-600">X</Label>
              <div className="text-xs text-slate-500">-10</div>
            </div>
            <div>
              <Label className="text-xs text-slate-600">Y</Label>
              <div className="text-xs text-slate-500">-10</div>
            </div>
            <div>
              <Label className="text-xs text-slate-600">Z</Label>
              <div className="text-xs text-slate-500">-5</div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Material Properties */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Material Properties</Label>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-slate-600">Shininess</Label>
            <span className="text-xs text-slate-500">32</span>
          </div>
          <Slider defaultValue={[32]} max={128} step={1} className="w-full" />
        </div>
      </div>
    </div>
  )
}
