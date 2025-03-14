// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls for interactive camera
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Add Stars Background
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];
for (let i = 0; i < 5000; i++) {
  const x = (Math.random() - 0.5) * 1000;
  const y = (Math.random() - 0.5) * 1000;
  const z = (Math.random() - 0.5) * 1000;
  starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Create the Wormhole Torus
const torusGeometry = new THREE.TorusGeometry(2, 0.5, 32, 100);
const torusMaterial = new THREE.MeshStandardMaterial({
  color: 0x6a0dad,
  emissive: 0x4b0082,
  emissiveIntensity: 0.5,
  metalness: 0.8,
  roughness: 0.2,
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
scene.add(torus);

// Add Center Glow
const glowGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const glowMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0xffffff,
  emissiveIntensity: 1,
  transparent: true,
  opacity: 0.8,
});
const glow = new THREE.Mesh(glowGeometry, glowMaterial);
scene.add(glow);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Camera Position
camera.position.z = 10;

// Animation Loop
let time = 0;
const speed = 1;

function animate() {
  requestAnimationFrame(animate);

  // Update Time
  time += 0.01 * speed;

  // Rotate Torus
  torus.rotation.x = time * 0.3;
  torus.rotation.y = time * 0.2;

  // Pulsate Glow
  glow.scale.set(1 + Math.sin(time) * 0.2, 1 + Math.sin(time) * 0.2, 1 + Math.sin(time) * 0.2);

  // Render Scene
  controls.update();
  renderer.render(scene, camera);
}

// Handle Window Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start Animation
animate();