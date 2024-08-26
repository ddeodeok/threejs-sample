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

            // 클릭된 객체에 따라 정보 표시
            if (clickedObject) { 
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
                infoBox.innerHTML = `<strong>${clickedObject.name}</strong><br>다른 부품에 대한 설명입니다.`;
            }
        } else {
            infoBox.style.display = 'none'; // 클릭이 모델 외부일 때 정보 박스를 숨김
        }
    }

    window.addEventListener('click', onDocumentMouseClick, false);
}
