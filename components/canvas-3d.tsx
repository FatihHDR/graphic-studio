"use client"

import { useRef, useState, useEffect, createContext, useContext } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import type { Mesh } from "three"
import * as THREE from "three"

// Context to manage global drag state
const DragContext = createContext<{
  isDragging: boolean
  setIsDragging: (dragging: boolean) => void
}>({
  isDragging: false,
  setIsDragging: () => {}
})

// Custom OrbitControls that can be disabled during dragging
function CustomOrbitControls() {
  const { isDragging } = useContext(DragContext)
  
  return (
    <OrbitControls
      enabled={!isDragging}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      maxPolarAngle={Math.PI / 2}
      minDistance={3}
      maxDistance={20}
    />
  )
}

// WASD Camera Controls Component
function WASDControls() {
  const { camera } = useThree()
  const keys = useRef<{ [key: string]: boolean }>({})
  const moveSpeed = 5 // Units per second

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keys.current[event.code.toLowerCase()] = true
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      keys.current[event.code.toLowerCase()] = false
    }

    const handleFocus = () => {
      // Clear all keys when window loses focus to prevent stuck keys
      keys.current = {}
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleFocus)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleFocus)
    }
  }, [])

  useFrame((state, delta) => {
    const moveDistance = moveSpeed * delta
    const direction = new THREE.Vector3()

    // Get camera's forward/right vectors
    camera.getWorldDirection(direction)
    const forward = direction.clone()
    const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize()

    // WASD movement
    if (keys.current['keyw']) {
      // W - Move forward
      camera.position.add(forward.multiplyScalar(moveDistance))
    }
    if (keys.current['keys']) {
      // S - Move backward
      camera.position.add(forward.multiplyScalar(-moveDistance))
    }
    if (keys.current['keya']) {
      // A - Move left
      camera.position.add(right.multiplyScalar(-moveDistance))
    }
    if (keys.current['keyd']) {
      // D - Move right
      camera.position.add(right.multiplyScalar(moveDistance))
    }
    if (keys.current['space']) {
      // Space - Move up
      camera.position.y += moveDistance
    }
    if (keys.current['shiftleft'] || keys.current['shiftright']) {
      // Shift - Move down
      camera.position.y -= moveDistance
    }
  })

  return null
}

// Custom infinite grid component
function InfiniteGrid() {
  return (
    <>
      <gridHelper args={[200, 200, 0x444444, 0x444444]} />
      <gridHelper args={[20, 20, 0x888888, 0x444444]} />
    </>
  )
}

// Draggable wrapper component
function DraggableObject({ children, position, onDrag, id }: any) {
  const meshRef = useRef<any>(null)
  const { camera, gl } = useThree()
  const [isLocalDragging, setIsLocalDragging] = useState(false)
  const { setIsDragging } = useContext(DragContext)
  const [dragPlane] = useState(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0))
  const [intersection] = useState(() => new THREE.Vector3())
  const [offset] = useState(() => new THREE.Vector3())

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isLocalDragging) return
      
      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2(
        (event.clientX / gl.domElement.clientWidth) * 2 - 1,
        -(event.clientY / gl.domElement.clientHeight) * 2 + 1
      )
      raycaster.setFromCamera(mouse, camera)
      
      if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
        const newPosition = intersection.sub(offset)
        meshRef.current.position.copy(newPosition)
        onDrag(id, [newPosition.x, newPosition.y, newPosition.z])
      }
    }

    const handleMouseUp = () => {
      setIsLocalDragging(false)
      setIsDragging(false) // Update global drag state
      gl.domElement.style.cursor = 'auto'
    }

    if (isLocalDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isLocalDragging, camera, gl, dragPlane, intersection, offset, id, onDrag, setIsDragging])

  const onPointerDown = (event: any) => {
    event.stopPropagation()
    setIsLocalDragging(true)
    setIsDragging(true) // Update global drag state
    gl.domElement.style.cursor = 'grabbing'
    
    // Calculate offset for smooth dragging
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2(
      (event.clientX / gl.domElement.clientWidth) * 2 - 1,
      -(event.clientY / gl.domElement.clientHeight) * 2 + 1
    )
    raycaster.setFromCamera(mouse, camera)
    
    if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
      offset.copy(intersection).sub(meshRef.current.position)
    }
  }

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerDown={onPointerDown}
    >
      {children}
    </group>
  )
}

interface Object3DData {
  id: number
  type: "cube" | "pyramid" | "sphere" | "cylinder" | "torus" | "plane"
  position: [number, number, number]
  color: string
  selected: boolean
  isDragging?: boolean
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

function Sphere({ position, color, selected, onClick }: any) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current && selected) {
      meshRef.current.rotation.y += delta * 0.8
      meshRef.current.rotation.x += delta * 0.2
    }
  })

  return (
    <mesh ref={meshRef} position={position} onClick={onClick}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshPhongMaterial color={selected ? "#10b981" : color} />
      {selected && (
        <mesh>
          <sphereGeometry args={[0.9, 16, 16]} />
          <meshBasicMaterial wireframe color="#ffffff" />
        </mesh>
      )}
    </mesh>
  )
}

function Cylinder({ position, color, selected, onClick }: any) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current && selected) {
      meshRef.current.rotation.y += delta * 1.2
    }
  })

  return (
    <mesh ref={meshRef} position={position} onClick={onClick}>
      <cylinderGeometry args={[0.6, 0.6, 1.5, 32]} />
      <meshPhongMaterial color={selected ? "#f59e0b" : color} />
      {selected && (
        <mesh>
          <cylinderGeometry args={[0.7, 0.7, 1.6, 16]} />
          <meshBasicMaterial wireframe color="#ffffff" />
        </mesh>
      )}
    </mesh>
  )
}

function Torus({ position, color, selected, onClick }: any) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current && selected) {
      meshRef.current.rotation.x += delta * 0.7
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <mesh ref={meshRef} position={position} onClick={onClick}>
      <torusGeometry args={[0.8, 0.3, 16, 100]} />
      <meshPhongMaterial color={selected ? "#8b5cf6" : color} />
      {selected && (
        <mesh>
          <torusGeometry args={[0.9, 0.35, 8, 50]} />
          <meshBasicMaterial wireframe color="#ffffff" />
        </mesh>
      )}
    </mesh>
  )
}

function Plane({ position, color, selected, onClick }: any) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current && selected) {
      meshRef.current.rotation.z += delta * 0.6
    }
  })

  return (
    <mesh ref={meshRef} position={position} onClick={onClick}>
      <planeGeometry args={[1.5, 1.5]} />
      <meshPhongMaterial color={selected ? "#ec4899" : color} side={2} />
      {selected && (
        <mesh>
          <planeGeometry args={[1.6, 1.6]} />
          <meshBasicMaterial wireframe color="#ffffff" side={2} />
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
      position: [-3, 0, 0],
      color: "#3b82f6",
      selected: false,
    },
    {
      id: 2,
      type: "pyramid",
      position: [0, 0, 0],
      color: "#ef4444",
      selected: false,
    },
    {
      id: 3,
      type: "sphere",
      position: [3, 0, 0],
      color: "#10b981",
      selected: false,
    },
    {
      id: 4,
      type: "cylinder",
      position: [-1.5, 0, 2],
      color: "#f59e0b",
      selected: false,
    },
    {
      id: 5,
      type: "torus",
      position: [1.5, 0, 2],
      color: "#8b5cf6",
      selected: false,
    },
    {
      id: 6,
      type: "plane",
      position: [0, 1.5, -1],
      color: "#ec4899",
      selected: false,
    },
  ])
  const [isObjectBeingDragged, setIsObjectBeingDragged] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [selectedObjectId, setSelectedObjectId] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleObjectClick = (id: number) => {
    setObjects((prev) =>
      prev.map((obj) => ({
        ...obj,
        selected: obj.id === id ? !obj.selected : false,
      })),
    )
  }

  const handleDrag = (id: number, newPosition: [number, number, number]) => {
    setObjects((prev) =>
      prev.map((obj) =>
        obj.id === id ? { ...obj, position: newPosition } : obj
      )
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

  const addSphere = () => {
    const newId = Math.max(...objects.map((o) => o.id), 0) + 1
    setObjects((prev) => [
      ...prev,
      {
        id: newId,
        type: "sphere",
        position: [Math.random() * 4 - 2, Math.random() * 2, Math.random() * 4 - 2],
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        selected: false,
      },
    ])
  }

  const addCylinder = () => {
    const newId = Math.max(...objects.map((o) => o.id), 0) + 1
    setObjects((prev) => [
      ...prev,
      {
        id: newId,
        type: "cylinder",
        position: [Math.random() * 4 - 2, Math.random() * 2, Math.random() * 4 - 2],
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        selected: false,
      },
    ])
  }

  const addTorus = () => {
    const newId = Math.max(...objects.map((o) => o.id), 0) + 1
    setObjects((prev) => [
      ...prev,
      {
        id: newId,
        type: "torus",
        position: [Math.random() * 4 - 2, Math.random() * 2, Math.random() * 4 - 2],
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        selected: false,
      },
    ])
  }

  const addPlane = () => {
    const newId = Math.max(...objects.map((o) => o.id), 0) + 1
    setObjects((prev) => [
      ...prev,
      {
        id: newId,
        type: "plane",
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
      addSphere,
      addCylinder,
      addTorus,
      addPlane,
      deleteSelected,
      clearAllObjects,
      hideAllObjects,
    }
  }

  return (
    <DragContext.Provider value={{ isDragging, setIsDragging }}>
      {/* Info Panel */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border dark:border-slate-800">
        <div className="text-sm text-gray-700 dark:text-slate-300">
          <div>Objects: {objects.length}</div>
          <div>Selected: {objects.filter((o) => o.selected).length}</div>
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-slate-700">
            <div className="text-xs text-gray-500 dark:text-slate-400">
              <div>🖱️ Click: Select object</div>
              <div>🫳 Drag: Move object</div>
              <div>🔄 Selected objects auto-rotate</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Scene */}
      <Canvas camera={{ position: [5, 5, 5], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        {objects.map((obj) => {
          const commonProps = {
            position: obj.position,
            color: obj.color,
            selected: obj.selected,
            onClick: () => handleObjectClick(obj.id)
          }

          let ObjectComponent
          switch (obj.type) {
            case "cube":
              ObjectComponent = Cube
              break
            case "pyramid":
              ObjectComponent = Pyramid
              break
            case "sphere":
              ObjectComponent = Sphere
              break
            case "cylinder":
              ObjectComponent = Cylinder
              break
            case "torus":
              ObjectComponent = Torus
              break
            case "plane":
              ObjectComponent = Plane
              break
            default:
              return null
          }

          return (
            <DraggableObject
              key={obj.id}
              id={obj.id}
              position={obj.position}
              onDrag={handleDrag}
            >
              <ObjectComponent {...commonProps} position={[0, 0, 0]} />
            </DraggableObject>
          )
        })}

        <InfiniteGrid />
        <axesHelper args={[3]} />
        
        {/* WASD Camera Controls */}
        <WASDControls />

        <CustomOrbitControls />
      </Canvas>
    </DragContext.Provider>
  )
}

export default function Canvas3D() {
  return (
    <div className="w-full h-full relative">
      <Scene />
    </div>
  )
}
