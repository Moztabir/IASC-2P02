import * as THREE from 'three';
import * as dat from 'lil.gui';
import { OrbitControls } from 'OrbitControls';


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
// test sphere
const sphereGeometry = new THREE.SphereGeometry(1);
const sphereMaterial = new THREE.MeshNormalMaterial();
const testsphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(testsphere);
testsphere.position.set = (0, 0, -5);

/*****
 * UI*
 *****/

//UI
const ui = new dat.GUI();


//animation loop
const clock = new THREE.Clock();

const animation = () => {
    //return elapsed time
    const elapsedTime = clock.getElapsedTime();
    //update Orbital controls
    controls.update();
    //renderer
    Renderer.render(scene, camera);
    //Request next frame
    window.requestAnimationFrame(animation);
}
animation();
