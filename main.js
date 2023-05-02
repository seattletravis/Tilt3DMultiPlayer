import './style.css'
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { EaselPlugin } from "gsap/EaselPlugin";
import { TextPlugin } from "gsap/TextPlugin";
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
// import CannonDebugger from 'cannon-es-debugger';
// import { space } from 'postcss/lib/list';
// import { TweenMax } from 'gsap/gsap-core';

gsap.registerPlugin(Flip, EaselPlugin, TextPlugin);

//create three objects - initialize THREE
const scene = new THREE.Scene();
const canvasContainer = document.querySelector('#canvasContainer') //Grab canvas Container from document
const sidePanel = document.querySelector('#sidePanel') // add sidePanel to the DOM

let gravityMaxValue = -3
//create physics engine - initialize CANNON
const physicsWorld = new CANNON.World({
  gravity: new CANNON.Vec3(0, gravityMaxValue, 0), //Ramp Gravity up in Function
})

// const gameStatus1 = document.getElementById('gameStatus1')
// const gameStatus2 = document.getElementById('gameStatus2')

  //Function to apply visual bodies to physics bodies - call from animate()
function linkPhysics() {
  for (let i = 0; i < blockPhysicsArray.length; i++){
    blockVisualArray[i].position.copy(blockPhysicsArray[i].position)
    blockVisualArray[i].quaternion.copy(blockPhysicsArray[i].quaternion)
  }
}

//ENVIRONMENTAL VARIABLES
physicsWorld.allowSleep = true;
// physicsWorld.defaultContactMaterial.contactEquationRelaxation = 3 //default = 3
physicsWorld.defaultContactMaterial.contactEquationStiffness = 1e7 //default 10,000,000
// physicsWorld.defaultContactMaterial.friction = .3 //default = 0.3
// physicsWorld.defaultContactMaterial.frictionEquationRelaxation = 3 //default = 3
// physicsWorld.defaultContactMaterial.frictionEquationStiffness = 10000000 //default = 10,000,000
physicsWorld.defaultContactMaterial.contactEquationRelaxationTime = 3
// let frict = 10
// let rest = 0
// physicsWorld.defaultContactMaterial.materials = [
//   {name: 'default', id: 0, friction: frict, restitution: rest},
//   {name: 'default', id: 0, friction: frict, restitution: rest}
// ]
// console.log(physicsWorld.defaultContactMaterial)

//Window resize handler
window.onresize = function(){ 
    resetTower()
}

//create camera object
const camera = new THREE.PerspectiveCamera( 50, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 0.5, 1000 );
camera.position.set(10, 2, 0)
camera.lookAt(0, 2, 0)

//create renderer
const renderer = new THREE.WebGLRenderer(
    {
    antialias: true,
    canvas: document.querySelector('canvas'),
});
renderer.setSize( canvasContainer.offsetWidth, canvasContainer.offsetHeight );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

//initialize OrbitControls
// const controls = new OrbitControls( camera, renderer.domElement )
// controls.update()

// add ambient light source
const light = new THREE.AmbientLight( 0xFFFFFF, 0.5 );
scene.add( light );

//add nice background Image
const spaceTexture = new THREE.TextureLoader().load('./tower_images/skybox/space2/corona_dn.png')
scene.background = spaceTexture


//add sun light source
// const sunlight = new THREE.PointLight( 0xFFFFFF, 2, 10000)
// sunlight.castShadow = true;
// scene.add( sunlight )
// sunlight.position.set = (0, 10, 220)

// add ground body to the static plane
let groundWidth = 1
let groundHeight = 0.25
let groundLength = 1

const groundBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(groundWidth, groundLength, groundHeight)),
  type: CANNON.Body.STATIC, // infinite geometric plane
  // sleepSpeedLimit: 10, //SLEEP SPEED LIMIT FOR TABLE
}) 
groundBody.position.set(0, -.40, .5)
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); //rotate groundBody 90 degrees on X-axis
physicsWorld.addBody(groundBody);
const groundVisualBody = new THREE.Mesh( //visual part of ground
  new THREE.BoxGeometry(groundWidth*2, groundLength*2, groundHeight*2),
  new THREE.MeshNormalMaterial()
)
scene.add(groundVisualBody)
groundVisualBody.userData.ground = true;
groundVisualBody.position.copy(groundBody.position)
groundVisualBody.quaternion.copy(groundBody.quaternion)


// Click marker (Sphere) to be shown on interaction
const markerGeometry = new THREE.SphereGeometry(0.08, 8, 8)
const markerMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 })
let clickMarker = new THREE.Mesh(markerGeometry, markerMaterial)
clickMarker.visible = false // Hide it..
scene.add(clickMarker)

// Movement plane when dragging
const planeGeometry = new THREE.PlaneGeometry(100, 100)
const floorMaterial = new THREE.MeshStandardMaterial()
let movementPlane = new THREE.Mesh(planeGeometry, floorMaterial)
movementPlane.visible = false // Hide it..
scene.add(movementPlane)

// create block arrays
let blockShape = {W: 0.25, L: 0.75, H: 0.15};
let blockShape2 = {W: 0.75, L: 0.25, H: 0.15};
const blockPhysicsArray = [];
const blockVisualArray = [];
const slipperyMaterial = new CANNON.Material();
const woodTexture = new THREE.TextureLoader().load('./tower_images/wood.jpg')
//create block function
function createBlock(blockName, blockPosition, blockShape){
  const mass = 0.00001;
    blockName = new CANNON.Body({ //physics part of block
      mass: mass,      
      shape: new CANNON.Box(new CANNON.Vec3(blockShape.L, blockShape.H, blockShape.W)),
      // sleepSpeedLimit: .006, //SLEEP SPEED LIMIT FOR BLOCKS
      angularDamping: .99,
      material: slipperyMaterial,
    })
    blockName.position.set(blockPosition.X, blockPosition.Y, blockPosition.Z);
    physicsWorld.addBody(blockName)  
    blockPhysicsArray.push(blockName)//add the blocks to List blockPhysicsArray
    blockName = new THREE.Mesh( //visual part of block
    new THREE.BoxGeometry(blockShape.L*2, blockShape.H*2, blockShape.W*2),
    new THREE.MeshStandardMaterial({
      map: woodTexture
    }),
    
  );
  scene.add(blockName)
  blockName.userData.draggable = true;
  blockVisualArray.push(blockName)//add the visual part of the block to the blockVisualArray list
}

const blockToBlockContact = new CANNON.ContactMaterial(
  slipperyMaterial,
  slipperyMaterial,
  {friction: 0.01}
)

physicsWorld.addContactMaterial(blockToBlockContact);

//create tower Function - makes calls to createBlock()
for(let i = 0; i <= 17; i++){ //use i <= 17 for 54 blocks
  let blockLayer = i
  let PosY = i*0.30 + .01 
  if(blockLayer%2 == 0){
    createBlock('block100', {X: 0, Y: PosY, Z: 0}, blockShape)
    createBlock('block100', {X: 0, Y: PosY, Z: .505}, blockShape)
    createBlock('block100', {X: 0, Y: PosY, Z: 1.01}, blockShape)
  }
  else{
    createBlock('block100', {X: 0.51, Y: PosY, Z: .50}, blockShape2)
    createBlock('block100', {X: 0, Y: PosY, Z: .50}, blockShape2)
    createBlock('block100', {X: -.51, Y: PosY, Z: .50}, blockShape2)
  }
}

//give all the tiles names in their THREE.userData
for (let i = 1; i < scene.children.length; i++){
  if (scene.children[i].userData.draggable == true){
    scene.children[i].userData.name = 'tile'+ i
  }
}

//Change all the CANNON.id for the block bodies to the same name as the THREE.userData.name 
for (let i = 0; i < blockPhysicsArray.length; i++){
  blockPhysicsArray[i].id = blockVisualArray[i].userData.name
}

//Return blockBody when from blockMesh 
function getBody(meshUserName){
  let blockName = meshUserName.userData.name
  let blockId = blockPhysicsArray.find(x=> x.id === blockName)
  return blockId
}


// function wakeUpBlocks(){
//   for (let i = 0; i < blockPhysicsArray.length; i++){
//     if(i > 44){    
//       blockPhysicsArray[i].applyImpulse(new CANNON.Vec3(0, .0000001, 0), new CANNON.Vec3(0, 0, 0));
//     }
//   }
//   physicsWorld.allowSleep = false
// }

function zeroOutVelocities(){
  for (let i = 0; i < blockPhysicsArray.length; i++){  
      blockPhysicsArray[i].velocity.set(0,0,0)
  }
}

//resets tower 
const resetButton = document.getElementById('button1') //Grab button1 from html
function resetTower() {
  gsap.killTweensOf(physicsWorld.gravity)
  gameStatus1.className = "text-red-500 px-8"
  gameStatus2.className = "text-red-500 px-8"
  gameStatus1.innerText = 'STATUS: GAME OVER'
  gameStatus2.innerText = 'RESETTING....'
  gsap.killTweensOf(physicsWorld.gravity);
  physicsWorld.gravity.set(0, -10, 0)
  for (let i = 0; i < blockPhysicsArray.length; i++){
    let randoX = (Math.random()-.5) * .0005
    let randoZ = (Math.random()-.5) * .0005
    let randoY = (Math.random()) * .0002
    blockPhysicsArray[i].applyImpulse(new CANNON.Vec3(randoX, randoY, randoZ), new CANNON.Vec3(0, 0, 0));
  }
setTimeout( function() { location.reload() }, 2000 ) //reset tower - 2 seconds to watch animation. 
}
resetButton.addEventListener('click', function(){ //give Button functionality - BUTTON ARMED
  resetTower()
})

//Get the point where raycaster hits the object
function getHitPoint(clientX, clientY, mesh, camera) {
  const mouse = new THREE.Vector2()
  mouse.x = ((clientX - sidePanel.offsetWidth) / canvasContainer.offsetWidth) * 2 - 1
  mouse.y = -((clientY / window.innerHeight) * 2 - 1)
  raycaster.setFromCamera(mouse, camera)  // Get the picking ray from the point
  const hits = raycaster.intersectObject(mesh)  // Find out if there's a hit
  return hits.length > 0 ? hits[0].point : undefined // Return the closest hit or undefined
}

//Control function - moveClickMarker
function moveClickMarker(position) { clickMarker.position.copy(position) }

//Control function - moveJoint
function moveJoint(position){
  jointBody.position.copy(position)
  jointConstraint.update()
}

//Control function - moveMovementPlane
function moveMovementPlane(point, camera){
  movementPlane.position.copy(point)
  movementPlane.quaternion.copy(camera.quaternion)
}

//Get Center Point for PointToPointConstaint Function
function getCenterPoint(mesh) {
  var geometry = mesh.geometry;
  geometry.computeBoundingBox();
  var center = new THREE.Vector3();
  geometry.boundingBox.getCenter( center );
  mesh.localToWorld( center );
  return center;
}

// Joint body, to later constraint the cube
let jointBody
const jointShape = new CANNON.Sphere(0.1)
jointBody = new CANNON.Body({ mass: 0 })
jointBody.addShape(jointShape)
jointBody.collisionFilterGroup = 0
jointBody.collisionFilterMask = 0
physicsWorld.addBody(jointBody)

//Joint Constraint Function Here - Must pass in a Cannon Object for constraineBody
function addJointConstraint(position, constrainedBody) {  // Vector that goes from the body to the clicked point
  const vector = new CANNON.Vec3().copy(position).vsub(constrainedBody.position)
  // Apply anti-quaternion to vector to tranform it into the local body coordinate system
  const antiRotation = constrainedBody.quaternion.inverse()
  const pivot = antiRotation.vmult(vector) // pivot is not in local body coordinates
  // Move the cannon click marker body to the click position
  jointBody.position.copy(position)
  // The pivot for the jointBody is zero  -  Create a new constraint
  jointConstraint = new CANNON.PointToPointConstraint(constrainedBody, pivot, jointBody, new CANNON.Vec3(0, 0, 0))
  // Add the constraint to physicsWorld
  physicsWorld.addConstraint(jointConstraint)
}

function removeJointConstraint(){
  physicsWorld.removeConstraint(jointConstraint)
  jointConstraint = undefined
}

//declare const for raycasting
const raycaster = new THREE.Raycaster();
const clickMouse = new THREE.Vector2();
const moveMouse = new THREE.Vector2();
var draggable = new THREE.Object3D();
var holdingTile = false;


let jointConstraint
let currentBody
let isDragging = false
// Initialize & allow gameplay after tiles have settled down

window.addEventListener('pointerdown', event => {
  clickMouse.x = ((event.clientX - sidePanel.offsetWidth) / canvasContainer.offsetWidth) * 2 - 1;
  clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera( clickMouse, camera );
  const found = raycaster.intersectObjects( scene.children );
  if (found.length > 0 && found[0].object.userData.draggable){
    // if(physicsWorld.allowSleep == true){ wakeUpBlocks() }
    // wakeUpBlocks()
    draggable = found[0].object
    physicsWorld.gravity.set(0, -1, 0)
    holdingTile = true;
    const hitPoint = getHitPoint(event.clientX, event.clientY, draggable, camera)
    if (!hitPoint){ return }
    clickMarker.visible = true; //showClickMarker Function
    moveClickMarker(hitPoint) //moveClickMarker Function
    moveMovementPlane(hitPoint, camera)
    currentBody = getBody(draggable)
    addJointConstraint(hitPoint, currentBody) //This function needs a Body
    requestAnimationFrame(() => {
      isDragging = true
    })
  }
})

  //Mouse Movement Action
  window.addEventListener('pointermove', (event) => {
    if (!isDragging) { return }
    // Project the mouse onto the movement plane
    const hitPoint = getHitPoint(event.clientX, event.clientY, movementPlane, camera)
    if (hitPoint) {
      // Move marker mesh on the contact point
      moveClickMarker(hitPoint)
      // Move the cannon constraint on the contact point
      moveJoint(hitPoint)
    }
  })
  
  //When Release Mouse Clicker, show tile that's being dropped
  window.addEventListener('pointerup', event => {
    isDragging = false
    clickMarker.visible = false; 
    physicsWorld.gravity.y = gravityMaxValue
    removeJointConstraint()
    if (holdingTile == true){
      movementPlane.position.copy(0, 0, 0) //reposition movementPlane out of the way
      holdingTile = false;
      return;
    }
  })

//Move Objects
window.addEventListener('mousemove', event => {
    moveMouse.x = ((event.clientX - sidePanel.offsetWidth) / canvasContainer.offsetWidth) * 2 - 1;
    moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
})

//Cannon Debugger
// const cannonDebugger = new CannonDebugger(scene, physicsWorld,{
// })

//ANIMATION FUNCTION
function animate() {
  requestAnimationFrame( animate );
  physicsWorld.fixedStep()
  // cannonDebugger.update()
  linkPhysics()
  renderer.render( scene, camera );
}

animate();



