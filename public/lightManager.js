// lightManager.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.141.0/build/three.module.js';

export function setupLights(scene) {
    // 배경색 설정 (밝은 회색으로 설정)
    scene.background = new THREE.Color(0x303030);

    // 주변광 추가 (모든 방향에서 균일하게 비추도록)
    let ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // 강도 1.5로 설정하여 더 밝게
    scene.add(ambientLight);

    // 첫 번째 방향광 (앞에서 비추는 광원)
    let dirLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight1.position.set(100, 200, 100);
    scene.add(dirLight1);

    // 두 번째 방향광 (뒤에서 비추는 광원)
    let dirLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight2.position.set(-100, 200, -100);
    scene.add(dirLight2);

    // 세 번째 방향광 (위에서 비추는 광원)
    let dirLight3 = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight3.position.set(0, 200, 0);
    scene.add(dirLight3);

    // 네 번째 방향광 (아래에서 비추는 광원)
    let dirLight4 = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight4.position.set(0, -200, 0); // 아래에서 비추도록 설정
    scene.add(dirLight4);

    // 포인트 라이트 추가 (중앙에서 비추는 광원)
    let pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(0, 150, 0);
    scene.add(pointLight);
}
