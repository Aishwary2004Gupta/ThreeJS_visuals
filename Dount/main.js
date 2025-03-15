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

    console.log('Adding stars background...');
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

    console.log('Creating the wormhole torus...');
    // Create the Wormhole Torus
    const torusGeometry = new THREE.TorusGeometry(2, 0.5, 32, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: 0x6a0dad, // Purple
      emissive: 0x4b0082, // Dark purple glow
      emissiveIntensity: 1,
      metalness: 3.5,
      roughness: 0.01,
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);

    console.log('Adding center glow...');
    // Add Center Glow
    const glowGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const glowMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff, // White
      emissive: 0xffffff, // White glow
      emissiveIntensity: 1,
      transparent: true,
      opacity: 0.8,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    console.log('Creating particle system...');
    // Particle System
    const particleGeometry = new THREE.BufferGeometry();
    const particleVertices = [];
    for (let i = 0; i < 100; i++) {
      const angle = (i / 100) * Math.PI * 2;
      const radius = 2 + Math.sin(i * 0.3) * 0.3;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = (Math.random() - 0.5) * 0.5;
      particleVertices.push(x, y, z);
    }
    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particleVertices, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.03,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    console.log('Adding lighting...');
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Camera Position
    camera.position.z = 5;

    console.log('Starting animation loop...');
    // Animation Loop
    let time = 0;
    const speed = 1;

    function animate() {
      requestAnimationFrame(animate);

      // Update Time
      time += 0.06 * speed;

      // Rotate Torus
      torus.rotation.x = time * 0.3;
      torus.rotation.y = time * 0.2;

      // Rotate Particles in Opposite Direction
      particles.rotation.z = -time * 0.1;

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