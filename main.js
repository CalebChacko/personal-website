import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
import * as dat from 'dat.gui'

//https://tailwindcss.com/docs/installation

// Add Dat GUI
const gui = new dat.GUI()
const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegments: 50,
    heightSegments: 50,
  }
}

gui.add(world.plane, 'width', 1, 500).onChange(() => {
  generatePlane()
})

gui.add(world.plane, 'height', 1, 500).onChange(() => {
  generatePlane()
})

gui.add(world.plane, 'widthSegments', 1, 500).onChange(() => {
  generatePlane()
})

gui.add(world.plane, 'heightSegments', 1, 500).onChange(() => {
  generatePlane()
})

function generatePlane() {
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.
    PlaneGeometry(
      world.plane.width, 
      world.plane.height, 
      world.plane.widthSegments, 
      world.plane.heightSegments)
  // vertice position randomization
  const {array} = planeMesh.geometry.attributes.position
  const randomValues = []
  for (let i = 0; i < array.length; i++) {

    if (i%3 == 0) {
      const x = array[i]
      const y = array[i+1]
      const z = array[i+2]
    
      array[i] = x + (Math.random() - 0.5)*3
      array[i+1] = y + (Math.random() - 0.5)*3
      array[i+2] = z + (Math.random() - 0.5)*3
    }

    randomValues.push(Math.random()*Math.PI*2)
  }

  planeMesh.geometry.attributes.position.randomValues = randomValues
  planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array


  const colors = []
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0,0.19,0.4)
  }

  planeMesh.geometry.setAttribute('color', 
    new THREE.BufferAttribute(new Float32Array(colors), 3))
}

// Laser pointer dot compared to the scene
const raycaster = new THREE.Raycaster()
// Step 1: Setup Scene, Camera, and Render
const scene = new THREE.Scene();
// Parameters: Zoom, Aspect ration, Clipping Plain Near, Clipping Plain Far)
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000)

const renderer = new THREE.WebGL1Renderer()

renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)
// Step 2: Create a plane
// 2 things to setup an object: 
// 1. geometry(wireframe)
// 2. material(wrapping)

// const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({color: 0x00FF00})

// const mesh = new THREE.Mesh(boxGeometry, material)

// scene.add(mesh)
camera.position.z = 50

const planeGeometry = 
  new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments)
const planeMaterial = new THREE.MeshPhongMaterial({ 
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading, 
  vertexColors: true})

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh)

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 1, 1)
scene.add(light)

const light_back = new THREE.DirectionalLight(0xffffff, 1)
light_back.position.set(0, 0, -1)
scene.add(light_back)

// console.log(planeMesh.geometry.attributes.position.array)
generatePlane()

let frame = 0

const mouse = {
  x: undefined,
  y: undefined
}

function animate() {
  requestAnimationFrame(animate)
  
  renderer.render(scene, camera)
  // mesh.rotation.x += 0.01
  // mesh.rotation.y += 0.01

  raycaster.setFromCamera(mouse, camera)
  frame += 0.01

  const {array, originalPosition, randomValues} = planeMesh.geometry.attributes.position
  for (let i = 0; i < array.length; i += 3) {
    // x
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i])*0.015
    // y
    array[i+1] = originalPosition[i+1] + Math.sin(frame + randomValues[i+1])*0.015

  }

  planeMesh.geometry.attributes.position.needsUpdate = true
  
  const intersects = raycaster.intersectObject(planeMesh)
  if (intersects.length > 0) {
    // console.log(intersects[0].face)
    const {color} = intersects[0].object.geometry.attributes

    // setting vertices to blue
    // vertice 1
    color.setX(intersects[0].face.a, 0.1)
    color.setY(intersects[0].face.a, 0.5)
    color.setZ(intersects[0].face.a, 1)

    // vertice 2
    color.setX(intersects[0].face.b, 0.1)
    color.setY(intersects[0].face.b, 0.5)
    color.setZ(intersects[0].face.b, 1)

    // vertice 3
    color.setX(intersects[0].face.c, 0.1)
    color.setY(intersects[0].face.c, 0.5)
    color.setZ(intersects[0].face.c, 1)

    color.needsUpdate = true

    const initialColor = {
      r: 0,
      g: 0.19,
      b: 0.4,
    }

    const hoverColor = {
      r: 0.1,
      g: 0.5,
      b: 1,
    }

    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: () => {
        // setting vertices to original color
        // vertice 1
        color.setX(intersects[0].face.a, hoverColor.r)
        color.setY(intersects[0].face.a, hoverColor.g)
        color.setZ(intersects[0].face.a, hoverColor.b)

        // vertice 2
        color.setX(intersects[0].face.b, hoverColor.r)
        color.setY(intersects[0].face.b, hoverColor.g)
        color.setZ(intersects[0].face.b, hoverColor.b)

        // vertice 3
        color.setX(intersects[0].face.c, hoverColor.r)
        color.setY(intersects[0].face.c, hoverColor.g)
        color.setZ(intersects[0].face.c, hoverColor.b)
      }
    })
  }
}

animate()

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth)*2 - 1
  mouse.y = -(event.clientY / innerHeight)*2 + 1
})