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
let gravityMaxValue = -4
let blockSleepSpeed = .2


//create physics engine - initialize CANNON
const physicsWorld = new CANNON.World({
  gravity: new CANNON.Vec3(0, gravityMaxValue, 0), //Ramp Gravity up in Function
})

  //Function to apply visual bodies to physics bodies - call from animate()
function linkPhysics() {
  for (let i = 0; i < blockPhysicsArray.length; i++){
    blockVisualArray[i].position.copy(blockPhysicsArray[i].position)
    blockVisualArray[i].quaternion.copy(blockPhysicsArray[i].quaternion)
  }
}

//ENVIRONMENTAL VARIABLES
physicsWorld.allowSleep = true;
physicsWorld.defaultContactMaterial.contactEquationRestitution = 0.0001 //default = ?
physicsWorld.defaultContactMaterial.contactEquationStiffness = 500000000//default 50,000,000
// physicsWorld.defaultContactMaterial.friction = 0 //default = 0.3
physicsWorld.defaultContactMaterial.frictionEquationRelaxation = 1 //default = 3
physicsWorld.defaultContactMaterial.contactEquationRelaxationTime = 1
// console.log(physicsWorld.defaultContactMaterial)

//Window resize handler
window.onresize = function(){ resetTower() }

//create camera object
const camera = new THREE.PerspectiveCamera( 45, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 0.5, 1000 );
camera.position.set(15, -7, 0)
camera.lookAt(0, -7, 0)
let camPosLookDif = 0

//Grab the Camera Buttons
const buttonLeft = document.getElementById('buttonLeft')
const buttonUp = document.getElementById('buttonUp')
const buttonDown = document.getElementById('buttonDown')
const buttonRight = document.getElementById('buttonRight')
const buttonIn = document.getElementById('buttonIn')
const buttonOut = document.getElementById('buttonOut')
let radialDistance = camera.position.x
let cameraAngle = Math.PI*.785

camera.position.x = radialDistance * Math.cos(cameraAngle)
camera.position.z = radialDistance * Math.sin(cameraAngle)
camera.lookAt(0, camera.position.y + camPosLookDif, 0)

//declare the score sphere position info here
let sphereSize = 1
let scoreBallY = -4
let scoreRadialDistance = 10
let redAngle = 2 * Math.PI * .96
let blueAngle = 2 * Math.PI * .83


//Move Camera Up
repeatWhileMouseOver(buttonUp, moveCameraUp, 5)
function moveCameraUp() {
  camera.position.y += 0.005
  panoMesh.position.y -= 0.005
  camera.lookAt(0, camera.position.y + camPosLookDif, 0)
  buttonUp.className = 'text-green-600 border-4 border-green-600  bg-blue-600 inline-block py-1 rounded-full px-8'
}

//Move Camera Down
repeatWhileMouseOver(buttonDown, moveCameraDown, 5)
function moveCameraDown() {
  camera.position.y -= 0.005
  panoMesh.position.y += 0.005
  camera.lookAt(0, camera.position.y + camPosLookDif, 0)
  buttonDown.className = 'text-green-600 border-4 border-green-600  bg-blue-600 inline-block px-4 py-1 rounded-full px-4'
}

//Move Camera Left
repeatWhileMouseOver(buttonLeft, moveCameraLeft, 20)
function moveCameraLeft() {
  blueAngle += Math.PI/180
  blueDrop.position.x = scoreRadialDistance * Math.cos(blueAngle)
  blueDrop.position.z = scoreRadialDistance * Math.sin(blueAngle)
  redAngle += Math.PI/180
  redDrop.position.x = scoreRadialDistance * Math.cos(redAngle)
  redDrop.position.z = scoreRadialDistance * Math.sin(redAngle)
  cameraAngle += Math.PI/180
  camera.position.x = radialDistance * Math.cos(cameraAngle)
  camera.position.z = radialDistance * Math.sin(cameraAngle)
  camera.lookAt(0, camera.position.y + camPosLookDif, 0)
  buttonLeft.className = 'text-green-600 border-4 border-green-600  bg-blue-600 inline-block px-4 py-1 rounded-full px-6'
}

//Move Camera Right
repeatWhileMouseOver(buttonRight, moveCameraRight, 20)
function moveCameraRight() {
  blueAngle -= Math.PI/180
  blueDrop.position.x = scoreRadialDistance * Math.cos(blueAngle)
  blueDrop.position.z = scoreRadialDistance * Math.sin(blueAngle)
  redAngle -= Math.PI/180
  redDrop.position.x = scoreRadialDistance * Math.cos(redAngle)
  redDrop.position.z = scoreRadialDistance * Math.sin(redAngle)
  cameraAngle -= Math.PI/180
  camera.position.x = radialDistance * Math.cos(cameraAngle)
  camera.position.z = radialDistance * Math.sin(cameraAngle)
  camera.lookAt(0, camera.position.y + camPosLookDif, 0)
  buttonRight.className = 'text-green-600 border-4 border-green-600  bg-blue-600 inline-block px-4 py-1 rounded-full px-4'
}

//Zoom Camera In
repeatWhileMouseOver(buttonIn, moveCameraIn, 10)
function moveCameraIn() {
  if (radialDistance <= 4){ return }
  radialDistance -= 0.02
  //y adjust
  // camera.position.y += 0.01
  camera.position.x = radialDistance * Math.cos(cameraAngle)
  camera.position.z = radialDistance * Math.sin(cameraAngle)
  buttonIn.className = 'text-green-600 border-4 border-green-600  bg-blue-600 inline-block py-1 rounded-full px-8'
}

//Zoom Camera Out
repeatWhileMouseOver(buttonOut, moveCameraOut, 10)
function moveCameraOut() {
  radialDistance += 0.02
  //y adjust
  // camera.position.y -= 0.02
  camera.position.x = radialDistance * Math.cos(cameraAngle)
  camera.position.z = radialDistance * Math.sin(cameraAngle)
  buttonOut.className = 'text-green-600 border-4 border-green-600  bg-blue-600 inline-block py-1 rounded-full px-8'
}

const buttonEnter = document.getElementById('enterButton');
const buttonGithub = document.getElementById('githubButton')


//load state for buttons
const btnDown = 'text-green-600 border-4 border-green-600 bg-yellow-400 inline-block py-1 rounded-full px-4'
const btnLeft = 'text-green-600 border-4 border-green-600 bg-yellow-400 inline-block py-1 rounded-full px-6'
const btnRight = 'text-green-600  border-4 border-green-600 bg-yellow-400 inline-block py-1 rounded-full px-4'
const btnUp = 'text-green-600  border-4 border-green-600 bg-yellow-400 inline-block py-1 rounded-full px-8'
const btnIn = 'text-green-600  border-4 border-green-600 bg-yellow-400 inline-block py-1 rounded-full px-8'
const btnOut = 'text-green-600  border-4 border-green-600 bg-yellow-400 inline-block py-1 rounded-full px-8'
const btnEnter = 'text-green-600 bg-yellow-400 font-bold text-center border-4 border-green-600 inline-block text-2xl px-4 rounded-full'
const btnGithub = 'text-green-600 bg-yellow-400 font-bold text-center border-4 border-green-600 inline-block text-2xl px-4 rounded-full'

//send classes to html
buttonDown.className = btnDown
buttonLeft.className = btnLeft
buttonRight.className = btnRight
buttonUp.className = btnUp
buttonIn.className = btnIn
buttonOut.className = btnOut
buttonEnter.className = btnEnter
buttonGithub.className = btnGithub

repeatWhileMouseOver(buttonEnter, blueEnter, 10)
function blueEnter() {
  enterButton.className = 'text-green-600 bg-blue-600 font-bold text-center border-4 border-green-600 inline-block text-2xl px-4 rounded-full'
}
repeatWhileMouseOver(buttonGithub, blueGithub, 10)
function blueGithub() {
  githubButton.className = 'text-green-600 bg-blue-600 font-bold text-center border-4 border-green-600 inline-block text-2xl px-4 rounded-full'
}

//Hover Controls for Camera Controls
function repeatWhileMouseOver(element, action, milliseconds) {
  var interval = null;
  element.addEventListener('mouseover', function () {
      interval = setInterval(action, milliseconds);
  });

  element.addEventListener('mouseout', function () {
    buttonDown.className = btnDown
    buttonLeft.className = btnLeft
    buttonRight.className = btnRight
    buttonUp.className = btnUp
    buttonIn.className = btnIn
    buttonOut.className = btnOut
    buttonEnter.className = btnEnter
    buttonGithub.className = btnGithub
    clearInterval(interval);
  });
}

document.addEventListener("keypress", function onEvent(event) {
  if (event.key === "a") { moveCameraLeft() }
  else if (event.key === "d") { moveCameraRight() }
  else if (event.key === "w") { moveCameraUp(); moveCameraUp(); moveCameraUp() }
  else if (event.key === "s") { moveCameraDown(); moveCameraDown() }
  else if (event.key === "i") {
    moveCameraIn()
    moveCameraIn()
  }
  else if (event.key === 'o') {
    moveCameraOut()
    moveCameraOut()
  }
  else { return }
});

//clear keydown class calls
document.addEventListener("keyup", function onEvent(envet) {
  buttonDown.className = btnDown
  buttonLeft.className = btnLeft
  buttonRight.className = btnRight
  buttonUp.className = btnUp
  buttonIn.className = btnIn
  buttonOut.className = btnOut
})

//create renderer
const renderer = new THREE.WebGLRenderer(
    {
    antialias: true,
    canvas: document.querySelector('canvas'),
});
renderer.setSize( canvasContainer.offsetWidth, canvasContainer.offsetHeight );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

// add ambient light source
const light = new THREE.AmbientLight( 0xFFFFFF, 0.3 );
scene.add( light );

//add pano as BG
var panoGeometry = new THREE.SphereGeometry( 50, 60, 40 );
  panoGeometry.scale( - 1, 1, 1 );

  var panoMaterial = new THREE.MeshBasicMaterial( {
    map: new THREE.TextureLoader().load( './tower_images/pano.jpg' )
  } );

  var panoMesh = new THREE.Mesh( panoGeometry, panoMaterial );
  panoMesh.position.set(0, 0, 0)
  scene.add( panoMesh );

//Key Light
const gameLight = new THREE.PointLight(0xffffff, .3, 2000)
gameLight.castShadow = true;
gameLight.position.set(-3, 1, 3)
scene.add( gameLight )

//Fill Light
const fillLight = new THREE.PointLight(0xffffff, .1, 2000)
fillLight.castShadow = true;
fillLight.position.set(2, 1, -2)
scene.add( fillLight )

//make a round table top
const tableTexture = new THREE.TextureLoader().load('./tower_images/wood.jpg')
const tableBody = new CANNON.Body({
  shape: new CANNON.Cylinder(5, 5, .25, 50),
  type: CANNON.Body.STATIC
})
tableBody.position.set(0, -10.4, 0)
physicsWorld.addBody(tableBody)
const tableVisualBody = new THREE.Mesh( //visual part of ground
  new THREE.CylinderGeometry(5, 5, .25, 50),
  new THREE.MeshStandardMaterial({
    map: tableTexture
  }),
)
tableVisualBody.receiveShadow = true;
scene.add(tableVisualBody)
tableVisualBody.userData.ground = true;
tableVisualBody.position.copy(tableBody.position)
tableVisualBody.quaternion.copy(tableBody.quaternion)

//make a round table Leg
const tableLegTexture = new THREE.TextureLoader().load('./tower_images/wood.jpg')
const tableLegBody = new CANNON.Body({
  shape: new CANNON.Cylinder(.7, .7, 16, 50),
  type: CANNON.Body.STATIC
})
tableLegBody.position.set(0, -18.4, 0)
physicsWorld.addBody(tableLegBody)
const tableLegVisualBody = new THREE.Mesh( //visual part of ground
  new THREE.CylinderGeometry(.7, .7, 16, 50),
  new THREE.MeshStandardMaterial({
    map: tableTexture
  }),
)
tableLegVisualBody.receiveShadow = true;
scene.add(tableLegVisualBody)
tableLegVisualBody.userData.ground = true;
tableLegVisualBody.position.copy(tableLegBody.position)
tableLegVisualBody.quaternion.copy(tableLegBody.quaternion)

//Drop Markers Make 2 Drop Tile Markers for Scoring Points
const dropSphereGeopmetry = new THREE.SphereGeometry(sphereSize, 15, 15)
const dropRedSphereMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 })
const dropBlueSphereMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff })
let redDrop = new THREE.Mesh(dropSphereGeopmetry, dropRedSphereMaterial)
redDrop.position.set(scoreRadialDistance * Math.cos(redAngle), scoreBallY, scoreRadialDistance * Math.sin(redAngle))
scene.add(redDrop)
let blueDrop = new THREE.Mesh(dropSphereGeopmetry, dropBlueSphereMaterial)
blueDrop.position.set(scoreRadialDistance * Math.cos(blueAngle), scoreBallY, scoreRadialDistance * Math.sin(blueAngle))
scene.add(blueDrop)
blueDrop.userData.name = 'blueDrop'
blueDrop.userData.scorable == true
redDrop.userData.name = 'redDrop'
redDrop.userData.scorable == true
// console.log(scene.children)
// for (let i = 0; i < scene.children.length; i++){
//   console.log(found[i])
// }

////////////////////////////////////////WORKING HERE ///////////////////////////////////////////

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
const wood = new THREE.TextureLoader().load('./tower_images/wood.jpg')

//create block function
function createBlock(blockName, blockPosition, blockShape, blockMeshArray){
  const mass = 0.00001;
    blockName = new CANNON.Body({ //physics part of block
      mass: mass,      
      shape: new CANNON.Box(new CANNON.Vec3(blockShape.L, blockShape.H, blockShape.W)),
      sleepSpeedLimit: blockSleepSpeed,
      angularDamping: 0.9,
      linearDamping: 0.5,
      material: slipperyMaterial,
    })
    blockName.position.set(blockPosition.X, blockPosition.Y, blockPosition.Z);
    physicsWorld.addBody(blockName)  
    blockPhysicsArray.push(blockName)//add the blocks to List blockPhysicsArray
    blockName = new THREE.Mesh( //visual part of block
new THREE.BoxGeometry(blockShape.L*2, blockShape.H*2, blockShape.W*2),
    blockMeshArray
    // new THREE.MeshStandardMaterial({
    //   map: woodTexture
  //   }),
  );
  blockName.castShadow = true;
  // blockName.receiveShadow = true;
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
    let PosY = i*0.30 + .02 - 10
      if(blockLayer%2 == 0){
        let randomBlockName1 = 'logo' + Math.ceil(Math.random()*12)
        const logo1 = new THREE.TextureLoader().load('./tower_images/'+ randomBlockName1 +'.png')
        let randomBlockTopBottom1 = 'topBottomA' + Math.ceil(Math.random()*10)
        const topBottomBlock1 = new THREE.TextureLoader().load('./tower_images/'+ randomBlockTopBottom1 +'.png')
        let randomBlockName2 = 'logo' + Math.ceil(Math.random()*12)
        const logo2 = new THREE.TextureLoader().load('./tower_images/'+ randomBlockName2 +'.png')
        let randomBlockTopBottom2 = 'topBottomA' + Math.ceil(Math.random()*10)
        const topBottomBlock2 = new THREE.TextureLoader().load('./tower_images/'+ randomBlockTopBottom2 +'.png')
        let randomBlockName3 = 'logo' + Math.ceil(Math.random()*12)
        const logo3 = new THREE.TextureLoader().load('./tower_images/'+ randomBlockName3 +'.png')
        let randomBlockTopBottom3 = 'topBottomA' + Math.ceil(Math.random()*10)
        const topBottomBlock3 = new THREE.TextureLoader().load('./tower_images/'+ randomBlockTopBottom3 +'.png')     
        const blockMeshArray1 = [
          new THREE.MeshBasicMaterial( { map: wood }),
          new THREE.MeshBasicMaterial( { map: wood }),
          new THREE.MeshBasicMaterial( { map: topBottomBlock1 }),
          new THREE.MeshBasicMaterial( { map: topBottomBlock2 }),
          new THREE.MeshBasicMaterial( { map: logo1 }),
          new THREE.MeshBasicMaterial( { map: logo1 }),
        ]
        const blockMeshArray2 = [
          new THREE.MeshBasicMaterial( { map: wood }),
          new THREE.MeshBasicMaterial( { map: wood }),
          new THREE.MeshBasicMaterial( { map: topBottomBlock2 }),
          new THREE.MeshBasicMaterial( { map: topBottomBlock3 }),
          new THREE.MeshBasicMaterial( { map: logo2 }),
          new THREE.MeshBasicMaterial( { map: logo2 }),
        ]
        const blockMeshArray3 = [
          new THREE.MeshBasicMaterial( { map: wood }),
          new THREE.MeshBasicMaterial( { map: wood }),
          new THREE.MeshBasicMaterial( { map: topBottomBlock3 }),
          new THREE.MeshBasicMaterial( { map: topBottomBlock1 }),
          new THREE.MeshBasicMaterial( { map: logo3 }),
          new THREE.MeshBasicMaterial( { map: logo3 }),
        ]
        createBlock('block100', {X: 0, Y: PosY, Z: -0.51}, blockShape, blockMeshArray1)
        createBlock('block100', {X: 0, Y: PosY, Z: 0}, blockShape, blockMeshArray2)
        createBlock('block100', {X: 0, Y: PosY, Z: 0.51}, blockShape, blockMeshArray3)
      }
      else{
        let randomBlockName1 = 'logo' + Math.ceil(Math.random()*12)
        const logo1 = new THREE.TextureLoader().load('./tower_images/'+ randomBlockName1 +'.png')
        let randomBlockTopBottom1 = 'topBottomB' + Math.ceil(Math.random()*10)
        const topBottomBlock1 = new THREE.TextureLoader().load('./tower_images/'+ randomBlockTopBottom1 +'.png')
        let randomBlockName2 = 'logo' + Math.ceil(Math.random()*12)
        const logo2 = new THREE.TextureLoader().load('./tower_images/'+ randomBlockName2 +'.png')
        let randomBlockTopBottom2 = 'topBottomB' + Math.ceil(Math.random()*10)
        const topBottomBlock2 = new THREE.TextureLoader().load('./tower_images/'+ randomBlockTopBottom2 +'.png')
        let randomBlockName3 = 'logo' + Math.ceil(Math.random()*12)
        const logo3 = new THREE.TextureLoader().load('./tower_images/'+ randomBlockName3 +'.png')
        let randomBlockTopBottom3 = 'topBottomB' + Math.ceil(Math.random()*10)
        const topBottomBlock3 = new THREE.TextureLoader().load('./tower_images/'+ randomBlockTopBottom3 +'.png')    
        const blockMeshArray1 = [
          new THREE.MeshBasicMaterial( { map: logo1 }),
          new THREE.MeshBasicMaterial( { map: logo1 }),
          new THREE.MeshBasicMaterial( { map: topBottomBlock1 }),
          new THREE.MeshBasicMaterial( { map: topBottomBlock2 }),
          new THREE.MeshBasicMaterial( { map: wood }),
          new THREE.MeshBasicMaterial( { map: wood }),
        ]
        const blockMeshArray2 = [
          new THREE.MeshBasicMaterial( { map: logo2 }),
          new THREE.MeshBasicMaterial( { map: logo2 }),
          new THREE.MeshBasicMaterial( { map: topBottomBlock2 }),
          new THREE.MeshBasicMaterial( { map: topBottomBlock3 }),
          new THREE.MeshBasicMaterial( { map: wood }),
          new THREE.MeshBasicMaterial( { map: wood }),
        ]
        const blockMeshArray3 = [
          new THREE.MeshBasicMaterial( { map: logo3 }),
          new THREE.MeshBasicMaterial( { map: logo3 }),
          new THREE.MeshBasicMaterial( { map: topBottomBlock3 }),
          new THREE.MeshBasicMaterial( { map: topBottomBlock1 }),
          new THREE.MeshBasicMaterial( { map: wood }),
          new THREE.MeshBasicMaterial( { map: wood }),
        ]
        createBlock('block100', {X: 0.51, Y: PosY, Z: 0}, blockShape2, blockMeshArray1)
        createBlock('block100', {X: 0, Y: PosY, Z: 0}, blockShape2, blockMeshArray2)
        createBlock('block100', {X: -.51, Y: PosY, Z: 0}, blockShape2, blockMeshArray3)
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

//Block stay asleep until nudged - results in a bug. KEEP WORKING ON THIS BUG
function wakeUpBlocks(){ 
  for (let i = 0; i < blockPhysicsArray.length; i++){
    // if(i > 41){ 
      // physicsWorld.allowSleep = false
      // blockPhysicsArray[i].speepSpeedLimit = 0   
      blockPhysicsArray[i].sleepState = 0
    // }
  }
}
// setInterval(() => { wakeUpBlocks() }, sleepInterval);

//resets tower 
const resetButton = document.getElementById('button1') //Grab button1 from html
function resetTower() {
  physicsWorld.gravity.set(0, -10, 0)
  for (let i = 0; i < blockPhysicsArray.length; i++){
    let randoX = (Math.random()-.5) * .0005
    let randoZ = (Math.random()-.5) * .0005
    let randoY = (Math.random()) * .0002
    blockPhysicsArray[i].applyImpulse(new CANNON.Vec3(randoX, randoY, randoZ), new CANNON.Vec3(0, 0, 0));
  }
setTimeout( function() { location.reload() }, 2000 ) 
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
// function getCenterPoint(mesh) {
//   var geometry = mesh.geometry;
//   geometry.computeBoundingBox();
//   var center = new THREE.Vector3();
//   geometry.boundingBox.getCenter( center );
//   mesh.localToWorld( center );
//   return center;
// }

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
var scorable = new THREE.Object3D();
var holdingTile = false;


let jointConstraint
let currentBody
let isDragging = false
let redScore = false
// Initialize & allow gameplay after tiles have settled down

window.addEventListener('pointerdown', event => {
  clickMouse.x = ((event.clientX - sidePanel.offsetWidth) / canvasContainer.offsetWidth) * 2 - 1;
  clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera( clickMouse, camera );
  const found = raycaster.intersectObjects( scene.children );
  if (found.length > 0 && found[0].object.userData.draggable){
    wakeUpBlocks() //Make a call to the wakeUpBlocks Function
    draggable = found[0].object
    draggable.material.transparent = true;
    draggable.material.opacity = 0.5;
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

// function resetScoreBubble() {
//   for (let i = 0; i < scene.children.length; i++){
//     if (scene.children[i].material){
//       scene.children[i].material.opacity = 1.0;
//     }
//   }
// }

  let redDroppability = false
  let blueDroppability = false


  //Mouse Movement Action
  window.addEventListener('pointermove', (event) => {
    if (!isDragging) { return }
    const hitPoint = getHitPoint(event.clientX, event.clientY, movementPlane, camera)
    if (hitPoint) {

      clickMouse.x = ((event.clientX - sidePanel.offsetWidth) / canvasContainer.offsetWidth) * 2 - 1;
      clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera( clickMouse, camera );
      const found = raycaster.intersectObjects( scene.children );
      wakeUpBlocks()
      moveClickMarker(hitPoint)
      moveJoint(hitPoint)
    }
  })
  
  //When Release Mouse Clicker, show tile that's being dropped
  window.addEventListener('pointerup', event => {
    isDragging = false
    clickMarker.visible = false; 
    wakeUpBlocks()
    removeJointConstraint()
    if (holdingTile == true){

      clickMouse.x = ((event.clientX - sidePanel.offsetWidth) / canvasContainer.offsetWidth) * 2 - 1;
      clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera( clickMouse, camera );
      const found = raycaster.intersectObjects( scene.children );

      for(let i = 0; i < found.length; i++){
        if (found[i].object == redDrop && !redDroppability){
          redDroppability = true;
        }
        if (found[i].object == blueDrop && !blueDroppability){
          blueDroppability = true;
      };
    }
      if ( redDroppability == true ){
        draggable.geometry.dispose
        draggable.material.dispose
        scene.remove( draggable )
        setTimeout(function(){
          redDroppability = false
        }, 10)
        console.log('Red Scores!')
      }

      if ( blueDroppability == true ){
        draggable.geometry.dispose
        draggable.material.dispose
        scene.remove( draggable )
        setTimeout(function(){
          blueDroppability = false
        }, 10)
        console.log('Blue Scores')
      }





      movementPlane.position.copy(0, 0, 0) //reposition movementPlane out of the way
      holdingTile = false;
      return;
    }
  })

  /////////////////// MODIFY THIS FUNCTION TO ADD SCORING////////////////////////////



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



