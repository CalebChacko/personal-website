import * as THREE from 'three';

// Step 1: Setup Scene, Camera, and Render
const scene = new THREE.Scene();
// Parameters: Zoom, Aspect ration, Clipping Plain Near, Clipping Plain Far)
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000)

const renderer = new THREE.WebGL1Renderer()
console.log(scene)
console.log(camera)
console.log(renderer)

renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)