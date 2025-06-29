"use client"
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Sun, Lightbulb, Zap } from "lucide-react"
import { toast } from "sonner"

interface LightingSettings {
  shadingModel: 'phong' | 'gouraud'
  ambientIntensity: number
  directionalIntensity: number
  directionalPosition: { x: number; y: number; z: number }
  pointIntensity: number
  pointPosition: { x: number; y: number; z: number }
  shininess: number
}

export default function LightingPanel() {
  const [settings, setSettings] = useState<LightingSettings>({
    shadingModel: 'phong',
    ambientIntensity: 0.3,
    directionalIntensity: 1.0,
    directionalPosition: { x: 10, y: 10, z: 5 },
    pointIntensity: 0.5,
    pointPosition: { x: -10, y: -10, z: -5 },
    shininess: 32
  })

  // Update global lighting settings when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).lightingSettings = settings
      // Trigger update in canvas if available
      if ((window as any).updateLighting) {
        (window as any).updateLighting(settings)
      }
    }
  }, [settings])

  const updateSetting = (key: keyof LightingSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    toast.success(`${key} updated`)
  }
  return (
    <div className="space-y-4">
      {/* Lighting Model */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Shading Model</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch 
              id="phong" 
              checked={settings.shadingModel === 'phong'}
              onCheckedChange={(checked) => {
                if (checked) updateSetting('shadingModel', 'phong')
              }}
            />
            <Label htmlFor="phong" className="text-sm">
              Phong Shading
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="gouraud" 
              checked={settings.shadingModel === 'gouraud'}
              onCheckedChange={(checked) => {
                if (checked) updateSetting('shadingModel', 'gouraud')
              }}
            />
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
            <Label className="text-xs text-slate-600 dark:text-slate-400">Intensity</Label>
            <span className="text-xs text-slate-500 dark:text-slate-400">{settings.ambientIntensity}</span>
          </div>
          <Slider 
            value={[settings.ambientIntensity * 100]} 
            max={100} 
            step={1} 
            className="w-full"
            onValueChange={(value) => updateSetting('ambientIntensity', value[0] / 100)}
          />
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
            <Label className="text-xs text-slate-600 dark:text-slate-400">Intensity</Label>
            <span className="text-xs text-slate-500 dark:text-slate-400">{settings.directionalIntensity}</span>
          </div>
          <Slider 
            value={[settings.directionalIntensity * 100]} 
            max={200} 
            step={1} 
            className="w-full"
            onValueChange={(value) => updateSetting('directionalIntensity', value[0] / 100)}
          />

          <div className="grid grid-cols-3 gap-2 mt-2">
            <div>
              <Label className="text-xs text-slate-600 dark:text-slate-400">X</Label>
              <Slider 
                value={[settings.directionalPosition.x]} 
                min={-20} 
                max={20} 
                step={1}
                className="w-full"
                onValueChange={(value) => updateSetting('directionalPosition', 
                  { ...settings.directionalPosition, x: value[0] })}
              />
              <div className="text-xs text-slate-500 dark:text-slate-400 text-center">{settings.directionalPosition.x}</div>
            </div>
            <div>
              <Label className="text-xs text-slate-600 dark:text-slate-400">Y</Label>
              <Slider 
                value={[settings.directionalPosition.y]} 
                min={-20} 
                max={20} 
                step={1}
                className="w-full"
                onValueChange={(value) => updateSetting('directionalPosition', 
                  { ...settings.directionalPosition, y: value[0] })}
              />
              <div className="text-xs text-slate-500 dark:text-slate-400 text-center">{settings.directionalPosition.y}</div>
            </div>
            <div>
              <Label className="text-xs text-slate-600 dark:text-slate-400">Z</Label>
              <Slider 
                value={[settings.directionalPosition.z]} 
                min={-20} 
                max={20} 
                step={1}
                className="w-full"
                onValueChange={(value) => updateSetting('directionalPosition', 
                  { ...settings.directionalPosition, z: value[0] })}
              />
              <div className="text-xs text-slate-500 dark:text-slate-400 text-center">{settings.directionalPosition.z}</div>
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
            <Label className="text-xs text-slate-600 dark:text-slate-400">Intensity</Label>
            <span className="text-xs text-slate-500 dark:text-slate-400">{settings.pointIntensity}</span>
          </div>
          <Slider 
            value={[settings.pointIntensity * 100]} 
            max={200} 
            step={1} 
            className="w-full"
            onValueChange={(value) => updateSetting('pointIntensity', value[0] / 100)}
          />

          <div className="grid grid-cols-3 gap-2 mt-2">
            <div>
              <Label className="text-xs text-slate-600 dark:text-slate-400">X</Label>
              <Slider 
                value={[settings.pointPosition.x]} 
                min={-20} 
                max={20} 
                step={1}
                className="w-full"
                onValueChange={(value) => updateSetting('pointPosition', 
                  { ...settings.pointPosition, x: value[0] })}
              />
              <div className="text-xs text-slate-500 dark:text-slate-400 text-center">{settings.pointPosition.x}</div>
            </div>
            <div>
              <Label className="text-xs text-slate-600 dark:text-slate-400">Y</Label>
              <Slider 
                value={[settings.pointPosition.y]} 
                min={-20} 
                max={20} 
                step={1}
                className="w-full"
                onValueChange={(value) => updateSetting('pointPosition', 
                  { ...settings.pointPosition, y: value[0] })}
              />
              <div className="text-xs text-slate-500 dark:text-slate-400 text-center">{settings.pointPosition.y}</div>
            </div>
            <div>
              <Label className="text-xs text-slate-600 dark:text-slate-400">Z</Label>
              <Slider 
                value={[settings.pointPosition.z]} 
                min={-20} 
                max={20} 
                step={1}
                className="w-full"
                onValueChange={(value) => updateSetting('pointPosition', 
                  { ...settings.pointPosition, z: value[0] })}
              />
              <div className="text-xs text-slate-500 dark:text-slate-400 text-center">{settings.pointPosition.z}</div>
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
            <Label className="text-xs text-slate-600 dark:text-slate-400">Shininess</Label>
            <span className="text-xs text-slate-500 dark:text-slate-400">{settings.shininess}</span>
          </div>
          <Slider 
            value={[settings.shininess]} 
            max={128} 
            step={1} 
            className="w-full"
            onValueChange={(value) => updateSetting('shininess', value[0])}
          />
        </div>
      </div>
    </div>
  )
}
