import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import spline from "./spline.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.5, 1100);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true; //make the cube move (smooth)
// controls.dampingFactor = 0.02;

//create a line geometry using spline
const points = spline.getPoints(100);
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
const line = new THREE.Line(geometry, material);
scene.add(line);

//create a tube geometry using spline
const tubeGeometry = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
const tubeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    metalness: 0.5,
    // side: THREE.DoubleSide,
    wireframe: true,
    // depthWrite: true,
    transparent: true,
    opacity: 0.5
});

//add a thick wireframe boader
const tubeBorder = new THREE.Mesh(tubeGeometry, new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide }));
tubeBorder.scale.multiplyScalar(1);
scene.add(tubeBorder);

//add the tube
const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
scene.add(tube);

const hemiLight = new THREE.HemisphereLight(0xfff, 0xffcc); //top and bottom
scene.add(hemiLight);

//camera fly-throught
function updateCamera(t) {
    const time = t * 0.1;
    const looptime = 10 * 1000;
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
    renderer.render(scene, camera);
    // controls.update();
}

animate();

function handleWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);