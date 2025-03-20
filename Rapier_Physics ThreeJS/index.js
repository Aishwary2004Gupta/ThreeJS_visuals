import * as THREE from "three";
import getLayer from "./getLayers.js";
import {getBody, getMouseBall } from "./getBodies.js";
//adding the physics
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat@0.11.2';
//adding the post-processing
import { EffectComposer } from "jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "jsm/postprocessing/UnrealBloomPass.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 4;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

let mousePos = new THREE.Vector3();

//initiallizing the rapier physics
await RAPIER.init();
const gravity = { x: 0.0, y: 0, z: 0.0 };
const world = new RAPIER.World(gravity);

//post-processing
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.5, 20);
bloomPass.threshold = 1.02;
bloomPass.strength = 2.0;
bloomPass.radius = 0;
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const numBodies = 80;
const bodies = [];
for (let i = 0; i < numBodies; i++) {
    const body = getBody(RAPIER, world);
    bodies.push(body);
    scene.add(body.mesh);
}

const mouseBall = getMouseBall(RAPIER, world);
scene.add(mouseBall.mesh);

const hemiLight = new THREE.HemisphereLight(0x00bbff, 0xaa00ff);
hemiLight.intensity = 0.2;
scene.add(hemiLight);

//BG
const sprites = getLayer({
    hue: 0.0,
    numSprites: 20,
    opacity: 0.02,
    radius: 10,
    size: 24,
    z: -10.5,
});
scene.add(sprites);

function animate() {
    requestAnimationFrame(animate);
    world.step();
    mouseBall.update(mousePos);
    //calling the update method
    bodies.forEach(b => b.update())
    composer.render(scene, camera);
    // controls.update();
}

animate();

function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, true);

// mouse move handler
function handleMouseMove(evt) {
    mousePos.x = (evt.clientX / window.innerWidth) * 2 - 1;
    mousePos.y = -(evt.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener('mousemove', handleMouseMove, true);
