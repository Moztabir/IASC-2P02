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

let preset = {};

const uiObjects = {
    sourceText: "Here is my source text",
    saveSorceText() {
        saveSourceText();
    },

    term1: 'here',
    term2: 'source',
    term3: '',

    color1: '#ff0000',
    color2: '#00ff00',
    color3: '',

    saveTerms() {
        saveTerms();
    }
}

//UI functions
const saveSourceText = () => {
    //ui
    preset = ui.save();
    textFolder.hide();
    terms.show();
    visualFolder.show();

    // Text analysis
    tokenizeSourceText(uiObjects.sourceText);
}


const saveTerms = () => {
    ui.save();
    visualFolder.hide();

    //text analysis
    findSearchTermInTokenizedText(uiObjects.term1, uiObjects.color1);
    findSearchTermInTokenizedText(uiObjects.term2, uiObjects.color2);
    findSearchTermInTokenizedText(uiObjects.term3, uiObjects.color3);

}
//text Folder
const textFolder = ui.addFolder('Source Text');

textFolder
    .add(uiObjects, 'sourceText')
    .name('Source Text')

textFolder
    .add(uiObjects, 'saveSorceText')
    .name('Save')

const terms = ui.addFolder('Search Terms');
const visualFolder = ui.addFolder('Visuals');

terms
    .add(uiObjects, 'term1')
    .name('Term 1')
terms
    .addColor(uiObjects, 'color1')
    .name('Color 1')

terms
    .add(uiObjects, 'term2')
    .name('Term 2')
terms
    .addColor(uiObjects, 'color2')
    .name('Color 2')

terms
    .add(uiObjects, 'term3')
    .name('Term 3')
terms
    .addColor(uiObjects, 'color3')
    .name('Color 3')

visualFolder
    .add(uiObjects, 'saveTerms')
    .name('Visualize')


// hidden folders
terms.hide();
visualFolder.hide();



let parsedText, tokenizedText;

//Parse and tokenize text
const tokenizeSourceText = (sourceText) => {
    parsedText = sourceText.replaceAll(".", " ").toLowerCase();

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