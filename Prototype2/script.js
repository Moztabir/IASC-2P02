import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import * as dat from 'lil-gui';


// Setup
//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}

//**
// Scene */

//Canvas
const canvas = document.querySelector('canvas.webgl');

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('grey');
//Camera
const camera = new THREE.PerspectiveCamera(
    75, sizes.aspectRatio, 0.1, 100);
scene.add(camera);
camera.position.set(0, 0, 5);
//Renderer
const Renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
Renderer.setSize(sizes.width, sizes.height);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//Mesh
// knot
const knotGeometry = new THREE.TorusKnotGeometry(1, 0.4, 100, 16);
const knotMaterial = new THREE.MeshNormalMaterial();
const knot = new THREE.Mesh(knotGeometry, knotMaterial);
scene.add(knot);

//Plane
const planeGeometry = new THREE.PlaneGeometry(10,10, 50, 50);
const planeMaterial = new THREE.MeshBasicMaterial({
    Color: new THREE.Color('white'),
    side: THREE.DoubleSide,
    wireframe: true
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI * 0.5;

scene.add(plane);
/*****
 * UI*
 *****/

//UI
const ui = new dat.GUI();

//ui object
const uiObject = {
    speed: 1,
    distance: 1,
    rotation: 1,  
}

//knot ui
const knotFolder = ui.addFolder('Knot');
knotFolder
    .add(uiObject, 'speed')
    .min(0.1)
    .max(10)
    .step(0.1)
    .name('Speed')

knotFolder
    .add(uiObject, 'distance')
    .min(0.1)
    .max(10)
    .step(0.1)
    .name('Distance')

knotFolder
    .add(uiObject, 'rotation')
    .min(0)
    .max(10)
    .step(0.1)
    .name('Rotation Speed')



//plane ui
const planeFolder = ui.addFolder('Plane');
planeFolder
.add(planeMaterial, 'wireframe')
.name('Toggle Wireframe')


//animation loop
const clock = new THREE.Clock();

const animation = () => {
    //return elapsed time
    const elapsedTime = clock.getElapsedTime();
    // animate knot'
    knot.position.y = Math.sin(elapsedTime * uiObject.speed) * uiObject.distance;
    knot.rotation.y = elapsedTime * uiObject.rotation;
    //update Orbital controls
    controls.update();
    //renderer
    Renderer.render(scene, camera);
    //Request next frame
    window.requestAnimationFrame(animation);
}
animation();
