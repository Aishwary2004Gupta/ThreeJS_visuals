import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'jsm/geometries/RoundedBoxGeometry.js';

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

    console.log('Creating the rounded cube...');
    // Create the Rounded Cube
    const cubeGeometry = new RoundedBoxGeometry(1.5, 1.5, 1.5, 6, 0.1); // Rounded edges
    const cubeMaterial = new THREE.MeshStandardMaterial({
      color: 0x0047ab, // Deep blue
      metalness: 0.9, // High reflectivity
      roughness: 0.1, // Smooth and glossy
      envMapIntensity: 1.5, // Enhance reflections
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

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

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