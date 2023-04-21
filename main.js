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


//window.innerWidth Handler - for differently sized devices
if (window.innerWidth < 1160){
    sidePanel.className = "w-1/2 flex flex-col justify-center px-8"
    canvasContainer.className = "w-3/4"
}else{
    sidePanel.className = "w-1/4 flex flex-col justify-center px-8"
    canvasContainer.className = "w-3/4"
}

//Window resize handler
window.onresize = function(){ 
    location.reload();
}

//create camera object
const camera = new THREE.PerspectiveCamera( 39, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 0.5, 20000 );
camera.position.set(0, 0, 0)
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
const light = new THREE.AmbientLight( 0xFFFFFF, 0.1 );
scene.add( light );

//add sun light source
const sunlight = new THREE.PointLight( 0xFFFFFF, 2, 10000)
sunlight.castShadow = true;
scene.add( sunlight )
// sunlight.position.set = (0, 0, 0)

// add skybox for stars background
let materialArray = [];
let texture_ft = new THREE.TextureLoader().load( '/orbit_images/skybox/space/space_ft.png'); //Grab Texture Files Here
let texture_bk = new THREE.TextureLoader().load( '/orbit_images/skybox/space/space_bk.png');
let texture_up = new THREE.TextureLoader().load( '/orbit_images/skybox/space/space_up.png');
let texture_dn = new THREE.TextureLoader().load( '/orbit_images/skybox/space/space_dn.png');
let texture_rt = new THREE.TextureLoader().load( '/orbit_images/skybox/space/space_rt.png');
let texture_lf = new THREE.TextureLoader().load( '/orbit_images/skybox/space/space_lf.png');
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft })); //add textures to 'materialArray' List
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
for (let i = 0; i < 6; i++)
  materialArray[i].side = THREE.BackSide; //inverse view for skybox to view from inside box
let skyboxGeo = new THREE.BoxGeometry( 20000, 20000, 20000);
let skybox = new THREE.Mesh( skyboxGeo, materialArray );
scene.add( skybox );

//ANIMATION FUNCTION
function animate() {
  requestAnimationFrame( animate );
  skybox.rotation.z += 0.0005
  renderer.render( scene, camera );
}

animate();