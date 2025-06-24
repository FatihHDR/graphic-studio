"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import type { Mesh } from "three"

// Custom infinite grid component
function InfiniteGrid() {
  return (
    <>
      <gridHelper args={[200, 200, 0x444444, 0x444444]} />
      <gridHelper args={[20, 20, 0x888888, 0x444444]} />
    </>
  )
}

interface Object3DData {
  id: number
  type: "cube" | "pyramid"
  position: [number, number, number]
  color: string
  selected: boolean
}

function Cube({ position, color, selected, onClick }: any) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current && selected) {
      meshRef.current.rotation.y += delta
    }
  })

  return (
    <mesh ref={meshRef} position={position} onClick={onClick}>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhongMaterial color={selected ? "#ff6b6b" : color} />
      {selected && (
        <mesh>
          <boxGeometry args={[1.1, 1.1, 1.1]} />
          <meshBasicMaterial wireframe color="#ffffff" />
        </mesh>
      )}
    </mesh>
  )
}

function Pyramid({ position, color, selected, onClick }: any) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current && selected) {
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.z += delta * 0.3
    }
  })

  return (
    <mesh ref={meshRef} position={position} onClick={onClick}>
      <coneGeometry args={[0.8, 1.6, 4]} />
      <meshPhongMaterial color={selected ? "#4ecdc4" : color} />
      {selected && (
        <mesh>
          <coneGeometry args={[0.9, 1.7, 4]} />
          <meshBasicMaterial wireframe color="#ffffff" />
        </mesh>
      )}
    </mesh>
  )
}

function Scene() {
  const [objects, setObjects] = useState<Object3DData[]>([
    {
      id: 1,
      type: "cube",
      position: [-2, 0, 0],
      color: "#3b82f6",
      selected: false,
    },
    {
      id: 2,
      type: "pyramid",
      position: [2, 0, 0],
      color: "#ef4444",
      selected: false,
    },
  ])

  const handleObjectClick = (id: number) => {
    setObjects((prev) =>
      prev.map((obj) => ({
        ...obj,
        selected: obj.id === id ? !obj.selected : false,
      })),
    )
  }

  const addCube = () => {
    const newId = Math.max(...objects.map((o) => o.id), 0) + 1
    setObjects((prev) => [
      ...prev,
      {
        id: newId,
        type: "cube",
        position: [Math.random() * 4 - 2, Math.random() * 2, Math.random() * 4 - 2],
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        selected: false,
      },
    ])
  }

  const addPyramid = () => {
    const newId = Math.max(...objects.map((o) => o.id), 0) + 1
    setObjects((prev) => [
      ...prev,
      {
        id: newId,
        type: "pyramid",
        position: [Math.random() * 4 - 2, Math.random() * 2, Math.random() * 4 - 2],
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        selected: false,
      },
    ])
  }

  const deleteSelected = () => {
    setObjects((prev) => prev.filter((obj) => !obj.selected))
  }

  const clearAllObjects = () => {
    setObjects([])
  }

  const hideAllObjects = () => {
    setObjects((prev) => prev.map((obj) => ({ ...obj, selected: false })))
  }

  // Make functions available globally for the tool panel
  if (typeof window !== 'undefined') {
    (window as any).canvas3DActions = {
      addCube,
      addPyramid,
      deleteSelected,
      clearAllObjects,
      hideAllObjects,
    }
  }

  return (
    <>
      {/* Info Panel */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border dark:border-slate-800">
        <div className="text-sm text-gray-700 dark:text-slate-300">
          <div>Objects: {objects.length}</div>
          <div>Selected: {objects.filter((o) => o.selected).length}</div>
        </div>
      </div>

      {/* 3D Scene */}
      <Canvas camera={{ position: [5, 5, 5], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        {objects.map((obj) => {
          if (obj.type === "cube") {
            return (
              <Cube
                key={obj.id}
                position={obj.position}
                color={obj.color}
                selected={obj.selected}
                onClick={() => handleObjectClick(obj.id)}
              />
            )
          } else {
            return (
              <Pyramid
                key={obj.id}
                position={obj.position}
                color={obj.color}
                selected={obj.selected}
                onClick={() => handleObjectClick(obj.id)}
              />
            )
          }
        })}

        <InfiniteGrid />
        <axesHelper args={[3]} />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={3}
          maxDistance={20}
        />
      </Canvas>
    </>
  )
}

export default function Canvas3D() {
  return (
    <div className="w-full h-full relative">
      <Scene />
    </div>
  )
}
