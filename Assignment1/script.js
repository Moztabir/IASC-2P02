import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import * as dat from 'lil-gui';

// Setup
const sizes = {
  width: window.innerWidth*0.4,
  height: window.innerHeight,
  aspectRatio: window.innerWidth*0.4 / window.innerHeight,
}

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
//scene.background = new THREE.Color('black');

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.aspectRatio, 0.1, 100);
camera.position.set(10, 2, 7.5);
camera.lookAt(0, 0, 0);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
})
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true; // enable shadows

// Mesh: Cave
const cave = new THREE.PlaneGeometry(15.5, 7.5);
const caveMaterial = new THREE.MeshStandardMaterial({
  color: 'white',
  side: THREE.DoubleSide
});
const caveMesh = new THREE.Mesh(cave, caveMaterial);
caveMesh.rotation.y = Math.PI * 0.5;
caveMesh.receiveShadow = true; // enable shadows
scene.add(caveMesh);

// Mesh: Smiley Face
const smiley = new THREE.Group();

// Face: Ring
const faceGeometry = new THREE.TorusGeometry(0.9, 0.02, 16, 32);
const faceMaterial = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  side: THREE.DoubleSide,
});
const faceMesh = new THREE.Mesh(faceGeometry, faceMaterial);
faceMesh.rotation.x = Math.PI * 0.5;
faceMesh.castShadow = true;
faceMesh.receiveShadow = true;
smiley.add(faceMesh);

// Eyes
const eyeGeometry = new THREE.CircleGeometry(0.1, 16);
const eyeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffff00,
  side: THREE.DoubleSide,
});
const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
// Set positions for both eyes
leftEye.position.set(-0.2, 0.3, 0);
rightEye.position.set(0.2, 0.3, 0);
// Set shadow properties for both eyes
leftEye.castShadow = true;
leftEye.receiveShadow = true;
rightEye.castShadow = true;
rightEye.receiveShadow = true;
// Add eyes to the face mesh
faceMesh.add(leftEye);
faceMesh.add(rightEye);

//Smile Arc
const smileCurve = new THREE.EllipseCurve(
  0, 0,
  0.7, 0.7,
  7 * Math.PI / 6, 11 * Math.PI / 6,
  false,
  0
);
const smilePoints = smileCurve.getPoints(32);
const smileGeometry = new THREE.BufferGeometry().setFromPoints(smilePoints);
const smileMaterial = new THREE.LineBasicMaterial({
  color: 0xffff00,
});
const smileLine = new THREE.Line(smileGeometry, smileMaterial);
smileLine.position.set(0, 0, 0);
smileLine.rotation.x = Math.PI * 0.5;
smiley.add(smileLine);
smileLine.castShadow = true;

smiley.position.set(6, 1, 0);
scene.add(smiley);

// Lights
const directionalLight = new THREE.DirectionalLight('white', 0.5);
scene.add(directionalLight);
directionalLight.position.set(10, 0, 0);
directionalLight.target = caveMesh;
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight.target);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;


/******************
**Dom Interaction**
*******************/
const domObjects = {
  part: 1,
  firstChange: false,
  secondChnage: false,
  thirdChange: false,
  fourthChange: false,
};

//part 1
document.querySelector('#part-one').onclick= function() {
  domObjects.part = 1;
};

//part 2
document.querySelector('#part-two').onclick = function() {
  domObjects.part = 2;
};

//firstChange
document.querySelector('#first-change').onclick = function() {
  domObjects.firstChange = true;
};
//secondChange
document.querySelector('#second-change').onclick = function() {
  domObjects.secondChange = true;
};
//thirdChange
document.querySelector('#third-change').onclick = function() {
  domObjects.thirdChange = true; 
}
//fourthChange
document.querySelector('#fourth-change').onclick = function() {
  domObjects.fourthChange = true;
} 

// Animation loop
const clock = new THREE.Clock();
const animation = () => {
  //return elapsed time in seconds
  const elapsedTime = clock.getElapsedTime();
  controls.update();

  //Part 1
  if(domObjects.part === 1) {//inside the cave
   camera.position.set(4, 1, 0);
   camera.lookAt(0, 0, 0); 
  }

  //Part 2
  if(domObjects.part === 2) {//Outside the cave
    camera.position.set(12, 3, 0);
    camera.lookAt(0, 0, 0);
  }

  //firstChange
  if(domObjects.firstChange) {
    smiley.position.y = 1 + Math.sin(clock.getElapsedTime()) * 0.5; // Moves up and down
  }
  //secondChange
  if(domObjects.secondChange) {
    faceMesh.scale.y = 1 + Math.sin(clock.getElapsedTime()) * 0.5; // Stretches and squashes
  }
  //thirdChange
  if(domObjects.thirdChange) {
    smiley.rotation.z = 1 + Math.sin(clock.getElapsedTime()) * 1; // Moves up and down
  }
  //fourthChange
  if(domObjects.fourthChange) {
    faceMesh.scale.y = 1 + Math.sin(clock.getElapsedTime()) * 0.5; // Stretches and squashes
  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(animation);
};
animation();
