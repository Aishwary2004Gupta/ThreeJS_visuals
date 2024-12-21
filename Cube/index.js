import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.5, 1100);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ 
    color: 0xcc99ff629f,
    flatShading: true 
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Create edges geometry and material for glowing effect
const edges = new THREE.EdgesGeometry(geometry);


//add wireframe
// const wireMat = new THREE.MeshDepthMaterial({
//     color: 0xffffff,
//     wireframe: true
// });

// const wireMesh = new THREE.Mesh(geometry, wireMat);
// wireMesh.scale.setScalar(1); //scalling up a bit
// cube.add(wireMesh); //to make the wires also move use cube instead of scene 


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; //make the cube move (smooth)
// controls.dampingFactor = 0.02;

const hemiLight = new THREE.HemisphereLight(0xfff, 0xffcc); //top and bottom
scene.add(hemiLight);

//animation
function animate() {
    requestAnimationFrame(animate);
    // cube.rotation.x += 0.001;
    // cube.rotation.y += 0.001;
    renderer.render(scene, camera);
    controls.update();
}

animate();
