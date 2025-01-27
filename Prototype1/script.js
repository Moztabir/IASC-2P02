import * as THREE from 'three';

//**
// Scene */

//Canvas
const canvas = document.querySelector('canvas.webgl');

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('darkblue');
//Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
scene.add(camera);
camera.position.set(0, 0, 5);
//Renderer
const Renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
Renderer.setSize(window.innerWidth, window.innerHeight);

//Mesh
// test sphere
const sphereGeometry = new THREE.SphereGeometry(1);
const sphereMaterial = new THREE.MeshNormalMaterial();
const testsphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(testsphere);
testsphere.position.set = (0, 0, -5);

const cubeGeometry = new THREE.BoxGeometry(1);
const cubeMaterial = new THREE.MeshNormalMaterial();
const testcube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(testcube);
testcube.position.set = (0, 0, -5);

//animation loop
const clock = new THREE.Clock();

const animation = () => {
    //return elapsed time
    const elapsedTime = clock.getElapsedTime();
    //update objects
    console.log(elapsedTime);
    testsphere.position.y = Math.sin(elapsedTime);
    testcube.position.x = Math.cos(elapsedTime);
    testsphere.position.z = Math.sin(elapsedTime);
    testcube.position.y = Math.sin(elapsedTime);
    //renderer
    Renderer.render(scene, camera);
    //Request next frame
    window.requestAnimationFrame(animation);
}
animation();
