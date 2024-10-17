// cameraManager.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.141.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.141.0/examples/jsm/controls/OrbitControls.js';

export function setupCamera(renderer, scene, boxCenter, boxSize) {
    let camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-50500, 30000, 15200);
    // camera.position.set(10000, -10000, 5000);
    camera.lookAt(boxCenter);
    // camera.rotation.set(1, 1, 1); 


    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    

    const distance = boxSize / (2 * Math.tan(Math.PI * camera.fov / 360));
    const direction = new THREE.Vector3().subVectors(camera.position, boxCenter).normalize();
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
    camera.lookAt(boxCenter);

    return { camera, controls };
}
