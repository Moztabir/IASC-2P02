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

window.addEventListener('resize',()=>{
    //update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    sizes.aspectRatio = window.innerWidth / window.innerHeight;
    
    //update camera
    camera.aspect = sizes.aspectRatio;
    camera.updateProjectionMatrix();

    //update renderer
    Renderer.setSize(sizes.width, sizes.height);
    Renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

} )

//**
// Scene */

//Canvas
const canvas = document.querySelector('canvas.webgl');

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('grey');
//Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100);
scene.add(camera);
camera.position.set(5, 20, -25);
//Renderer
const Renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
Renderer.setSize(sizes.width, sizes.height);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//Light
//Driectional light
const directionalLight = new THREE.DirectionalLight('white', 1);
scene.add(directionalLight);

//Mesh
// test cube
const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

const drawCube = (height, color) =>{
    const cubeMaterial = new THREE.MeshStandardMaterial({ 
        color:new THREE.Color(color) 
    })

    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    //cube position
    cube.position.x = (Math.random() - 0.5) * 12;
    cube.position.z = (Math.random() - 0.5) * 12;
    cube.position.y = height;

    //Cube rotation
    cube.rotation.x = Math.random() * 2 * Math.PI;
    scene.add(cube);
}


/*****
 * UI*
 *****/

//UI
const ui = new dat.GUI();

//text Analisis
const source = "One night in Night City, a mercenary named Vex received a mysterious message on his holo-pad. It was a high-risk job from a fixer named Rogue—he had to steal an advanced AI chip from Arasaka, the most powerful corporation in the city. Knowing the dangers but unable to resist the promise of riches, Vex sneaked into the heavily guarded tower. Alarms blared as he grabbed the glowing chip, and security forces swarmed in. With no time to escape, he made a desperate choice—he inserted the chip into his neural port. A cold voice echoed in his head, “Welcome, Operator.” His vision blurred, his thoughts twisted, and he realized too late—he was no longer in control." ;

let parsedText, tokenizedText;

//Parse and tokenize text
const tokenizeSourceText = () => {
    parsedText = source.replaceAll(".", " ").toLocaleLowerCase();

    //tokinized text
    tokenizedText = parsedText.split(/[^\w']+/);
    console.log(tokenizedText);
}

//Find search term in tokinized text
const findSearchTermInTokenizedText = (term, Color) => {
    for(let i = 0; i < tokenizedText.length; i++){
        //If tokenizedText[i] is the search term
        if(tokenizedText[i] === term){
            const height = (70 / tokenizedText.length) * i *0.2;

            for(let a =0; a < 100; a++){
                drawCube(height, Color);
            }
        }
    }
}
tokenizeSourceText();
findSearchTermInTokenizedText("chip", "red");
findSearchTermInTokenizedText("night", "yellow");
findSearchTermInTokenizedText("city", "blue");



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