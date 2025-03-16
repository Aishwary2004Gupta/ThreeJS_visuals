import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

// Constants
const CUBE_SIZE = 3; // 3x3x3 Rubik's Cube
const CUBIE_SIZE = 1; // Size of each small cube (cubie)
const COLORS = [
  0xff0000, // Red
  0x0000ff, // Blue
  0xffff00, // Yellow
  0x00ff00, // Green
  0xffffff, // White
  0xff8800, // Orange
];

// Create the Rubik's Cube
function createRubiksCube() {
  const cubeGroup = new THREE.Group();

  for (let x = 0; x < CUBE_SIZE; x++) {
    for (let y = 0; y < CUBE_SIZE; y++) {
      for (let z = 0; z < CUBE_SIZE; z++) {
        const cubie = createCubie(x, y, z);
        cubeGroup.add(cubie);
      }
    }
  }

  return cubeGroup;
}

// Create a single cubie
function createCubie(x, y, z) {
  const cubieGroup = new THREE.Group();

  // Create the cubie mesh
  const geometry = new THREE.BoxGeometry(CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE);
  const material = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const cubieMesh = new THREE.Mesh(geometry, material);
  cubieGroup.add(cubieMesh);

  // Add colored faces
  const faceMaterials = COLORS.map((color) => new THREE.MeshStandardMaterial({ color }));
  const faceGeometry = new THREE.PlaneGeometry(CUBIE_SIZE * 0.9, CUBIE_SIZE * 0.9);

  if (x === 0) {
    const face = new THREE.Mesh(faceGeometry, faceMaterials[0]); // Red
    face.position.set(-CUBIE_SIZE / 2, 0, 0);
    face.rotation.y = Math.PI / 2;
    cubieGroup.add(face);
  }
  if (x === CUBE_SIZE - 1) {
    const face = new THREE.Mesh(faceGeometry, faceMaterials[1]); // Blue
    face.position.set(CUBIE_SIZE / 2, 0, 0);
    face.rotation.y = Math.PI / 2;
    cubieGroup.add(face);
  }
  if (y === 0) {
    const face = new THREE.Mesh(faceGeometry, faceMaterials[2]); // Yellow
    face.position.set(0, -CUBIE_SIZE / 2, 0);
    face.rotation.x = Math.PI / 2;
    cubieGroup.add(face);
  }
  if (y === CUBE_SIZE - 1) {
    const face = new THREE.Mesh(faceGeometry, faceMaterials[3]); // Green
    face.position.set(0, CUBIE_SIZE / 2, 0);
    face.rotation.x = Math.PI / 2;
    cubieGroup.add(face);
  }
  if (z === 0) {
    const face = new THREE.Mesh(faceGeometry, faceMaterials[4]); // White
    face.position.set(0, 0, -CUBIE_SIZE / 2);
    cubieGroup.add(face);
  }
  if (z === CUBE_SIZE - 1) {
    const face = new THREE.Mesh(faceGeometry, faceMaterials[5]); // Orange
    face.position.set(0, 0, CUBIE_SIZE / 2);
    cubieGroup.add(face);
  }

  // Position the cubie in the Rubik's Cube
  cubieGroup.position.set(
    x - (CUBE_SIZE - 1) / 2,
    y - (CUBE_SIZE - 1) / 2,
    z - (CUBE_SIZE - 1) / 2
  );

  return cubieGroup;
}

// Rotate a layer of the Rubik's Cube
function rotateLayer(cubeGroup, axis, index, angle) {
  const layer = cubeGroup.children.filter((cubie) => {
    const position = Math.round(cubie.position[axis]);
    return position === index;
  });

  const rotationAxis = new THREE.Vector3();
  rotationAxis[axis] = 1;

  const quaternion = new THREE.Quaternion();
  quaternion.setFromAxisAngle(rotationAxis, angle);

  layer.forEach((cubie) => {
    cubie.applyQuaternion(quaternion);
    cubie.position.applyQuaternion(quaternion);
  });
}

// Initialize the scene
function initScene() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Create the Rubik's Cube
  const rubiksCube = createRubiksCube();
  scene.add(rubiksCube);

  // Tilt the cube slightly to show three faces
  rubiksCube.rotation.x = Math.PI / 6; // Tilt forward
  rubiksCube.rotation.y = Math.PI / 4; // Rotate to show three faces

  // Camera position
  camera.position.z = 5;

  // OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Animation loop
  let time = 0;
  const speed = 0.01;

  function animate() {
    requestAnimationFrame(animate);

    // Rotate layers automatically
    time += speed;
    rotateLayer(rubiksCube, 'x', 1, speed); // Rotate middle layer
    rotateLayer(rubiksCube, 'y', 1, speed); // Rotate middle layer
    rotateLayer(rubiksCube, 'z', 1, speed); // Rotate middle layer

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
}

// Start the app
initScene();