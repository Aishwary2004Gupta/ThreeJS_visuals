import * as THREE from "three";

function getBody() {
    const size = 0.5;
    const range = 2;
    let x = Math.random() * range - range * 0.5;
    let y = Math.random() * range - range * 0.5 + 0;
    let z = Math.random() * range - range * 0.5;
    const geometry = new THREE.SphereGeometry(size);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        flatShading: true
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    const wireMat = new THREE.MeshBasicMaterial({
        color: 0x000,
        wireframe: true
    });
    const wireMesh = new THREE.Mesh(geometry, wireMat);
    wireMesh.scale.setScalar(1.001);
    mesh.add(wireMesh);
    return { mesh };
}

// mouse ball
function getMouseBall() {
    const mouseSize = 0.25;
    const geometry = new THREE.IcosahedronGeometry(mouseSize, 8);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
    });
    const mouseLight = new THREE.PointLight(0xffffff, 2); //point light 
    const mouseMesh = new THREE.Mesh(geometry, material);
    mouseMesh.add(mouseLight);

    // moving where the mouse moves
    function update(mousePos) {
        let { x, y, z } = { x: mousePos.x * 5, y: mousePos.y * 5, z: 1 };
        mouseMesh.position.set(x, y, z);
    }
    return { mesh: mouseMesh, update };
}

export { getBody, getMouseBall};