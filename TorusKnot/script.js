import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
// Create the scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Enable OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera movement

// Load texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('../assets/metal.jpg', 
    () => console.log('Texture loaded successfully'), 
    undefined, 
    (err) => console.error('Failed to load texture:', err)
);

// Create the TorusKnot geometry
const geometry = new THREE.TorusKnotGeometry(1, 0.4, 100, 16);
const material = new THREE.MeshStandardMaterial({ 
    map: texture, 
    // metalness: 2.00, // Increase metalness for a metallic look
    roughness: 0.00  // Decrease roughness for a shinier appearance
});
material.color = new THREE.Color(0x636363);
material.side = THREE.DoubleSide;
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Add lighting 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 9900);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);
 
// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the TorusKnot
    torusKnot.rotation.x += 0.01;
    torusKnot.rotation.y += 0.01;

    // Update controls
    controls.update();

    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
