"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Move, RotateCw, Maximize } from "lucide-react"
import { toast } from "sonner"

interface TransformPanelProps {
  mode: "2d" | "3d"
}

export default function TransformPanel({ mode }: TransformPanelProps) {
  const [translationX, setTranslationX] = useState<number>(0)
  const [translationY, setTranslationY] = useState<number>(0)
  const [translationZ, setTranslationZ] = useState<number>(0)
  const [rotationX, setRotationX] = useState<number>(0)
  const [rotationY, setRotationY] = useState<number>(0)
  const [rotationZ, setRotationZ] = useState<number>(0)
  const [scaleX, setScaleX] = useState<number>(1)
  const [scaleY, setScaleY] = useState<number>(1)
  const [scaleZ, setScaleZ] = useState<number>(1)

  const applyTranslation = () => {
    if (typeof window !== 'undefined' && (window as any).canvas3DActions) {
      const actions = (window as any).canvas3DActions
      if (actions.applyTransform) {
        actions.applyTransform('translate', {
          x: translationX, 
          y: translationY, 
          z: mode === "3d" ? translationZ : 0
        })
        toast.success(`Translation applied: (${translationX}, ${translationY}${mode === "3d" ? `, ${translationZ}` : ''})`)
      } else {
        toast.error("No selected object to transform")
      }
    }
  }

  const applyRotation = () => {
    if (typeof window !== 'undefined' && (window as any).canvas3DActions) {
      const actions = (window as any).canvas3DActions
      if (actions.applyTransform) {
        if (mode === "2d") {
          actions.applyTransform('rotate', { z: rotationZ })
          toast.success(`Rotation applied: ${rotationZ}°`)
        } else {
          actions.applyTransform('rotate', {
            x: rotationX, 
            y: rotationY, 
            z: rotationZ
          })
          toast.success(`Rotation applied: (${rotationX}°, ${rotationY}°, ${rotationZ}°)`)
        }
      } else {
        toast.error("No selected object to transform")
      }
    }
  }

  const applyScaling = () => {
    if (typeof window !== 'undefined' && (window as any).canvas3DActions) {
      const actions = (window as any).canvas3DActions
      if (actions.applyTransform) {
        actions.applyTransform('scale', {
          x: scaleX, 
          y: scaleY, 
          z: mode === "3d" ? scaleZ : 1
        })
        toast.success(`Scale applied: (${scaleX}, ${scaleY}${mode === "3d" ? `, ${scaleZ}` : ''})`)
      } else {
        toast.error("No selected object to transform")
      }
    }
  }

  const resetTransform = () => {
    if (typeof window !== 'undefined' && (window as any).canvas3DActions) {
      const actions = (window as any).canvas3DActions
      if (actions.resetTransform) {
        actions.resetTransform()
        toast.success("Object transform reset")
      } else {
        toast.error("No selected object to reset")
      }
    }
    setTranslationX(0)
    setTranslationY(0)
    setTranslationZ(0)
    setRotationX(0)
    setRotationY(0)
    setRotationZ(0)
    setScaleX(1)
    setScaleY(1)
    setScaleZ(1)
  }

  const centerObject = () => {
    if (typeof window !== 'undefined' && (window as any).canvas3DActions) {
      const actions = (window as any).canvas3DActions
      if (actions.centerObject) {
        actions.centerObject()
        toast.success("Object centered")
      } else {
        toast.error("No selected object to center")
      }
    }
  }
  return (
    <div className="space-y-4">
      {/* Translation */}
      <div>
        <Label className="text-sm font-medium mb-2 flex items-center">
          <Move className="w-4 h-4 mr-1" />
          Translation
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-slate-600 dark:text-slate-400">X</Label>
            <Input 
              type="number" 
              value={translationX}
              onChange={(e) => setTranslationX(parseFloat(e.target.value) || 0)}
              className="h-8 text-sm" 
            />
          </div>
          <div>
            <Label className="text-xs text-slate-600 dark:text-slate-400">Y</Label>
            <Input 
              type="number" 
              value={translationY}
              onChange={(e) => setTranslationY(parseFloat(e.target.value) || 0)}
              className="h-8 text-sm" 
            />
          </div>
          {mode === "3d" && (
            <div className="col-span-2">
              <Label className="text-xs text-slate-600 dark:text-slate-400">Z</Label>
              <Input 
                type="number" 
                value={translationZ}
                onChange={(e) => setTranslationZ(parseFloat(e.target.value) || 0)}
                className="h-8 text-sm" 
              />
            </div>
          )}
        </div>
        <Button size="sm" className="w-full mt-2" onClick={applyTranslation}>
          Apply Translation
        </Button>
      </div>

      <Separator />

      {/* Rotation */}
      <div>
        <Label className="text-sm font-medium mb-2 flex items-center">
          <RotateCw className="w-4 h-4 mr-1" />
          Rotation
        </Label>
        <div className="grid grid-cols-1 gap-2">
          {mode === "2d" ? (
            <div>
              <Label className="text-xs text-slate-600 dark:text-slate-400">Angle (degrees)</Label>
              <Input 
                type="number" 
                value={rotationZ}
                onChange={(e) => setRotationZ(parseFloat(e.target.value) || 0)}
                className="h-8 text-sm" 
              />
            </div>
          ) : (
            <>
              <div>
                <Label className="text-xs text-slate-600 dark:text-slate-400">X-axis (degrees)</Label>
                <Input 
                  type="number" 
                  value={rotationX}
                  onChange={(e) => setRotationX(parseFloat(e.target.value) || 0)}
                  className="h-8 text-sm" 
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600 dark:text-slate-400">Y-axis (degrees)</Label>
                <Input 
                  type="number" 
                  value={rotationY}
                  onChange={(e) => setRotationY(parseFloat(e.target.value) || 0)}
                  className="h-8 text-sm" 
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600 dark:text-slate-400">Z-axis (degrees)</Label>
                <Input 
                  type="number" 
                  value={rotationZ}
                  onChange={(e) => setRotationZ(parseFloat(e.target.value) || 0)}
                  className="h-8 text-sm" 
                />
              </div>
            </>
          )}
        </div>
        <Button size="sm" className="w-full mt-2" onClick={applyRotation}>
          Apply Rotation
        </Button>
      </div>

      <Separator />

      {/* Scaling */}
      <div>
        <Label className="text-sm font-medium mb-2 flex items-center">
          <Maximize className="w-4 h-4 mr-1" />
          Scaling
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-slate-600 dark:text-slate-400">X Scale</Label>
            <Input 
              type="number" 
              value={scaleX}
              onChange={(e) => setScaleX(parseFloat(e.target.value) || 1)}
              step="0.1"
              className="h-8 text-sm" 
            />
          </div>
          <div>
            <Label className="text-xs text-slate-600 dark:text-slate-400">Y Scale</Label>
            <Input 
              type="number" 
              value={scaleY}
              onChange={(e) => setScaleY(parseFloat(e.target.value) || 1)}
              step="0.1"
              className="h-8 text-sm" 
            />
          </div>
          {mode === "3d" && (
            <div className="col-span-2">
              <Label className="text-xs text-slate-600 dark:text-slate-400">Z Scale</Label>
              <Input 
                type="number" 
                value={scaleZ}
                onChange={(e) => setScaleZ(parseFloat(e.target.value) || 1)}
                step="0.1"
                className="h-8 text-sm" 
              />
            </div>
          )}
        </div>
        <Button size="sm" className="w-full mt-2" onClick={applyScaling}>
          Apply Scaling
        </Button>
      </div>

      <Separator />

      {/* Quick Actions */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Quick Actions</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={resetTransform}>
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={centerObject}>
            Center
          </Button>
        </div>
      </div>
    </div>
  )
}
