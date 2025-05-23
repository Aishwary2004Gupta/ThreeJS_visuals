import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
// import getBgSphere from "./getBgSphere.js";
import { OBJLoader } from "jsm/loaders/OBJLoader.js"

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 7;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; //make the mesh move (smooth)
// controls.dampingFactor = 0.02;

const texLoader = new THREE.TextureLoader();
function initScene(data) {
    //hand model
    const { geo } = data;
    geo.center();
    geo.rotateX(-Math.PI / 2); // Rotate the geometry to make it horizontal
    const material = new THREE.MeshMatcapMaterial({
        matcap: texLoader.load("../assets/bronze.png"),
    });

    const mesh = new THREE.Mesh(geo, material);
    mesh.scale.setScalar(29);
    scene.add(mesh);

    //lens plane
    const lensGeo = new THREE.PlaneGeometry(10, 10, 10, 10);
    const positions = lensGeo.attributes.position.array;
    const len = positions.length;
    for (let i = 0; i < len; i += 1) {
        const randomZPos = Math.random() * 0.4 - 0.2;
        if (i % 3 === 2) {
            positions[i] += randomZPos;
        }
    }
    lensGeo.computeVertexNormals();
    const lensMat = new THREE.MeshPhysicalMaterial({
        roughness: 0.0,
        transmission: 1,
        thickness: 2,
        // flatShading: true,
    });
    const lensMesh = new THREE.Mesh(lensGeo, lensMat);
    lensMesh.position.z = 2;
    // scene.add(lensMesh); //lens 

    // scene.add(getBgSphere());

    const timeMult = 0.0005;
    function animate(timeStep = 0) {
        requestAnimationFrame(animate);
        mesh.rotation.y = timeStep * timeMult;
        lensMesh.rotation.z = timeStep * -timeMult;
        renderer.render(scene, camera);
        controls.update();
    }
    animate();
}

//OBJLoader
const sceneData = { geo: null };
const manager = new THREE.LoadingManager();
manager.onLoad = () => initScene(sceneData);
const loader = new OBJLoader(manager);
loader.load("../assets/horse.obj", (obj) => {
    let geo;
    obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            geo = child.geometry;
        }
    });
    sceneData.geo = geo;
});

function meshleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', meshleWindowResize, true);
