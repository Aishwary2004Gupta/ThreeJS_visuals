import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

window.addEventListener('load', () => {
  try {
    console.log('Initializing scene...');

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Initialize OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    console.log('Creating the cube...');
    // Create the Cube
    const cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const cubeMaterial = new THREE.MeshStandardMaterial({
      color: 0x4285f4, // Blue
      metalness: 0.6,
      roughness: 0.2,
      smoothness: 4,
      wireframe: false, // Set to true for wireframe mode
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);

    console.log('Adding lighting...');
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Camera Position
    camera.position.z = 5;

    console.log('Starting animation loop...');
    // Animation Loop
    const speed = 1;

    function animate() {
      requestAnimationFrame(animate);

      // Rotate Cube
      cube.rotation.x += 0.01 * speed * 0.5;
      cube.rotation.y += 0.01 * speed * 0.7;
      cube.rotation.z += 0.01 * speed * 0.3;

      // Update controls
      controls.update();

      // Render Scene
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
  } catch (error) {
    console.error('An error occurred:', error);
  }
});