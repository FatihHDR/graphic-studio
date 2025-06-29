"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Square, Scissors, Eye } from "lucide-react"
import { toast } from "sonner"

export default function WindowingPanel() {
  const [isDefiningWindow, setIsDefiningWindow] = useState(false)
  const [windowCorners, setWindowCorners] = useState({
    topLeft: { x: 0, y: 0 },
    bottomRight: { x: 0, y: 0 }
  })
  const [cohenSutherlandEnabled, setCohenSutherlandEnabled] = useState(false)
  const [liangBarskyEnabled, setLiangBarskyEnabled] = useState(false)
  const [highlightInside, setHighlightInside] = useState(true)
  const [showWindowBorder, setShowWindowBorder] = useState(true)

  const startDefiningWindow = () => {
    setIsDefiningWindow(true)
    toast.info("Click two corners on the canvas to define the window")
    
    // Enable window definition mode on canvas
    if (typeof window !== 'undefined' && (window as any).canvas2DActions) {
      (window as any).canvas2DActions.startWindowDefinition?.()
    }
  }

  const handleCohenSutherlandToggle = (checked: boolean) => {
    setCohenSutherlandEnabled(checked)
    if (checked) {
      setLiangBarskyEnabled(false) // Only one algorithm at a time
      toast.success("Cohen-Sutherland clipping enabled")
    } else {
      toast.info("Cohen-Sutherland clipping disabled")
    }
    
    // Apply clipping algorithm to canvas
    if (typeof window !== 'undefined' && (window as any).canvas2DActions) {
      (window as any).canvas2DActions.setClippingAlgorithm?.(checked ? 'cohen-sutherland' : null)
    }
  }

  const handleLiangBarskyToggle = (checked: boolean) => {
    setLiangBarskyEnabled(checked)
    if (checked) {
      setCohenSutherlandEnabled(false) // Only one algorithm at a time
      toast.success("Liang-Barsky clipping enabled")
    } else {
      toast.info("Liang-Barsky clipping disabled")
    }
    
    // Apply clipping algorithm to canvas
    if (typeof window !== 'undefined' && (window as any).canvas2DActions) {
      (window as any).canvas2DActions.setClippingAlgorithm?.(checked ? 'liang-barsky' : null)
    }
  }

  const handleHighlightToggle = (checked: boolean) => {
    setHighlightInside(checked)
    toast.info(`Inside objects highlighting ${checked ? 'enabled' : 'disabled'}`)
    
    if (typeof window !== 'undefined' && (window as any).canvas2DActions) {
      (window as any).canvas2DActions.setHighlightInside?.(checked)
    }
  }

  const handleWindowBorderToggle = (checked: boolean) => {
    setShowWindowBorder(checked)
    toast.info(`Window border ${checked ? 'shown' : 'hidden'}`)
    
    if (typeof window !== 'undefined' && (window as any).canvas2DActions) {
      (window as any).canvas2DActions.setShowWindowBorder?.(checked)
    }
  }

  const moveWindow = () => {
    toast.info("Click and drag to move the window")
    if (typeof window !== 'undefined' && (window as any).canvas2DActions) {
      (window as any).canvas2DActions.startWindowMove?.()
    }
  }

  const resizeWindow = () => {
    toast.info("Click and drag a corner to resize the window")
    if (typeof window !== 'undefined' && (window as any).canvas2DActions) {
      (window as any).canvas2DActions.startWindowResize?.()
    }
  }

  const clearWindow = () => {
    setWindowCorners({
      topLeft: { x: 0, y: 0 },
      bottomRight: { x: 0, y: 0 }
    })
    setCohenSutherlandEnabled(false)
    setLiangBarskyEnabled(false)
    toast.success("Window cleared")
    
    if (typeof window !== 'undefined' && (window as any).canvas2DActions) {
      (window as any).canvas2DActions.clearWindow?.()
    }
  }
  return (
    <div className="space-y-4">
      {/* Window Definition */}
      <div>
        <Label className="text-sm font-medium mb-2 flex items-center">
          <Square className="w-4 h-4 mr-1" />
          Define Window
        </Label>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mb-2"
          onClick={startDefiningWindow}
          disabled={isDefiningWindow}
        >
          {isDefiningWindow ? "Defining..." : "Click Two Corners"}
        </Button>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <Label className="text-xs text-slate-600 dark:text-slate-400">Top-Left</Label>
            <div className="text-slate-500 dark:text-slate-400">
              ({windowCorners.topLeft.x}, {windowCorners.topLeft.y})
            </div>
          </div>
          <div>
            <Label className="text-xs text-slate-600 dark:text-slate-400">Bottom-Right</Label>
            <div className="text-slate-500 dark:text-slate-400">
              ({windowCorners.bottomRight.x}, {windowCorners.bottomRight.y})
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Clipping Options */}
      <div>
        <Label className="text-sm font-medium mb-2 flex items-center">
          <Scissors className="w-4 h-4 mr-1" />
          Clipping Algorithm
        </Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch 
              id="cohen-sutherland" 
              checked={cohenSutherlandEnabled}
              onCheckedChange={handleCohenSutherlandToggle}
            />
            <Label htmlFor="cohen-sutherland" className="text-sm">
              Cohen-Sutherland
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="liang-barsky" 
              checked={liangBarskyEnabled}
              onCheckedChange={handleLiangBarskyToggle}
            />
            <Label htmlFor="liang-barsky" className="text-sm">
              Liang-Barsky
            </Label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Visual Options */}
      <div>
        <Label className="text-sm font-medium mb-2 flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          Visual Options
        </Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch 
              id="highlight-inside" 
              checked={highlightInside}
              onCheckedChange={handleHighlightToggle}
            />
            <Label htmlFor="highlight-inside" className="text-sm">
              Highlight Inside Objects
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-window" 
              checked={showWindowBorder}
              onCheckedChange={handleWindowBorderToggle}
            />
            <Label htmlFor="show-window" className="text-sm">
              Show Window Border
            </Label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Window Controls */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Window Controls</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={moveWindow}>
            Move
          </Button>
          <Button variant="outline" size="sm" onClick={resizeWindow}>
            Resize
          </Button>
          <Button variant="outline" size="sm" className="col-span-2" onClick={clearWindow}>
            Clear Window
          </Button>
        </div>
      </div>
    </div>
  )
}
