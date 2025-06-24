"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Square, Scissors, Eye } from "lucide-react"

export default function WindowingPanel() {
  return (
    <div className="space-y-4">
      {/* Window Definition */}
      <div>
        <Label className="text-sm font-medium mb-2 flex items-center">
          <Square className="w-4 h-4 mr-1" />
          Define Window
        </Label>
        <Button variant="outline" size="sm" className="w-full mb-2">
          Click Two Corners
        </Button>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <Label className="text-xs text-slate-600">Top-Left</Label>
            <div className="text-slate-500">(0, 0)</div>
          </div>
          <div>
            <Label className="text-xs text-slate-600">Bottom-Right</Label>
            <div className="text-slate-500">(0, 0)</div>
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
            <Switch id="cohen-sutherland" />
            <Label htmlFor="cohen-sutherland" className="text-sm">
              Cohen-Sutherland
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="liang-barsky" />
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
            <Switch id="highlight-inside" defaultChecked />
            <Label htmlFor="highlight-inside" className="text-sm">
              Highlight Inside Objects
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="show-window" defaultChecked />
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
          <Button variant="outline" size="sm">
            Move
          </Button>
          <Button variant="outline" size="sm">
            Resize
          </Button>
          <Button variant="outline" size="sm" className="col-span-2">
            Clear Window
          </Button>
        </div>
      </div>
    </div>
  )
}
