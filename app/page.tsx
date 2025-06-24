"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Canvas2D from "@/components/canvas-2d"
import Canvas3D from "@/components/canvas-3d"
import ToolPanel2D from "@/components/tool-panel-2d"
import ToolPanel3D from "@/components/tool-panel-3d"
import TransformPanel from "@/components/transform-panel"
import WindowingPanel from "@/components/windowing-panel"
import LightingPanel from "@/components/lighting-panel"
import { Palette, Move3D, Lightbulb, Settings, Info } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export default function GraphicsApp() {
  const [activeModule, setActiveModule] = useState("2d")
  const [selectedTool, setSelectedTool] = useState("point")
  const [selectedColor, setSelectedColor] = useState("#3b82f6")
  const [lineThickness, setLineThickness] = useState(2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Graphics Studio 3D</h1>
              <Badge variant="outline" className="text-xs">
                Professional 3D Graphics Lab
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <ModeToggle />
              <Button variant="outline" size="sm">
                <Info className="w-4 h-4 mr-2" />
                Help
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar */}
        <div className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
          <div className="p-4">
            <Tabs value={activeModule} onValueChange={setActiveModule} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="2d" className="text-sm">
                  2D Objects
                </TabsTrigger>
                <TabsTrigger value="3d" className="text-sm">
                  3D Objects
                </TabsTrigger>
              </TabsList>

              <TabsContent value="2d" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Palette className="w-5 h-5 mr-2" />
                      Drawing Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ToolPanel2D
                      selectedTool={selectedTool}
                      onToolChange={setSelectedTool}
                      selectedColor={selectedColor}
                      onColorChange={setSelectedColor}
                      lineThickness={lineThickness}
                      onThicknessChange={setLineThickness}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Move3D className="w-5 h-5 mr-2" />
                      Transformations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TransformPanel mode="2d" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Windowing & Clipping</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WindowingPanel />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="3d" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Move3D className="w-5 h-5 mr-2" />
                      3D Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ToolPanel3D />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Move3D className="w-5 h-5 mr-2" />
                      3D Transformations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TransformPanel mode="3d" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      Lighting & Shading
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LightingPanel />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Mode: {activeModule.toUpperCase()}</span>
                {activeModule === "2d" && (
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Tool: {selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1)}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Clear Canvas
                </Button>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-4">
            <div className="h-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              {activeModule === "2d" ? (
                <Canvas2D selectedTool={selectedTool} selectedColor={selectedColor} lineThickness={lineThickness} />
              ) : (
                <Canvas3D />
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 overflow-y-auto">
          <div className="p-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Canvas Size</label>
                  <div className="text-sm text-slate-500 mt-1">800 × 600</div>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-slate-600">Current Tool</label>
                  <div className="text-sm text-slate-500 mt-1 capitalize">{selectedTool}</div>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-slate-600">Current Color</label>
                  <div className="flex items-center mt-1">
                    <div
                      className="w-4 h-4 rounded border border-slate-300 mr-2"
                      style={{ backgroundColor: selectedColor }}
                    />
                    <span className="text-sm text-slate-500">{selectedColor}</span>
                  </div>
                </div>
                {activeModule === "2d" && (
                  <>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium text-slate-600">Line Thickness</label>
                      <div className="text-sm text-slate-500 mt-1">{lineThickness}px</div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-600 space-y-2">
                  {activeModule === "2d" ? (
                    <>
                      <p>
                        <strong>Point:</strong> Click once to place
                      </p>
                      <p>
                        <strong>Line:</strong> Click start, then end point
                      </p>
                      <p>
                        <strong>Rectangle:</strong> Click two opposite corners
                      </p>
                      <p>
                        <strong>Ellipse:</strong> Click center, then edge point
                      </p>
                      <p>
                        <strong>Clear:</strong> Use clear button to reset
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        <strong>Add Objects:</strong> Use buttons to add shapes
                      </p>
                      <p>
                        <strong>Select:</strong> Click objects to select them
                      </p>
                      <p>
                        <strong>Rotate View:</strong> Left drag to rotate
                      </p>
                      <p>
                        <strong>Pan:</strong> Right drag to pan view
                      </p>
                      <p>
                        <strong>Zoom:</strong> Mouse wheel to zoom
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
