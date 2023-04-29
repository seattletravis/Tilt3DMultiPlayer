import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import CannonDebugger from 'cannon-es-debugger';

// THREE variables
let camera, scene, renderer
let movementPlane
let clickMarker
let raycaster
let cubeMesh //Declare at Cube mesh creation
let boxMesh

// CANNON variables
let physicsWorld
let jointBody
let jointConstraint
let cubeBody //Declare at cube creation
let boxBody

let isDragging = false

// To be synced
const meshes = []
const bodies = []

// THREE initialization Check Point
// Camera
camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.5, 1000)
camera.position.set(0, 5, 15)
camera.lookAt(0, 0, 0)

// Scene
scene = new THREE.Scene()

// Renderer
renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)

// Lights
const ambientLight = new THREE.AmbientLight(0x666666)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
const distance = 20
directionalLight.position.set(-distance, distance, distance)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048
directionalLight.shadow.camera.left = -distance
directionalLight.shadow.camera.right = distance
directionalLight.shadow.camera.top = distance
directionalLight.shadow.camera.bottom = -distance
directionalLight.shadow.camera.far = 3 * distance
directionalLight.shadow.camera.near = distance
scene.add(directionalLight)

// Floor
const floorGeometry = new THREE.PlaneGeometry(10, 10, 1, 1)
// const floorGeometry = new THREE.BoxGeometry(10, 10, 1, 1)
floorGeometry.rotateX(-Math.PI / 2)
const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x777777 })
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.receiveShadow = true
scene.add(floor)

// Click marker to be shown on interaction
const markerGeometry = new THREE.SphereGeometry(0.2, 8, 8)
const markerMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 })
clickMarker = new THREE.Mesh(markerGeometry, markerMaterial)
clickMarker.visible = false // Hide it..
scene.add(clickMarker)



// Movement plane when dragging
const planeGeometry = new THREE.PlaneGeometry(100, 100)
movementPlane = new THREE.Mesh(planeGeometry, floorMaterial)
movementPlane.visible = false // Hide it..
scene.add(movementPlane)
// THREE initialization END Check Point

//CANNON initialization START Check Point
// Setup physicsWorld
physicsWorld = new CANNON.World()
physicsWorld.gravity.set(0, -10, 0)

// Floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({ mass: 0 })
floorBody.addShape(floorShape)
floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
physicsWorld.addBody(floorBody)

// Cube - Visual
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 10, 10)
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x999999 })
cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
cubeMesh.castShadow = true
meshes.push(cubeMesh)
scene.add(cubeMesh)

// Cube Physics
const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
cubeBody = new CANNON.Body({ mass: 5 })
cubeBody.addShape(cubeShape)
cubeBody.position.set(0, 5, 0)
bodies.push(cubeBody)
physicsWorld.addBody(cubeBody)

// Joint body, to later constraint the cube
const jointShape = new CANNON.Sphere(0.1)
jointBody = new CANNON.Body({ mass: 0 })
jointBody.addShape(jointShape)
jointBody.collisionFilterGroup = 0
jointBody.collisionFilterMask = 0
physicsWorld.addBody(jointBody)
//CANNON initialization END Check Point

  // Box - Visual - Experimental
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1, 10, 10)
  const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x999999 })
  boxMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
  boxMesh.castShadow = true
  meshes.push(boxMesh)
  scene.add(boxMesh)

  // Box - Physics - Experimental
  const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
  boxBody = new CANNON.Body({ mass: 5 })
  boxBody.addShape(boxShape)
  boxBody.position.set(2, 5, 0)
  bodies.push(boxBody)
  physicsWorld.addBody(boxBody)





// Raycaster for mouse interaction
raycaster = new THREE.Raycaster()

//Window resize handler
window.onresize = function(){ location.reload() }


//Mouse Click Down Action
window.addEventListener('pointerdown', (event) => {
  // Cast a ray from where the mouse is pointing and
  // see if we hit something
  // const hitPoint = getHitPoint(event.clientX, event.clientY, cubeMesh, camera)
  
  const hitPoint1 = getHitPoint(event.clientX, event.clientY, boxMesh, camera)
  // console.log()

  // Return if the cube wasn't hit
  if (!hitPoint1) { return }

  // Move marker mesh on contact point
  showClickMarker()
  moveClickMarker(hitPoint1)

  // Move the movement plane on the z-plane of the hit
  moveMovementPlane(hitPoint1, camera)

  // Create the constraint between the cube body and the joint body
  // addJointConstraint(hitPoint, cubeBody)
  addJointConstraint(hitPoint1, boxBody)


  // Set the flag to trigger pointermove on next frame so the
  // movementPlane has had time to move
  requestAnimationFrame(() => {
    isDragging = true
  })
})





//Mouse Movement Action
window.addEventListener('pointermove', (event) => {
  if (!isDragging) { return }

  // Project the mouse onto the movement plane
  const hitPoint = getHitPoint(event.clientX, event.clientY, movementPlane, camera)
// console.log(hitPoint)
  if (hitPoint) {
    // Move marker mesh on the contact point
    moveClickMarker(hitPoint)

    // Move the cannon constraint on the contact point
    moveJoint(hitPoint)
  }
})

//Mouse Click Release Action
window.addEventListener('pointerup', () => {
  isDragging = false

  // Hide the marker mesh
  hideClickMarker()

  // Remove the mouse constraint from the physicsWorld
  removeJointConstraint()
})

//Control Functions
function showClickMarker() { clickMarker.visible = true }
function moveClickMarker(position) { clickMarker.position.copy(position) }
function hideClickMarker() { clickMarker.visible = false }

// This function moves the virtual movement plane for the mouseJoint to move in
function moveMovementPlane(point, camera) {
  // Center at mouse position
  movementPlane.position.copy(point)

  // Make it face toward the camera
  movementPlane.quaternion.copy(camera.quaternion)
}

// Returns a hit point if there's a hit with the mesh, --> pass mesh into function
// otherwise returns undefined
function getHitPoint(clientX, clientY, mesh, camera) {
  // Get 3D point form the client x y
  const mouse = new THREE.Vector2()
  mouse.x = (clientX / window.innerWidth) * 2 - 1
  mouse.y = -((clientY / window.innerHeight) * 2 - 1)

  // Get the picking ray from the point
  raycaster.setFromCamera(mouse, camera)

  // Find out if there's a hit
  const hits = raycaster.intersectObject(mesh)
  // console.log(hits)
  // Return the closest hit or undefined
  return hits.length > 0 ? hits[0].point : undefined
}

// Add a constraint between the cube and the jointBody
// in the initeraction position
function addJointConstraint(position, constrainedBody) {
  // Vector that goes from the body to the clicked point
  const vector = new CANNON.Vec3().copy(position).vsub(constrainedBody.position)

  // Apply anti-quaternion to vector to tranform it into the local body coordinate system
  const antiRotation = constrainedBody.quaternion.inverse()
  const pivot = antiRotation.vmult(vector) // pivot is not in local body coordinates

  // Move the cannon click marker body to the click position
  jointBody.position.copy(position)

  // Create a new constraint
  // The pivot for the jointBody is zero
  jointConstraint = new CANNON.PointToPointConstraint(constrainedBody, pivot, jointBody, new CANNON.Vec3(0, 0, 0))

  // Add the constraint to physicsWorld
  physicsWorld.addConstraint(jointConstraint)
}

// This functions moves the joint body to a new postion in space
// and updates the constraint
function moveJoint(position) {
  jointBody.position.copy(position)
  jointConstraint.update()
}

// Remove constraint from physicsWorld
function removeJointConstraint() {
  physicsWorld.removeConstraint(jointConstraint)
  jointConstraint = undefined
}

//Join the physics bodies to the visual bodies - Call from Animate()
function joinMeshesToBodies() {
  for (let i = 0; i !== meshes.length; i++) {
    meshes[i].position.copy(bodies[i].position)
    meshes[i].quaternion.copy(bodies[i].quaternion)
  }
}

//Cannon Debugger
const cannonDebugger = new CannonDebugger(scene, physicsWorld,{
})




//Animate Function
function animate() {
  requestAnimationFrame(animate)
  physicsWorld.fixedStep()  // Step the physics World
  joinMeshesToBodies() //Join Meshes to Bodies
  renderer.render(scene, camera)  // Render three.js
  cannonDebugger.update()
}

animate()