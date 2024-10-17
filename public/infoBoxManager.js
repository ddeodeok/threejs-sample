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
            const clickedObject = intersects[0].object;

            // 특정 부모 레벨을 찾기 위해 클릭된 객체의 부모를 거슬러 올라감
            // let targetParent = findParentAtLevel(clickedObject, 1, scene);  // 레벨 1 상위 부모 찾기
            let targetParent = findParentAtLevel(clickedObject, ['01_PCB_ASSY_ASM']); 
          //   if (targetParent) {
          //     clickedObject = targetParent;  // 상위 부모로 변경
          // }
            // 클릭된 객체에 따라 정보 표시
            if (targetParent) { 
                infoBox.style.display = 'block'; // 정보 박스를 보이게 함
                infoBox.innerHTML = `
                  <div style="text-align: center;"><strong>${targetParent.name}</strong></div>
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


// 특정 부모 레벨 찾기, 특정 이름에 도달하면 멈추는 기능을 추가하여 원하는 상위 부모까지 올라감
function findParentAtLevel(object, stopNames = []) {
    let currentObject = object;

    // 부모를 계속 타고 올라가면서 stopNames에 있는 이름을 찾을 때까지 반복
    while (currentObject.parent && currentObject.parent !== object) {
        if (stopNames.includes(currentObject.name)) {
            break;
        }
        currentObject = currentObject.parent; // 부모로 계속 올라감
    }

    return currentObject;
}
