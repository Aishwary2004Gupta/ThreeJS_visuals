import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./star/getStarfield.js";
import { getFresnelMat } from "./outline/getFresnelMat.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1100);
camera.position.z = 4;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

//earthGroup
const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180
scene.add(earthGroup);

const controls = new OrbitControls(camera, renderer.domElement);

const detail = 11;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail); //making it smoother (edges)
const material = new THREE.MeshStandardMaterial({
    map: loader.load("../textures/earthmap1k.jpg")
});

const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

//adding lights in the space 
const lightMat = new THREE.MeshBasicMaterial({
    // color: 0x00ff00,
    // transparent: true,
    // opacity: 0.5,
    map: loader.load("../textures/Kantar BrandZ 2023.jpg"),
    blending: THREE.AdditiveBlending,
});
const lightMesh = new THREE.Mesh(geometry, lightMat);
earthGroup.add(lightMesh);

const cloudMat = new THREE.MeshStandardMaterial({
    map: loader.load("../textures/file.jpg"),
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
});

const cloudMesh = new THREE.Mesh(geometry, cloudMat);
cloudMesh.scale.setScalar(1.01);
earthGroup.add(cloudMesh);

//outline
const FresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, FresnelMat);
glowMesh.scale.setScalar(1.02);
earthGroup.add(glowMesh);

//get stars 
const stars = getStarfield({ numStars: 2000 });
scene.add(stars);


//sunLight
const sunlight = new THREE.DirectionalLight(0xffffff);
sunlight.position.set(-2, 0.5, 1.5); //moving the light on x and z axes
scene.add(sunlight);

//animation
function animate() {
    requestAnimationFrame(animate);
    lightMesh.rotation.y += 0.002;
    earthMesh.rotation.y += 0.002;
    cloudMesh.rotation.y += 0.0024;
    glowMesh.rotation.y += 0.002;
    renderer.render(scene, camera);
    controls.update();
}

animate();

function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);