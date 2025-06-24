"use client"

import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Upload, RotateCcw, Box, Pyramid, Trash2, Eye, EyeOff, Circle, Cylinder, Donut, Square } from "lucide-react"

export default function ToolPanel3D() {
  const handleAddCube = () => {
    if (typeof window !== 'undefined' && (window as any).canvas3DActions) {
      (window as any).canvas3DActions.addCube()
    }
  }

  const handleAddPyramid = () => {
    if (typeof window !== 'undefined' && (window as any).canvas3DActions) {
      (window as any).canvas3DActions.addPyramid()
    }
  }

  const handleAddSphere = () => {
    if (typeof window !== 'undefined' && (window as any).canvas3DActions) {
      (window as any).canvas3DActions.addSphere()
    }
  }

  const handleAddCylinder = () => {
    if (typeof window !== 'undefined' && (window as any).canvas3DActions) {
      (window as any).canvas3DActions.addCylinder()
    }
  }

  const handleAddTorus = () => {
    if (typeof window !== 'undefined' && (window as any).canvas3DActions) {
      (window as any).canvas3DActions.addTorus()
    }
  }

  const handleAddPlane = () => {
    if (typeof window !== 'undefined' && (window as any).canvas3DActions) {
      (window as any).canvas3DActions.addPlane()
    }
  }

  const handleDeleteSelected = () => {
    if (typeof window !== 'undefined' && (window as any).canvas3DActions) {
      (window as any).canvas3DActions.deleteSelected()
    }
  }

  const handleClearAll = () => {
    if (typeof window !== 'undefined' && (window as any).canvas3DActions) {
      (window as any).canvas3DActions.clearAllObjects()
    }
  }

  const handleHideAll = () => {
    if (typeof window !== 'undefined' && (window as any).canvas3DActions) {
      (window as any).canvas3DActions.hideAllObjects()
    }
  }

  return (
    <div className="space-y-4">
      {/* Add 3D Objects */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Add 3D Objects</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="justify-start" onClick={handleAddCube}>
            <Box className="w-4 h-4 mr-2" />
            Cube
          </Button>
          <Button variant="outline" size="sm" className="justify-start" onClick={handleAddPyramid}>
            <Pyramid className="w-4 h-4 mr-2" />
            Pyramid
          </Button>
          <Button variant="outline" size="sm" className="justify-start" onClick={handleAddSphere}>
            <Circle className="w-4 h-4 mr-2" />
            Sphere
          </Button>
          <Button variant="outline" size="sm" className="justify-start" onClick={handleAddCylinder}>
            <Cylinder className="w-4 h-4 mr-2" />
            Cylinder
          </Button>
          <Button variant="outline" size="sm" className="justify-start" onClick={handleAddTorus}>
            <Donut className="w-4 h-4 mr-2" />
            Torus
          </Button>
          <Button variant="outline" size="sm" className="justify-start" onClick={handleAddPlane}>
            <Square className="w-4 h-4 mr-2" />
            Plane
          </Button>
        </div>
      </div>

      <Separator />

      {/* Object Properties */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Selected Object</Label>
        <div className="text-xs text-slate-600 space-y-1">
          <div>Position: (0, 0, 0)</div>
          <div>Rotation: (0°, 0°, 0°)</div>
          <div>Scale: (1, 1, 1)</div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button variant="outline" size="sm" onClick={handleHideAll}>
            <Eye className="w-4 h-4 mr-1" />
            Hide
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      <Separator />

      {/* Object Management */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Object Management</Label>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleClearAll}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Objects
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleHideAll}>
            <EyeOff className="w-4 h-4 mr-2" />
            Hide All Objects
          </Button>
        </div>
      </div>

      <Separator />

      {/* Scene Controls */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Scene Controls</Label>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Camera
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Upload className="w-4 h-4 mr-2" />
            Load .obj File
          </Button>
        </div>
      </div>

      <Separator />

      {/* Controls Info */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Controls</Label>
        <div className="text-xs text-slate-600 space-y-1">
          <div>
            <strong>Left Click + Drag:</strong> Rotate view
          </div>
          <div>
            <strong>Right Click + Drag:</strong> Pan view
          </div>
          <div>
            <strong>Mouse Wheel:</strong> Zoom in/out
          </div>
          <div>
            <strong>Click Object:</strong> Select/deselect
          </div>
          <div>
            <strong>Selected objects:</strong> Auto-rotate
          </div>
        </div>
      </div>
    </div>
  )
}
