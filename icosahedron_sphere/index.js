import * as THREE from "three"
//orbit controls
import { OrbitControls } from "jsm/controls/OrbitControls.js"

//renderer
const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement); //convus element

//setting up the camera
const fov = 80; //feild of view in degrees
const aspect = w / h; //aspect ratio
const near = 0.1; //near clipping plane -> where it starts remdering
const far = 10; //far clipping plane -> where it stops rendering
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

//scene
const scene = new THREE.Scene();

//deffing the orbitControls
const controls = new OrbitControls(camera, renderer.domElement); //can use the mouse the move the object 
controls.enableDamping = true;
controls.dampingFactor = 0.02;

//premitives (geometry)
const geo = new THREE.IcosahedronGeometry(1.0, 2);
const mat = new THREE.MeshStandardMaterial({ //making it interect with light 
    color: 0xcc99ff629f,
    flatShading: true
});
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

//WireFrame geometry 
const wireMat = new THREE.MeshDepthMaterial({
    color: 0xffffff,
    wireframe: true
});

const wireMesh = new THREE.Mesh(geo, wireMat);
wireMesh.scale.setScalar(1.001); //scalling up a bit
mesh.add(wireMesh); //to make the wires also move

//Lights
const hemiLight = new THREE.HemisphereLight(0xcc7ff, 0xaaf550); //top and bottom
scene.add(hemiLight);

//animation
function animate() {
    requestAnimationFrame(animate);
    // mesh.scale.setScalar(Math.cos(t * 0.001) + 0.1); 
    // mesh.rotation.x += 0.001;
    // mesh.rotation.y += 0.001;
    renderer.render(scene, camera);
    controls.update();
}

animate();