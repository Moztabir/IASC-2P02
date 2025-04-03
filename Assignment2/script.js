import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import * as dat from 'lil-gui';

// Setup
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
};

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    sizes.aspectRatio = window.innerWidth / window.innerHeight;
    
    camera.aspect = sizes.aspectRatio;
    camera.updateProjectionMatrix();

    Renderer.setSize(sizes.width, sizes.height);
    Renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Canvas and Scene
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
scene.background = new THREE.Color('grey');

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.aspectRatio, 0.1, 100);
scene.add(camera);
camera.position.set(5, 10, -15);

// Renderer
const Renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
Renderer.setSize(sizes.width, sizes.height);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Light
const directionalLight = new THREE.DirectionalLight('white', 1);
scene.add(directionalLight);

// ----------------------------
// Cube Geometry and Function (Now used for Term 3)
const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

const drawCube = (positionY, params) => {
    const cubeMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(params.color),
        roughness: 0.5,
        metalness: 5
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = (Math.random() - 0.5) * params.diameter;
    cube.position.z = (Math.random() - 0.5) * params.diameter;
    cube.position.y = positionY - 5;
    cube.scale.set(params.scale, params.scale, params.scale);
    if (params.randomized) {
        cube.rotation.x = Math.random() * 2 * Math.PI;
        cube.rotation.y = Math.random() * 2 * Math.PI;
        cube.rotation.z = Math.random() * 2 * Math.PI;
    }
    params.group.add(cube);
};


// ----------------------------
// Constant Tube Length and Tube Functions for Term 2
class CustomTubeCurve extends THREE.Curve {
    constructor() {
        super();
    }
    getPoint(t) {
        const tx = Math.sin(2 * Math.PI * t) * 0.5;
        const ty = t * 1; // Constant tube length
        const tz = Math.cos(2 * Math.PI * t) * 0.5;
        return new THREE.Vector3(tx, ty, tz);
    }
}

const drawTube = (positionY, params) => {
    const path = new CustomTubeCurve();
    const tubeGeometry = new THREE.TubeGeometry(path, 20, 0.1, 8, false);
    const tubeMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(params.color)
    });
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    tube.position.x = (Math.random() - 0.5) * params.diameter;
    tube.position.z = (Math.random() - 0.5) * params.diameter;
    tube.position.y = positionY - 5;
    tube.scale.set(params.scale, params.scale, params.scale);
    if (params.randomized) {
        tube.rotation.x = Math.random() * 2 * Math.PI;
        tube.rotation.y = Math.random() * 2 * Math.PI;
        tube.rotation.z = Math.random() * 2 * Math.PI;
    }
    params.group.add(tube);
};

// ----------------------------
// Tetrahedron Geometry and Function (Now used for Term 1)
// The detail level will now be computed automatically based on the token index.
const drawTetrahedron = (positionY, params) => {
    // Use params.detail which is now computed automatically.
    const tetraGeometry = new THREE.TetrahedronGeometry(0.5, params.detail);
    const tetraMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(params.color)
    });
    const tetra = new THREE.Mesh(tetraGeometry, tetraMaterial);
    tetra.position.x = (Math.random() - 0.5) * params.diameter;
    tetra.position.z = (Math.random() - 0.5) * params.diameter;
    tetra.position.y = positionY - 5;
    tetra.scale.set(params.scale, params.scale, params.scale);
    if (params.randomized) {
        tetra.rotation.x = Math.random() * 2 * Math.PI;
        tetra.rotation.y = Math.random() * 2 * Math.PI;
        tetra.rotation.z = Math.random() * 2 * Math.PI;
    }
    params.group.add(tetra);
};

// ----------------------------
// UI Setup and Grouping
const ui = new dat.GUI();
let preset = {};

// Create groups for each term
const group1 = new THREE.Group();
scene.add(group1);
const group2 = new THREE.Group();
scene.add(group2);
const group3 = new THREE.Group();
scene.add(group3);

const uiObjects = {
    sourceText: "Here is my source text",
    saveSorceText() {
        saveSourceText();
    },
    // Term 1 now uses TetrahedronGeometry; detail will be computed automatically
    term1: {
        term: 'kelly',
        color: '#ff0000',
        diameter: 10,
        ncubes: 100,
        group: group1,
        randomized: true,
        scale: 1,
        detail: 0  // Initial value (will be overridden automatically)
    },
    // Term 2 remains as before (tube)
    term2: {
        term: 'yorkie',
        color: '#00ff00',
        diameter: 10,
        ncubes: 100,
        group: group2,
        randomized: true,
        scale: 1,
    },
    // Term 3 now uses Cube geometry
    term3: {
        term: 'love',
        color: '#00ffff',
        diameter: 10,
        ncubes: 100,
        group: group3,
        randomized: true,
        scale: 1,
    },
    saveTerms() {
        saveTerms();
    },
    rotateCamera: false,
};

// UI functions
const saveSourceText = () => {
    preset = ui.save();
    textFolder.hide();
    terms.show();
    visualFolder.show();
    tokenizeSourceText(uiObjects.sourceText);
};

const saveTerms = () => {
    ui.save();
    visualFolder.hide();
    cameraFolder.show();
    findSearchTermInTokenizedText(uiObjects.term1);
    findSearchTermInTokenizedText(uiObjects.term2);
    findSearchTermInTokenizedText(uiObjects.term3);
};

// UI Folders
const textFolder = ui.addFolder('Source Text');
textFolder.add(uiObjects, 'sourceText').name('Source Text');
textFolder.add(uiObjects, 'saveSorceText').name('Save');

const terms = ui.addFolder('Search Terms');
const visualFolder = ui.addFolder('Visuals');
const cameraFolder = ui.addFolder('Camera');

// Term 1 UI (Tetrahedron)
// Removed the slider for detail since it is now computed automatically.
terms.add(uiObjects.term1, 'term').name('Term 1');
terms.addColor(uiObjects.term1, 'color').name('Term 1 Color');
terms.add(group1, 'visible').name('Term 1 Visible');

// Term 2 UI (Tube)
terms.add(uiObjects.term2, 'term').name('Term 2');
terms.addColor(uiObjects.term2, 'color').name('Term 2 Color');
terms.add(group2, 'visible').name('Term 2 Visible');

// Term 3 UI (Cube)
terms.add(uiObjects.term3, 'term').name('Term 3');
terms.addColor(uiObjects.term3, 'color').name('Term 3 Color');
terms.add(group3, 'visible').name('Term 3 Visible');

visualFolder.add(uiObjects, 'saveTerms').name('Visualize');
cameraFolder.add(uiObjects, 'rotateCamera').name('turntable');

// Initially hide folders
terms.hide();
visualFolder.hide();
cameraFolder.hide();

let parsedText, tokenizedText;

const tokenizeSourceText = (sourceText) => {
    parsedText = sourceText.replaceAll(".", " ").toLowerCase();
    tokenizedText = parsedText.split(/[^\w']+/);
    console.log(tokenizedText);
};

const findSearchTermInTokenizedText = (params) => {
    for (let i = 0; i < tokenizedText.length; i++) {
        if (tokenizedText[i] === params.term) {
            const positionY = (70 / tokenizedText.length) * i * 0.2;
            // For term1, automatically compute detail based on token index.
            if (params.term === 'kelly') {
                // Scale the token index to a detail level from 0 to 5.
                const computedDetail = Math.min(5, Math.floor((i / tokenizedText.length) * 6));
                params.detail = computedDetail;
            }
            for (let a = 0; a < params.ncubes; a++) {
                if (params.term === 'yorkie') {
                    drawTube(positionY, params);
                } else if (params.term === 'kelly') {
                    drawTetrahedron(positionY, params);
                } else if (params.term === 'love') {
                    drawCube(positionY, params);
                }
            }
        }
    }
};

// ----------------------------
// Animation Loop with Continuous Rotation for Camera, Group 2, and Group 3
const clock = new THREE.Clock();

const animation = () => {
    const elapsedTime = clock.getElapsedTime();
    controls.update();

    if (uiObjects.rotateCamera) {
        camera.position.x = Math.sin(elapsedTime * 0.1) * 20;
        camera.position.z = Math.cos(elapsedTime * 0.1) * 20;
        camera.position.y = 5;
        camera.lookAt(0, 0, 0);
    }

    // Rotate group2 (tube) continuously
    group2.rotation.y -= 0.01;

    Renderer.render(scene, camera);
    window.requestAnimationFrame(animation);
};

animation();

