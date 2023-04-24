import './style.css'
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { EaselPlugin } from "gsap/EaselPlugin";
import { TextPlugin } from "gsap/TextPlugin";
import * as THREE from 'three';

gsap.registerPlugin(Flip, EaselPlugin, TextPlugin);

//create three objects
const scene = new THREE.Scene();
const canvasContainer = document.querySelector('#canvasContainer') //Grab canvas Container from document
const sidePanel = document.querySelector('#sidePanel') // add sidePanel to the DOM

//Window resize handler
window.onresize = function(){ 
    location.reload();
}

//create camera object
const camera = new THREE.PerspectiveCamera( 39, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 0.5, 20000 );
camera.position.set(0, 0, -20)
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

//add ambient light source
const light = new THREE.AmbientLight( 0xFFFFFF, 0.5 );
scene.add( light );

//add sun light source
// const sunlight = new THREE.PointLight( 0xFFFFFF, 2, 10000)
// sunlight.castShadow = true;
// scene.add( sunlight )
// sunlight.position.set = (0, 0, 0)

//add cube to the world 
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({color: 0xFF0000})
)
scene.add(cube)



//ANIMATION FUNCTION
function animate() {
  requestAnimationFrame( animate );
  cube.rotation.y += .05
  cube.rotation.z += .01

  renderer.render( scene, camera );
}

animate();