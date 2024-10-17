// infoBoxManager.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.141.0/build/three.module.js';

export function setupInfoBox(scene, camera, renderer, infoBox) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onDocumentMouseClick(event) {
        event.preventDefault();
        // console.log("click");

        // 마우스 위치 계산
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        // console.log("마우스 위치", mouse.x);

        // Raycaster를 사용해 마우스 위치에서의 객체를 감지
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            let clickedObject = intersects[0].object;

          // 최상위 부모 찾기 및 깊이 계산
          const topParent = findTopParent(clickedObject);
          const depth = findDepthFromTop(clickedObject, topParent);

          console.log(`Clicked object: ${clickedObject.name}, Depth: ${depth}`);

          // 깊이가 3 이상일 경우, 깊이 2인 부모로 선택 변경
          if (depth > 2) {
              clickedObject = findParentAtDepth(clickedObject, topParent, 3);
              console.log(`Depth exceeded. Switching selection to depth 2 parent: ${clickedObject.name}`);
          }
            // 클릭된 객체에 따라 정보 표시
            if (clickedObject.name) { 
                infoBox.style.display = 'block'; // 정보 박스를 보이게 함
                infoBox.innerHTML = `
                  <div style="text-align: center;"><strong>${clickedObject.name}</strong></div>
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
                infoBox.innerHTML = `<strong>${targetParent.name}</strong><br>다른 부품에 대한 설명입니다.`;
            }
        } else {
            infoBox.style.display = 'none'; // 클릭이 모델 외부일 때 정보 박스를 숨김
        }
    }

    window.addEventListener('click', onDocumentMouseClick, false);
}

    // 최상위 부모 찾기
  function findTopParent(object,scene) {
      let currentObject = object;
      while (currentObject.parent && currentObject.parent !== scene) {
          currentObject = currentObject.parent;
      }
      return currentObject;  // 최상위 부모 반환
  }

  // 클릭된 객체의 깊이를 계산하는 함수
  function findDepthFromTop(object, topParent) {
      let depth = 0;
      let currentObject = object;

      while (currentObject !== topParent && currentObject.parent) {
          currentObject = currentObject.parent;
          depth++;
      }

      return depth;
  }
// 특정 깊이의 부모 메쉬 찾기 (깊이 2인 부모를 찾는 함수)
function findParentAtDepth(object, topParent, targetDepth) {
  let depth = findDepthFromTop(object, topParent);
  let currentObject = object;

  // 현재 깊이가 targetDepth보다 크면 부모로 계속 올라감
  while (depth > targetDepth) {
      currentObject = currentObject.parent;
      depth--;
  }

  return currentObject;  // 지정한 깊이의 부모 반환
}