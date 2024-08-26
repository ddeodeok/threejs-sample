import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.141.0/build/three.module.js';

let explodeFactor = 0;
let isExploding = false;
const initialPositions = new Map();  // 초기 로컬 좌표
const worldPositions = new Map();    // 월드 좌표
let modelCenter = new THREE.Vector3();
let targetExplodeFactor = 0;  // 목표 explodeFactor
let animationSpeed = 0.1;  // 애니메이션 속도 조정
let isAnimating = false; // 애니메이션 진행 중 여부

export let secondExplodeActive = false;  // 2차 분해가 활성화되었는지 여부를 전역으로 관리
let secondExplodeFactor = 0;  // 2차 분해의 진행 상태를 저장
export let secondAnimating = false;  // 2차 분해 상태를 전역으로 관리

export function initializeExplode(scene) {
    let count = 0;
    let center = new THREE.Vector3();
    scene.traverse(function(child) {
        if (child.isMesh) {
            initialPositions.set(child, child.position.clone());  // 로컬 좌표로 초기 위치를 설정
            center.add(child.position);
            count++;
        }
    });
    if (count > 0) {
        center.divideScalar(count);  // 평균 위치 계산
        modelCenter.copy(center);  // 모델의 중심점을 업데이트
        console.log("Model center calculated as: ", modelCenter);
    }
}

export function toggleExplode() {
    if (isAnimating) return;  // 애니메이션 중이면 중복 실행 방지

    // 2차 분해 상태 초기화
    resetSecondExplode();

    isExploding = !isExploding;
    targetExplodeFactor = isExploding ? 0.03 : 0;  // 목표 explodeFactor 설정
    console.log("Exploding toggled: ", isExploding, " Target Explode Factor: ", targetExplodeFactor);

    if (isExploding && worldPositions.size === 0) {
        // 처음 한 번만 월드 좌표를 계산
        updateWorldPositions();
    }

    isAnimating = true;  // 애니메이션 시작
    animateExplode();
}

function updateWorldPositions() {
    initialPositions.forEach((initialPosition, child) => {
        const worldPosition = new THREE.Vector3();
        child.getWorldPosition(worldPosition);
        worldPositions.set(child, worldPosition);  // 월드 좌표로 업데이트
        console.log(`Updated World Position for ${child.name}: ${worldPosition.x}, ${worldPosition.y}, ${worldPosition.z}`);
    });
}

export function updateExplode() {
    if (secondExplodeActive) {
        // 2차 분해가 활성화된 상태라면 이 함수를 실행하지 않음
        console.log("Skipping updateExplode due to active second explode.");
        return;
    }

    initialPositions.forEach((initialPosition, child) => {
        let newPosition;
        if (explodeFactor > 0) {
            const direction = worldPositions.get(child).clone().sub(modelCenter).normalize();
            newPosition = initialPosition.clone().add(direction.multiplyScalar(explodeFactor));
        } else {
            newPosition = initialPosition.clone();
        }
        child.position.copy(newPosition);
    });
}

function animateExplode() {
    if (Math.abs(explodeFactor - targetExplodeFactor) > 0.01) {
        explodeFactor += (targetExplodeFactor - explodeFactor) * animationSpeed;
        updateExplode();
        requestAnimationFrame(animateExplode);
    } else {
        explodeFactor = targetExplodeFactor;
        updateExplode();
        isAnimating = false;
    }
}

// 2차 분해 기능 추가
export function toggleSecondExplode(selectedMesh, renderer, camera, scene) {
    if (secondAnimating || !selectedMesh || isAnimating) {
        console.log("Second animation is already running, no mesh selected, or first animation is still running.");
        return;
    }

    // 이미 2차 분해가 활성화된 경우, 되돌아가도록 처리
    if (secondExplodeActive) {
        secondAnimating = true;
        secondExplodeFactor = 0; // 되돌아가기 위해 0으로 설정

        function reverseSecondExplode() {
            if (Math.abs(secondExplodeFactor - 0) > 0.01) {
                secondExplodeFactor += (0 - secondExplodeFactor) * 0.05;

                initialPositions.forEach((initialPosition, child) => {
                    child.position.copy(initialPosition); // 초기 위치로 되돌림
                });

                renderer.render(scene, camera);
                console.log("Reversing second explode...");

                requestAnimationFrame(reverseSecondExplode);
            } else {
                secondExplodeFactor = 0;
                console.log("Second explode reversed.");
                secondAnimating = false;
                secondExplodeActive = false; // 2차 분해 비활성화
            }
        }

        reverseSecondExplode();
        return;
    }

    const secondInitialPositions = new Map();
    const secondWorldPositions = new Map();
    const targetSecondExplodeFactor = 0.05;  // 목표 값을 더 크게 설정

    selectedMesh.traverse((child) => {
        if (child.isMesh && child !== selectedMesh) {
            secondInitialPositions.set(child, child.position.clone());
            const worldPosition = new THREE.Vector3();
            child.getWorldPosition(worldPosition);

            const randomOffset = new THREE.Vector3(
                Math.random() * 0.2 - 0.1,
                Math.random() * 0.2 - 0.1,
                Math.random() * 0.2 - 0.1
            );
            worldPosition.add(randomOffset);

            secondWorldPositions.set(child, worldPosition);
            console.log(`Child added for explode: ${child.name} with offset position: ${worldPosition.x}, ${worldPosition.y}, ${worldPosition.z}`);
        }
    });

    if (secondInitialPositions.size === 0) {
        console.log("No child meshes to explode.");
        return;
    }

    secondAnimating = true;  // 애니메이션 시작
    secondExplodeFactor = 0; // 초기화

    function animateSecondExplode() {
        if (Math.abs(secondExplodeFactor - targetSecondExplodeFactor) > 0.01) {
            secondExplodeFactor += (targetSecondExplodeFactor - secondExplodeFactor) * 0.05;

            secondInitialPositions.forEach((initialPosition, child) => {
                const direction = secondWorldPositions.get(child).clone().sub(selectedMesh.position).normalize();
                const newPosition = initialPosition.clone().add(direction.multiplyScalar(secondExplodeFactor));
                child.position.copy(newPosition);
            });

            renderer.render(scene, camera);
            console.log("Animating second explode...");

            requestAnimationFrame(animateSecondExplode);
        } else {
            secondExplodeFactor = targetSecondExplodeFactor;
            console.log("Second explode animation completed.");
            secondAnimating = false;
            secondExplodeActive = true; // 2차 분해 활성화 상태로 유지
        }
    }

    animateSecondExplode();
}
export function resetSecondExplode() {
    secondExplodeFactor = 0;
    secondAnimating = false;
    secondExplodeActive = false; // 2차 분해 상태 초기화

    // 초기 위치로 되돌리기
    initialPositions.forEach((initialPosition, child) => {
        child.position.copy(initialPosition);
    });
}
