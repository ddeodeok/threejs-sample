import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.141.0/build/three.module.js';

// printerManager.js
export function printHierarchy(object, level = 0, maxLevel = { value: 0 }) {
    const indent = ' '.repeat(level * 2); 
    const worldPosition = new THREE.Vector3();
    object.getWorldPosition(worldPosition);  // 월드 좌표 얻기
    
    // 자식이 있는 메쉬만 출력 (최소 단위 메쉬는 건너뜀)
    if (object.children.length > 0) {
        console.log(`${indent}${object.name || '(no name)'} -  (${worldPosition.x.toFixed(2)}, ${worldPosition.y.toFixed(2)}, ${worldPosition.z.toFixed(2)})`);
    }

    // 현재 레벨을 maxLevel과 비교하여 최대 깊이 갱신
    if (level > maxLevel.value) {
        maxLevel.value = level;
    }

    // 자식이 있을 경우에만 재귀적으로 탐색
    if (object.children.length > 0) {
        object.children.forEach(child => {
            printHierarchy(child, level + 1, maxLevel);  // 자식 객체에 대해 재귀 호출
        });
    }

    // 최종적으로 최대 깊이를 출력
    if (level === 0) {
        console.log(`최대 깊이: ${maxLevel.value}`);
    }
}

