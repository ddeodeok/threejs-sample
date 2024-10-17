// main.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.141.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.141.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.141.0/examples/jsm/controls/OrbitControls.js';
import { initializeExplode, toggleExplode, updateExplode, toggleSecondExplode, secondAnimating, 
  resetSecondExplode, secondExplodeActive, firstExplodeAnimating } from './explode.js';
import { setupInfoBox } from './infoBoxManager.js';  // Import the new module
import { ClippingManager } from './clippingManager.js'; 
import { setupCamera } from './cameraManager.js'; // 카메라 매니저 가져오기
import { setupLights } from './lightManager.js'; // 조명 매니저 가져오기
import { printHierarchy } from './printerManager.js';
import { MeshSelectionManager } from './MeshSelectionManager.js'; // MeshSelectionManager 가져오기


let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas'),
    antialias: true
});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);

let infoBox = document.getElementById('info-box'); // 정보 박스 요소
// 클리핑 매니저 초기화
let clippingManager = new ClippingManager();
clippingManager.enableClipping(renderer);

let loader = new GLTFLoader();
// loader.load('./3d_images/gltf/Car SeatsCar Seat.gltf', function (gltf) {
  loader.load('./3d_images/gltf/gltf3.gltf', function (gltf) {
    // loader.load('./3d_images/gltf/SeatsCar1007-2.gltf', function (gltf) {
    scene.add(gltf.scene);  
    // 모델을 X축을 기준으로 90도 회전시킴 (누워 있는 상태로 변경)
    gltf.scene.rotation.x = Math.PI / 2; // X축을 기준으로 90도 회전 
    initializeExplode(scene); // 여기에서 초기 위치를 저장Model Hierarchy:
    clippingManager.applyClippingToScene(gltf.scene);  // 모델 로드 후 클리핑 적용
    
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const boxSize = box.getSize(new THREE.Vector3()).length();
    const boxCenter = box.getCenter(new THREE.Vector3());
    console.log("박스센터",boxCenter);

    const { camera, controls } = setupCamera(renderer, scene, boxCenter, boxSize); // 카메라 설정
    setupLights(scene); // 조명 설정
    setupInfoBox(scene, camera, renderer, infoBox);  // Setup the infobox interactions
    const meshSelectionManager = new MeshSelectionManager(camera, scene, renderer); // MeshSelectionManager 초기화
    console.log('Model Hierarchy:');
    printHierarchy(gltf.scene);
    // logTopLevelMeshesWithChildren(scene);

    document.getElementById('clippingButton').addEventListener('click', () => {
      clippingManager.toggleClipping();
      clippingManager.applyClippingToScene(scene); // 클리핑 상태가 변경된 후 씬에 다시 적용
      document.getElementById('clippingButton').textContent = clippingManager.isClippingEnabled() ? "Disable Clipping" : "Enable Clipping";
      console.log(`Clipping enabled: ${clippingManager.isClippingEnabled()}`);
    });

    let firstExplodeAnimating = false;
    document.getElementById('toggleExplode').addEventListener('click', function() {
      const selectedMesh = meshSelectionManager.getSelectedMesh();
    
      if (selectedMesh && !secondAnimating) {
          console.log(`Second explode on mesh: ${selectedMesh.name}`);
          console.log(`Second explode selectedMesh 상태: ${selectedMesh}`);
          console.log(`Second explode 상태: ${secondAnimating}`);
          toggleSecondExplode(selectedMesh, renderer, camera, scene);
      } else if (!selectedMesh && !secondAnimating) {
          // 선택된 메쉬가 없고, 애니메이션이 진행 중이 아닌 경우
          if (secondExplodeActive) {
              resetSecondExplode();  // 상태를 재설정
              toggleExplode(); // 원상복귀
          } else if (firstExplodeAnimating) {
              toggleExplode();  // 원상복귀 애니메이션 시작
          } else {
              toggleExplode();  // 분해 시작
          }
      } else {
          console.log("No action taken: animation in progress.");
      }
    
      // // 이 부분을 이벤트 리스너로 변경하여, 애니메이션 완료 후에만 실행되도록 합니다.
      // if (!secondExplodeActive) {
      //   console.log("너가 설마?");
      //   renderer.domElement.addEventListener('animationCompleted', () => updateExplode(scene), { once: true });
      // }
      // 2차 분해 애니메이션이 진행 중이거나 완료되지 않았을 때는 updateExplode 실행 안 함
  if (!secondExplodeActive && !secondAnimating) {
    updateExplode(scene);  // 2차 분해가 활성화되지 않은 경우에만 업데이트 실행
  }
    });
    
    
  
  

    function animate() {
      requestAnimationFrame(animate);
      if (!secondExplodeActive) {
          updateExplode(scene);  // 2차 분해가 활성화되지 않은 경우에만 업데이트 실행
      }
  
      controls.update();
      renderer.render(scene, camera);
  }
  
  animate();

});



