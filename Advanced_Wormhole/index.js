import * as THREE from "three";
import spline from "./spline.js";
//glowing effect
import { EffectComposer } from "jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "jsm/postprocessing/UnrealBloomPass.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
//adding fog to the scene
scene.fog = new THREE.FogExp2(0x000000, 0.3);

const camera = new THREE.PerspectiveCamera(75, w / h, 0.5, 1100);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true; //make the cube move (smooth)
// controls.dampingFactor = 0.02;

// post-processing
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 100);
bloomPass.threshold = 0.002;
bloomPass.strength = 2.3;
bloomPass.radius = 1;
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

//create a line geometry using spline
const points = spline.getPoints(100);
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
// const line = new THREE.Line(geometry, material);
// scene.add(line);

//create a tube geometry using spline
const tubeGeometry = new THREE.TubeGeometry(spline, 200, 0.8, 20, true);
// const tubeMaterial = new THREE.MeshStandardMaterial({ 
//     color: 0xff0000,
//     emissive: 0x550000,
//     emissiveIntensity: 0.5,
//     side: THREE.DoubleSide,
//     roughness: 0.5,
//     metalness: 0.3,
//     // wireframe: true 
// });
// const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
// scene.add(tube);


//create edges geometry using spline
const edges = new THREE.EdgesGeometry(tubeGeometry, 0.2);
const lineMat = new THREE.LineBasicMaterial({ color: 0xffff9 });
const tubeLines = new THREE.LineSegments(edges, lineMat);
scene.add(tubeLines);

//add stars
const numStars3D = 100;
const starGeometry3D = new THREE.SphereGeometry(0.02, 6, 6);
for (let i = 0; i < numStars3D; i++){
    const starMaterial3D = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const star3D = new THREE.Mesh(starGeometry3D, starMaterial3D);
    const p = Math.random();
    const pos = tubeGeometry.parameters.path.getPointAt(p);
    pos.x += Math.random() - 0.5;
    pos.y += Math.random() - 0.5;
    pos.z += Math.random() - 0.5;
    star3D.position.copy(pos);
    scene.add(star3D);
}

// add boxes
const numBoxes = 55;
const size = 0.075;
const boxGeometry = new THREE.BoxGeometry(size, size, size);
for (let i = 0; i < numBoxes; i++){
    const boxMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        wireframe: true 
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    const p = (i / numBoxes + Math.random() * 0.1) % 1;
    const pos = tubeGeometry.parameters.path.getPointAt(p);
    pos.x += Math.random() - 0.4;
    pos.z += Math.random() - 0.4;
    box.position.copy(pos);
    const rote = new THREE.Vector3(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    );
    box.rotation.set(rote.x, rote.y, rote.z);
    const edges = new THREE.EdgesGeometry(boxGeometry, 0.2);
    // const color = new THREE.Color().setHSL(3.0 - p, 1, 0.5); //if you want the boxes to change colours use this line and remove the red colour from the next line
    const color = new THREE.Color(0xff0909);
    const lineMat = new THREE.LineBasicMaterial({ color }); //red 0xff0909 if you need only one colour
    const boxLines = new THREE.LineSegments(edges, lineMat);
    boxLines.position.copy(pos);
    boxLines.rotation.set(rote.x, rote.y, rote.z);
    
    // scene.add(box);
    scene.add(boxLines);
}

//camera fly-throught
function updateCamera(t) {
    const time = t * 0.1;
    const looptime = 6 * 1000;
    const p = (time % looptime) / looptime; 
    const pos = tubeGeometry.parameters.path.getPointAt(p);
    camera.position.copy(pos);
    const lookAt = tubeGeometry.parameters.path.getPointAt((p + 0.01) % 1);
    camera.lookAt(lookAt);

}

//animation
function animate(t = 0) { //passing in a time span
    requestAnimationFrame(animate);
    updateCamera(t);
    // renderer.render(scene, camera);
    composer.render(scene, camera);
    // controls.update();
}

animate();

function handleWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);