import './style.css'
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { EaselPlugin } from "gsap/EaselPlugin";
import { TextPlugin } from "gsap/TextPlugin";
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

gsap.registerPlugin(Flip, EaselPlugin, TextPlugin);

//create three objects - initialize THREE
const scene = new THREE.Scene();
const canvasContainer = document.querySelector('#canvasContainer') //Grab canvas Container from document
const sidePanel = document.querySelector('#sidePanel') // add sidePanel to the DOM

//create physics engine - initialize CANNON
const physicsWorld = new CANNON.World({
  gravity: new CANNON.Vec3(0, 0, 0), //keeping gravity the same as earth!
  // frictionGravity: new CANNON.Vec3(10, 10, 0),
})

// physicsWorld.defaultContactMaterial.contactEquationRelaxation = 3 //default = 3
physicsWorld.defaultContactMaterial.contactEquationStiffness = 1e30 //default 10,000,000
// physicsWorld.defaultContactMaterial.friction = .3 //default = 0.3
// physicsWorld.defaultContactMaterial.frictionEquationRelaxation = 3 //default = 3
// physicsWorld.defaultContactMaterial.frictionEquationStiffness = 10000000 //default = 10,000,000

// let frict = 10
// let rest = 0

// physicsWorld.defaultContactMaterial.materials = [
//   {name: 'default', id: 0, friction: frict, restitution: rest},
//   {name: 'default', id: 0, friction: frict, restitution: rest}
// ]


console.log(physicsWorld.defaultContactMaterial)

//Window resize handler
window.onresize = function(){ 
    location.reload();
}


//create camera object
const camera = new THREE.PerspectiveCamera( 39, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 0.5, 1000 );
camera.position.set(10, 10, -15)
camera.lookAt(0, 0, 0)

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
const controls = new OrbitControls( camera, renderer.domElement )
controls.update()

// add ambient light source
const light = new THREE.AmbientLight( 0xFFFFFF, 0.5 );
scene.add( light );

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
  // linearDamping: .9,
  // angularDamping: .02,
  sleepSpeedLimit: 1,
}) 
groundBody.position.set(0, -.40, .5)
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); //rotate groundBody 90 degrees on X-axis
physicsWorld.addBody(groundBody);
const groundVisualBody = new THREE.Mesh( //visual part of ground
  new THREE.BoxGeometry(groundWidth*2, groundLength*2, groundHeight*2),
  new THREE.MeshNormalMaterial()
)
scene.add(groundVisualBody)
groundVisualBody.position.copy(groundBody.position)
groundVisualBody.quaternion.copy(groundBody.quaternion)

// create block arrays
let blockShape = {W: 0.25, L: 0.75, H: 0.15}
let blockShape2 = {W: 0.75, L: 0.25, H: 0.15}
// let blockPosition = {X: 0, Y: 0, Z: 0}
const blockPhysicsArray = [];
const blockVisualArray = []
//create block function
function createBlock(blockName, blockPosition, blockShape){
  const mass = 0.00001;
    blockName = new CANNON.Body({ //physics part of block
      mass: mass,      
      shape: new CANNON.Box(new CANNON.Vec3(blockShape.L, blockShape.H, blockShape.W)),
    })
    blockName.position.set(blockPosition.X, blockPosition.Y, blockPosition.Z);
    physicsWorld.addBody(blockName)  
    blockPhysicsArray.push(blockName)//add the blocks to List blockPhysicsArray
    blockName = new THREE.Mesh( //visual part of block
    new THREE.BoxGeometry(blockShape.L*2, blockShape.H*2, blockShape.W*2),
    new THREE.MeshNormalMaterial(),
  );
  scene.add(blockName)
  blockVisualArray.push(blockName)//add the visual part of the block to the blockVisualArray list
  }

  //create tower Function
  for(let i = 0; i <= 16; i++){
    let blockLayer = i
    let PosY = i*0.30 + .01 
    if(blockLayer%2 == 0){
      createBlock('block100', {X: 0, Y: PosY, Z: 0}, blockShape)
      createBlock('block100', {X: 0, Y: PosY, Z: .50}, blockShape)
      createBlock('block100', {X: 0, Y: PosY, Z: 1.00}, blockShape)
    }
    else{
      createBlock('block100', {X: 0.50, Y: PosY, Z: .50}, blockShape2)
      createBlock('block100', {X: 0, Y: PosY, Z: .50}, blockShape2)
      createBlock('block100', {X: -.50, Y: PosY, Z: .50}, blockShape2)
    }
  }


  //apply gravity gradually Here
  const settleBLocks = gsap.timeline({})
  settleBLocks.to(physicsWorld.gravity,{
      duration: 5,
      y: -0.1,
      onComplete: () => {
        console.log(physicsWorld.gravity)
    }
  });
  settleBLocks.to(physicsWorld.gravity,{
    duration: 20,
    y: -9.8,
    onComplete: () => {
      console.log(physicsWorld.gravity)
    }
  });

function linkPhysics() {
  for (let i = 0; i < blockPhysicsArray.length; i++){
    blockVisualArray[i].position.copy(blockPhysicsArray[i].position)
    blockVisualArray[i].quaternion.copy(blockPhysicsArray[i].quaternion)
  }
}

const cannonDebugger = new CannonDebugger(scene, physicsWorld,{
})

//ANIMATION FUNCTION
function animate() {
  requestAnimationFrame( animate );
  physicsWorld.fixedStep()
  cannonDebugger.update()
  linkPhysics()
 

  renderer.render( scene, camera );
}

animate();



