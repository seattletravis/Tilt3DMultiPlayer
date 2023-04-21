import * as THREE from 'three';
import gsap from 'gsap';

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

//create planet Function - (size of planet, texture name, position)
function createPlanet(size, texture, position){
    const structure = new THREE.SphereGeometry(size, 60, 60);
    const material = new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load('/orbit_images/'+ texture)
    });
    const mesh = new THREE.Mesh(structure, material);
    const orb = new THREE.Object3D();
    orb.add(mesh);
    scene.add(orb);
    mesh.position.x = position;
    orb.position.x = position-15;
    return {mesh, orb}
}

//create MOON
const moon = createPlanet(2, 'Gaseous1.png', 30)
moon.mesh.castShadow = true;
moon.mesh.receiveShadow = true;

// create SUN
const sun = new THREE.Mesh(
    new THREE.SphereGeometry(10, 60, 60), 
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('/orbit_images/sun.jpg')
    })
)
sun.position.set(0, 0, 0) //Set sun position (x, y, z)
scene.add( sun ); //Add sun to scene

// create PLANET
const planet = new THREE.Mesh(
    new THREE.SphereGeometry(5, 60, 60),
    new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load('/orbit_images/Alpine.png')
    })
)
planet.castShadow = true;
planet.receiveShadow = true;
planet.position.set(10, 0, 0);
scene.add(planet);
//set PLANET ORBIT
function orbitPlanet(t){ //Orbit function for planet1
    let x = 225 * Math.cos(2*Math.PI*(t))
    let z = 225 * Math.sin(2*Math.PI*(t))
    sun.position.x = x
    sun.position.z = z
    sunlight.position.x = x
    sunlight.position.z = z
    if (arrived == false && inMotion == false){ //set coordinates for ARRIVED STATE <-----
        camera.position.x = -4175;
        camera.position.y = -17;
        camera.position.z = -90;
        camera.lookAt(-4200, -40, 0)
        // camera.rotation.z = Math.PI;
    
    } else if (arrived == true && inMotion == false){ //set coordinates for AWAY STATE
        camera.position.z = z - 50;
        // camera.position.x = 100;
        camera.lookAt(0, 0, 0)
    } else if (arrived == false && inMotion ==true){
        camera.position.z = z - 50
    } else{
        // camera.position.x = x;
        // camera.position.y = 50;
        // camera.position.z = 0;
    }
}

// create PLANET2
const planet2 = new THREE.Mesh(
    new THREE.SphereGeometry(18, 60, 60), 
    new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load('/orbit_images/Gaseous4.png')
    })
)
planet2.castShadow = true;
// planet2.receiveShadow = true;
planet2.position.set(-4200, -40, 0) //Set planet position (x, y, z)
scene.add( planet2 ); //Add planet2 to scene

//create PLANET2MOON1
const planet2Moon = new THREE.Mesh(
    new THREE.SphereGeometry(2, 60, 60),
    new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load('/orbit_images/Volcanic.png')
    })
)
// planet2Moon.castShadow = true;
planet2Moon.receiveShadow = true;
scene.add( planet2Moon )
// set PLANET2MOON1 ORBIT
function orbitPlanet2Moon(t){
    t = t*.5
let p2x = 80 * Math.cos(2*Math.PI*(t)) -4200
let p2y = -40
let p2z = 80 * Math.sin(2*Math.PI*(t))
planet2Moon.position.set(p2x, p2y, p2z)
}

// create PLANET2MOON2
const planet2Moon2 = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 60, 60),
    new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load('/orbit_images/Swamp.png')
    })
)
// planet2Moon2.castShadow = true;
planet2Moon2.receiveShadow = true;
scene.add( planet2Moon2 )
//set PLANET2MOON2 ORBIT
function orbitPlanet2Moon2(t){
    t = t*.8
let p2x = 130 * Math.cos(2*Math.PI*(t)-50) -4200
let p2y = 10 * Math.sin(2*Math.PI*(t)) -40
let p2z = 130 * Math.sin(2*Math.PI*(t)-50)
planet2Moon2.position.set(p2x, p2y, p2z)
}

// create PLANET2MOON3
const planet2Moon3 = new THREE.Mesh(
    new THREE.SphereGeometry(6, 60, 60),
    new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load('/orbit_images/Gaseous1.png')
    })
)
// planet2Moon3.castShadow = true;
planet2Moon3.receiveShadow = true;
scene.add( planet2Moon3 )
//set PLANET2MOON2 ORBIT
function orbitPlanet2Moon3(t){
    t = t*.2
let p2x = 230 * Math.cos(2*Math.PI*(t)-50) -4200
let p2y = 40 * Math.sin(2*Math.PI*(t)) -40
let p2z = 230 * Math.sin(2*Math.PI*(t)-50)
planet2Moon3.position.set(p2x, p2y, p2z)
}

//declare variables
var toPlanet2 = gsap.timeline();
let time = 0;
let inMotion = false;
let arrived = false;
var travelToAnimation = gsap.timeline();

const button1 = document.getElementById('button1')
button1.addEventListener("click", TravelToPlanet1)

const button2 = document.getElementById('button2')
button2.addEventListener("click", travelToPlanet2)

const engineStatus = document.getElementById('engineStatus')
const shipStatus1 = document.getElementById('shipStatus1')
const shipStatus2 = document.getElementById('shipStatus2')


//Travel to Planet 1 function - Fly toward Sun
function TravelToPlanet1(){
    if (arrived == false && inMotion == false){ //Fly toward sun
        engineStatus.innerHTML = "ENGINE: ENGAGED"
        engineStatus.className = "text-red-600 px-8"
        shipStatus1.innerHTML = "HEADING:"
        shipStatus2.innerHTML = "TRAVIS-CENTAURI"
        gsap.to(button1, {y: -100, duration: 10})
        gsap.to(button2, {y: 100, duration: 10})
        gsap.to(button1, {backgroundColor: "rgba(67, 160, 71, 0", duration: 10})
        gsap.to(button2, {backgroundColor: "rgba(67, 160, 71, 100", duration: 10})
        travelToAnimation.to(camera.position,{
            x: -4600,
            y: -40,
            z: 10,
            duration: 2,
            onUpdate: function(){
                camera.lookAt(-4200, -40, 0)
            }
        })
        inMotion = true;
        travelToAnimation.to(camera.position,{
            x: 100,
            duration: 9.5,
            onUpdate: function(){
                camera.lookAt(0, 0, 0)
            }, 
            onComplete: function(){
                inMotion = false;
                arrived = true;
                engineStatus.innerHTML = "ENGINE: READY"
                engineStatus.className = "text-green-600 px-8"
                shipStatus1.innerHTML = "ARRIVED:"
                shipStatus2.innerHTML = "TRAVIS-CENTAURI"
                setTimeout( function(){
                    shipStatus1.innerHTML = "STATUS: READY"
                    shipStatus2.innerHTML = "..."
                }, 1000);

            },       
        })  
    } else if (inMotion == false && arrived == true) {
        shipStatus2.innerHTML = "CURRENTLY AT TRAVIS-CENTAURI"
        setTimeout( function(){
            shipStatus2.innerHTML = "PLEASE SELECT A DESTINATION"
        }, 1000);
        setTimeout( function(){
            shipStatus2.innerHTML = "..."
        }, 2000);
    }
}
    
//Travel to Planet 2 Function
function travelToPlanet2(){
    if(arrived == true && inMotion == false){ //Fly away from  Sun
        engineStatus.innerHTML = "ENGINE: ENGAGED"
        engineStatus.className = "text-red-600 px-8"
        shipStatus1.innerHTML = "HEADING:"
        shipStatus2.innerHTML = "TRAVIS-PRIME"
        button1.className = "text-white bg-black bg-opacity-0 inline-block px-4 py-1 rounded-full"
        button2.className = "text-white bg-black bg-opacity-0 inline-block px-4 py-1 rounded-full"
        inMotion = true;
        gsap.to(button1, {y: 0, duration: 10})
        gsap.to(button2, {y: 0, duration: 10})
        gsap.to(button1, {backgroundColor: "rgba(67, 160, 71, 100", duration: 10})
        gsap.to(button2, {backgroundColor: "rgba(67, 160, 71, 0", duration: 10})
        toPlanet2.to(camera.position, {
            x: 1000,
            y: 0,
            z: 0,
            duration: 2,
            onUpdate: function(){
                camera.lookAt(0 ,0 ,0)
            }, 
        })
        toPlanet2.to(camera.position,{
            x: -4300,
            y: 50,
            z: -40,
            duration:9.5,
            onUpdate: function(){
                camera.lookAt(-4200 ,-40 ,0)
            }, 
        })
        toPlanet2.to(camera.position, { // <-------
            x: -4175,
            y: -17,
            z: -90,
            duration: 3,
            onUpdate: function(){
                camera.lookAt(-4200 ,-40 ,0)
            },    
            onComplete: function(){
                inMotion = false;
                arrived = false;
                engineStatus.innerHTML = "ENGINE: READY"
                engineStatus.className = "text-green-600 px-8"
                shipStatus1.innerHTML = "ARRIVED:"
                shipStatus2.innerHTML = "TRAVIS-PRIME"
                setTimeout( function(){
                    shipStatus1.innerHTML = "STATUS: READY"
                    shipStatus2.innerHTML = "..."
                }, 1000);
            },
        })
    }else if (inMotion == false && arrived == false) {
        shipStatus2.innerHTML = "CURRENTLY AT TRAVIS-PRIME"
        setTimeout( function(){
            shipStatus2.innerHTML = "PLEASE SELECT A DESTINATION"
        }, 1000);
        setTimeout( function(){
            shipStatus2.innerHTML = "..."
        }, 2000);
    }

}





//ANIMATION FUNCTION
function animate() {
    requestAnimationFrame( animate );
    moon.mesh.rotation.y += 0.03
    planet.rotation.y += 0.03

    skybox.rotation.z += 0.0005
    moon.orb.rotation.y += 0.005
    
    time += 0.001
    orbitPlanet(time)
    orbitPlanet2Moon(time)
    orbitPlanet2Moon2(time)
    orbitPlanet2Moon3(time)
    planet2.rotation.y -= 0.005

    planet2Moon.rotation.y += 0.03
    planet2Moon2.rotation.y -= 0.01
    planet2Moon3.rotation.y += 0.02
    

    sun.rotation.y += 0.01
    // controls.update();
    
    renderer.render( scene, camera );
    

}

animate();