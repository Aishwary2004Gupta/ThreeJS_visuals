import * as THREE from 'three';

// Constants for grass geometry
const GRASS_BLADES = 1024;
const GRASS_BLADE_VERTICES = 15;
const GRASS_VERTICES_HIGH = 15;
const GRASS_VERTICES_LOW = 3;
const GRASS_LOD_DIST = 50;

// Function to create grass geometry
function CreateTileGeometry(NUM_VERTICES) {
    const offsets = [];
    for (let i = 0; i < GRASS_BLADES; i++) {
        const x = Math.random() - 0.5;
        const y = Math.random() - 0.5;
        offsets.push(x, y, 0);
    }

    const offsetsData = new Float32Array(offsets);
    const vertID = new Uint8Array(NUM_VERTICES).map((_, i) => i);

    const geo = new THREE.InstancedBufferGeometry();
    geo.instanceCount = GRASS_BLADES;
    geo.setAttribute('position', new THREE.Float32BufferAttribute(offsetsData, 3));
    geo.setAttribute('vertIndex', new THREE.Uint8BufferAttribute(vertID, 1));
    return geo;
}

// Create high and low LOD geometries
const highLOD = CreateTileGeometry(GRASS_VERTICES_HIGH);
const lowLOD = CreateTileGeometry(GRASS_VERTICES_LOW);

// Shader material for grass
const grassMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        // Vertex Shader Code
        // ...existing code...
        float curveAmount = randomLean * heightPercent;
        mat3 grassMat = rotateX(curveAmount);
        vec3 grassVertexPosition = grassMat * vec3(x, y, 0.0);
        // ...existing code...
    `,
    fragmentShader: `
        // Fragment Shader Code
        // ...existing code...
        vec3 baseColour = vec3(0.05, 0.2, 0.01);
        vec3 tipColour = vec3(0.5, 0.5, 0.1);
        vec3 diffuseColour = mix(baseColour, tipColour, easeIn(heightPercent, 4.0));
        // ...existing code...
    `,
    uniforms: {
        time: { value: 0 },
        windDir: { value: new THREE.Vector2(1, 0) },
        // ...other uniforms...
    }
});

// Add grass to the scene
const scene = new THREE.Scene();
const grassMesh = new THREE.Mesh(highLOD, grassMaterial);
scene.add(grassMesh);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5); // Adjust position to view the grass

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Animation loop
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    grassMaterial.uniforms.time.value = clock.getElapsedTime();
    renderer.render(scene, camera); // Ensure rendering the scene
}
animate();