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
  gravity: new CANNON.Vec3(0, -9.8, 0) //keeping gravity the same as earth YAY!
})

//Window resize handler
window.onresize = function(){ 
    location.reload();
}

//create camera object
const camera = new THREE.PerspectiveCamera( 39, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 0.5, 1000 );
camera.position.set(0, 7, -5)
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

//add ambient light source
const light = new THREE.AmbientLight( 0xFFFFFF, 0.5 );
scene.add( light );

//add sun light source
// const sunlight = new THREE.PointLight( 0xFFFFFF, 2, 10000)
// sunlight.castShadow = true;
// scene.add( sunlight )
// sunlight.position.set = (0, 50, 220)

// add ground bodu to the static plane
const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC, // infinite geometric plane
  shape: new CANNON.Plane()
}) 
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); //rotate groundBody 90 degrees on X-axis
physicsWorld.addBody(groundBody);


const blockPhysicsArray = [];
const blockVisualArray = []
//create block function
function createBlock(blockName, x, y, z){
  const blockWidth = .25;
  const blockLength = .75;
  const blockHeight = .15;
  const mass = 5;
    blockName = new CANNON.Body({ //physics part of block
      mass: mass,
      shape: new CANNON.Box(new CANNON.Vec3(blockLength, blockHeight, blockWidth)),
    })
    blockName.position.set(x, y, z);
    physicsWorld.addBody(blockName)   
    blockPhysicsArray.push(blockName)//add the blocks to List blockPhysicsArray

    blockName = new THREE.Mesh( //visual part of block
    new THREE.BoxGeometry(blockLength*2, blockHeight*2, blockWidth*2),
    new THREE.MeshNormalMaterial(),
  );
  scene.add(blockName)
  blockVisualArray.push(blockName)

  }

createBlock('block100', 0, 0, 0)
createBlock('block200', 0, 0, .51)
createBlock('block200', 0, 0, 1.02)

console.log(blockPhysicsArray, blockVisualArray)


function linkPhysics() {
  for (let i = 0; i < blockPhysicsArray.length; i++){
    // console.log(blockPhysicsArray[i], blockVisualArray[i])
    blockVisualArray[i].position.copy(blockPhysicsArray[i].position)
    blockVisualArray[i].quaternion.copy(blockPhysicsArray[i].quaternion)
  }
}




//create and add sphere to world at y=10
// const blockWidth = .25;
// const blockLength = .75;
// const blockHeight = .15;
// const blockPhysicsBody = new CANNON.Body({ //physics part of sphere
//   mass: 5,
//   shape: new CANNON.Box(new CANNON.Vec3(blockLength, blockHeight, blockWidth)),
// })
// blockPhysicsBody.position.set(0, 7, 0);
// physicsWorld.addBody(blockPhysicsBody)
// const sphereVisualBody = new THREE.Mesh( //visual part of sphere
//   new THREE.SphereGeometry(radius),
//   new THREE.MeshNormalMaterial(),
// );
// scene.add(sphereVisualBody)





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



