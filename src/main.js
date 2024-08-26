import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { initializeExplode, toggleExplode, updateExplode } from './explode.js';

let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas'),
    antialias: true
});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);

let camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 15);

let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let infoBox = document.getElementById('info-box'); // 정보 박스 요소

let loader = new GLTFLoader();
loader.load('/3d_images/scene.gltf', function (gltf) {
    scene.add(gltf.scene);

    const box = new THREE.Box3().setFromObject(gltf.scene);
    const boxSize = box.getSize(new THREE.Vector3()).length();
    const boxCenter = box.getCenter(new THREE.Vector3());

    controls.target.copy(boxCenter);

    const distance = boxSize / (2 * Math.tan(Math.PI * camera.fov / 360));
    const direction = new THREE.Vector3()
        .subVectors(camera.position, boxCenter)
        .normalize();
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

    camera.lookAt(boxCenter);

    let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    let dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(0, 5, 5);
    scene.add(dirLight);

    function onDocumentMouseClick(event) {
        event.preventDefault();
        console.log("click");

        // 마우스 위치 계산
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        console.log("마우스 위치", mouse.x);

        // Raycaster를 사용해 마우스 위치에서의 객체를 감지
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            // 클릭된 객체에 따라 정보 표시
            if (clickedObject) { 
                infoBox.style.display = 'block'; // 정보 박스를 보이게 함
                infoBox.innerHTML = `
                  <div style="text-align: center;"><strong>자동차</strong></div>
                  <hr style="border: 2px solid black; margin: 5px 0;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 5px; font-weight: bold;">색깔</td>
                      <td style="padding: 5px;">노랑색</td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        <hr style="border: 1px solid black; margin: 5px 0;">
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 5px; font-weight: bold;">배기량</td>
                      <td style="padding: 5px;">2000cc</td>
                    </tr>
                  </table>
                `; 
            } else {
                infoBox.style.display = 'block';
                infoBox.innerHTML = `<strong>${clickedObject.name}</strong><br>다른 부품에 대한 설명입니다.`;
            }
        } else {
            infoBox.style.display = 'none'; // 클릭이 모델 외부일 때 정보 박스를 숨김
        }
    }

    window.addEventListener('click', onDocumentMouseClick, false);
    document.getElementById('toggleExplode').addEventListener('click', toggleExplode);
    function animate() {
        requestAnimationFrame(animate);
        updateExplode();
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
});
