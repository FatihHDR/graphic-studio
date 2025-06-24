"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Move, RotateCw, Maximize } from "lucide-react"

interface TransformPanelProps {
  mode: "2d" | "3d"
}

export default function TransformPanel({ mode }: TransformPanelProps) {
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
            <Label className="text-xs text-slate-600">X</Label>
            <Input type="number" placeholder="0" className="h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs text-slate-600">Y</Label>
            <Input type="number" placeholder="0" className="h-8 text-sm" />
          </div>
          {mode === "3d" && (
            <div className="col-span-2">
              <Label className="text-xs text-slate-600">Z</Label>
              <Input type="number" placeholder="0" className="h-8 text-sm" />
            </div>
          )}
        </div>
        <Button size="sm" className="w-full mt-2">
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
              <Label className="text-xs text-slate-600">Angle (degrees)</Label>
              <Input type="number" placeholder="0" className="h-8 text-sm" />
            </div>
          ) : (
            <>
              <div>
                <Label className="text-xs text-slate-600">X-axis (degrees)</Label>
                <Input type="number" placeholder="0" className="h-8 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Y-axis (degrees)</Label>
                <Input type="number" placeholder="0" className="h-8 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Z-axis (degrees)</Label>
                <Input type="number" placeholder="0" className="h-8 text-sm" />
              </div>
            </>
          )}
        </div>
        <Button size="sm" className="w-full mt-2">
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
            <Label className="text-xs text-slate-600">X Scale</Label>
            <Input type="number" placeholder="1.0" className="h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs text-slate-600">Y Scale</Label>
            <Input type="number" placeholder="1.0" className="h-8 text-sm" />
          </div>
          {mode === "3d" && (
            <div className="col-span-2">
              <Label className="text-xs text-slate-600">Z Scale</Label>
              <Input type="number" placeholder="1.0" className="h-8 text-sm" />
            </div>
          )}
        </div>
        <Button size="sm" className="w-full mt-2">
          Apply Scaling
        </Button>
      </div>

      <Separator />

      {/* Quick Actions */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Quick Actions</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm">
            Reset
          </Button>
          <Button variant="outline" size="sm">
            Center
          </Button>
        </div>
      </div>
    </div>
  )
}
