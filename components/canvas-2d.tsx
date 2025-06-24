"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"

interface Canvas2DProps {
  selectedTool: string
  selectedColor: string
  lineThickness: number
}

interface Point {
  x: number
  y: number
}

interface DrawnObject {
  type: string
  points: Point[]
  color: string
  thickness: number
}

export default function Canvas2D({ selectedTool, selectedColor, lineThickness }: Canvas2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gl, setGL] = useState<WebGLRenderingContext | null>(null)
  const [program, setProgram] = useState<WebGLProgram | null>(null)
  const [objects, setObjects] = useState<DrawnObject[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState<Point | null>(null)
  const [currentPreview, setCurrentPreview] = useState<DrawnObject | null>(null)

  // Initialize WebGL
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size
    canvas.width = 800
    canvas.height = 600

    const context = canvas.getContext("webgl")
    if (!context) {
      console.error("WebGL not supported")
      return
    }

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      uniform vec2 u_resolution;
      void main() {
        vec2 zeroToOne = a_position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        gl_PointSize = 8.0;
      }
    `

    // Fragment shader
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec4 u_color;
      void main() {
        gl_FragColor = u_color;
      }
    `

    // Create shaders
    const vertexShader = createShader(context, context.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(context, context.FRAGMENT_SHADER, fragmentShaderSource)

    if (!vertexShader || !fragmentShader) return

    // Create program
    const shaderProgram = createProgram(context, vertexShader, fragmentShader)
    if (!shaderProgram) return

    setGL(context)
    setProgram(shaderProgram)
  }, [])

  const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type)
    if (!shader) return null

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compilation error:", gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }

    return shader
  }

  const createProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
    const program = gl.createProgram()
    if (!program) return null

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
      return null
    }

    return program
  }

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16) / 255,
          g: Number.parseInt(result[2], 16) / 255,
          b: Number.parseInt(result[3], 16) / 255,
        }
      : { r: 0, g: 0, b: 0 }
  }

  const drawObjects = useCallback(() => {
    if (!gl || !program || !canvasRef.current) return

    gl.clear(gl.COLOR_BUFFER_BIT)
    const positionLocation = gl.getAttribLocation(program, "a_position")
    const colorLocation = gl.getUniformLocation(program, "u_color")
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution")

    gl.uniform2f(resolutionLocation, canvasRef.current.width, canvasRef.current.height)

    // Draw all completed objects
    const allObjects = [...objects]
    
    // Add preview object if drawing
    if (currentPreview) {
      allObjects.push(currentPreview)
    }

    allObjects.forEach((obj) => {
      const rgb = hexToRgb(obj.color)
      gl.uniform4f(colorLocation, rgb.r, rgb.g, rgb.b, 1.0)

      if (obj.type === "point") {
        const vertices = new Float32Array([obj.points[0].x, obj.points[0].y])
        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
        gl.enableVertexAttribArray(positionLocation)
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
        gl.drawArrays(gl.POINTS, 0, 1)
      } else if (obj.type === "line") {
        const vertices = new Float32Array([obj.points[0].x, obj.points[0].y, obj.points[1].x, obj.points[1].y])
        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
        gl.lineWidth(obj.thickness)
        gl.enableVertexAttribArray(positionLocation)
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
        gl.drawArrays(gl.LINES, 0, 2)
      } else if (obj.type === "rectangle") {
        const [p1, p2] = obj.points
        const vertices = new Float32Array([p1.x, p1.y, p2.x, p1.y, p2.x, p2.y, p1.x, p2.y, p1.x, p1.y])
        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
        gl.lineWidth(obj.thickness)
        gl.enableVertexAttribArray(positionLocation)
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
        gl.drawArrays(gl.LINE_STRIP, 0, 5)
      } else if (obj.type === "ellipse") {
        const [center, edge] = obj.points
        const radiusX = Math.abs(edge.x - center.x)
        const radiusY = Math.abs(edge.y - center.y)
        const segments = 50
        const vertices = []

        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * 2 * Math.PI
          const x = center.x + radiusX * Math.cos(angle)
          const y = center.y + radiusY * Math.sin(angle)
          vertices.push(x, y)
        }

        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
        gl.lineWidth(obj.thickness)
        gl.enableVertexAttribArray(positionLocation)
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
        gl.drawArrays(gl.LINE_STRIP, 0, segments + 1)
      }
    })
  }, [gl, program, objects, currentPreview])

  useEffect(() => {
    drawObjects()
  }, [drawObjects])

  const getMousePos = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getMousePos(event)

    if (selectedTool === "point") {
      // Point tool works with single click
      setObjects((prev) => [
        ...prev,
        {
          type: "point",
          points: [point],
          color: selectedColor,
          thickness: lineThickness,
        },
      ])
      return
    }

    // For other tools, start drawing
    setIsDrawing(true)
    setStartPoint(point)
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return

    const currentPoint = getMousePos(event)

    // Create preview object
    let previewObj: DrawnObject | null = null

    switch (selectedTool) {
      case "line":
        previewObj = {
          type: "line",
          points: [startPoint, currentPoint],
          color: selectedColor,
          thickness: lineThickness,
        }
        break
      case "rectangle":
        previewObj = {
          type: "rectangle",
          points: [startPoint, currentPoint],
          color: selectedColor,
          thickness: lineThickness,
        }
        break
      case "ellipse":
        previewObj = {
          type: "ellipse",
          points: [startPoint, currentPoint],
          color: selectedColor,
          thickness: lineThickness,
        }
        break
    }

    setCurrentPreview(previewObj)
  }

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return

    const endPoint = getMousePos(event)

    // Add the completed object
    let newObject: DrawnObject | null = null

    switch (selectedTool) {
      case "line":
        newObject = {
          type: "line",
          points: [startPoint, endPoint],
          color: selectedColor,
          thickness: lineThickness,
        }
        break
      case "rectangle":
        newObject = {
          type: "rectangle",
          points: [startPoint, endPoint],
          color: selectedColor,
          thickness: lineThickness,
        }
        break
      case "ellipse":
        newObject = {
          type: "ellipse",
          points: [startPoint, endPoint],
          color: selectedColor,
          thickness: lineThickness,
        }
        break
    }

    if (newObject) {
      setObjects((prev) => [...prev, newObject])
    }

    // Reset drawing state
    setIsDrawing(false)
    setStartPoint(null)
    setCurrentPreview(null)
  }

  // Ensure hooks are called at the top level
  const useWebGLSetup = (gl: WebGLRenderingContext | null, program: WebGLProgram | null) => {
    useEffect(() => {
      if (gl && program) {
        gl.useProgram(program)
        gl.viewport(0, 0, 800, 600)
        gl.clearColor(1.0, 1.0, 1.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)
      }
    }, [gl, program])
  }

  useWebGLSetup(gl, program)

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border border-gray-300 bg-white cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      {isDrawing && (
        <div className="absolute top-4 left-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm">
          {selectedTool === "line" && "Drag to draw line"}
          {selectedTool === "rectangle" && "Drag to draw rectangle"}
          {selectedTool === "ellipse" && "Drag to draw ellipse"}
        </div>
      )}
    </div>
  )
}
