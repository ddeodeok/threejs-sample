import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.141.0/build/three.module.js';

export class MeshSelectionManager {
    constructor(camera, scene, renderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.selectedMesh = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.renderer.domElement.addEventListener('click', (event) => this.onMouseClick(event), false);
    }

    onMouseClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            let clickedObject = intersects[0].object;

             // 최상위 부모 찾기 및 깊이 계산
            const topParent = this.findTopParent(clickedObject);
            const depth = this.findDepthFromTop(clickedObject, topParent);

            console.log(`Clicked object: ${clickedObject.name}, Depth: ${depth}`);

             // 깊이가 3 이상일 경우, 깊이 2인 부모로 선택 변경
            if (depth > 2) {
                clickedObject = this.findParentAtDepth(clickedObject, topParent, 2);
                console.log(`Depth exceeded. Switching selection to depth 2 parent: ${clickedObject.name}`);
            }
            
            // // 클릭된 메쉬와 부모 메쉬들의 이름을 콘솔에 출력
            // console.log(`Clicked object: ${clickedObject.name}`);
            // let parent = clickedObject.parent;
            // while (parent && parent !== this.scene) {
            //     console.log(`Parent: ${parent.name}`);
            //     parent = parent.parent;
            // }

            // // 특정 부모 레벨을 찾기 위해 클릭된 객체의 부모를 거슬러 올라감
            // let targetParent = this.findParentAtLevel(clickedObject, 1, ['01_PCB_ASSY_ASM']);  // 레벨 1 상위 부모 찾기

            // if (targetParent) {
            //     clickedObject = targetParent;  // 부모 메쉬로 변경
            //     console.log(`Parent object selected: ${clickedObject.name}`);
            // }

            // 이전에 선택된 메쉬의 색상을 원래대로 되돌림
            if (this.selectedMesh && this.selectedMesh !== clickedObject) {
                this.clearSelection();
            }

            // 부모 메쉬만 선택하고 강조 표시
            this.selectedMesh = clickedObject;
            console.log(`Selected mesh (after finding parent): ${this.selectedMesh.name}`);

            // 부모 메쉬까지만 강조
            this.applyHighlight(this.selectedMesh, 0xff0000); // 강조 색상 설정
        } else {
            // 선택된 메쉬 외부를 클릭했을 경우 선택 취소
            this.clearSelection();
        }
    }
    // 최상위 부모 찾기
    findTopParent(object) {
        let currentObject = object;
        while (currentObject.parent && currentObject.parent !== this.scene) {
            currentObject = currentObject.parent;
        }
        return currentObject;  // 최상위 부모 반환
    }

    // 클릭된 객체의 깊이를 계산하는 함수
    findDepthFromTop(object, topParent) {
        let depth = 0;
        let currentObject = object;

        while (currentObject !== topParent && currentObject.parent) {
            currentObject = currentObject.parent;
            depth++;
        }

        return depth;
    }
    
    // 특정 깊이의 부모 메쉬 찾기 (깊이 2인 부모를 찾는 함수)
    findParentAtDepth(object, topParent, targetDepth) {
        let depth = this.findDepthFromTop(object, topParent);
        let currentObject = object;

        // 현재 깊이가 targetDepth보다 크면 부모로 계속 올라감
        while (depth > targetDepth) {
            currentObject = currentObject.parent;
            depth--;
        }

        return currentObject;  // 지정한 깊이의 부모 반환
    }

    // 부모 메쉬만 강조 (자식으로 내려가지 않음)
    applyHighlight(object, color) {
        if (object.isMesh) {
            object.material = object.material.clone(); // 메쉬의 소재를 복제하여 색상을 변경
            object.material.emissive.set(color);       // 강조 색상 설정
        }
    }
    applyHighlight(object, color) {
        object.traverse((child) => {
            if (child.isMesh) {
                child.material = child.material.clone();
                child.material.emissive.set(color); // 강조 색상 설정
            }
        });
    }

    getSelectedMesh() {
        return this.selectedMesh;
    }

    clearSelection() {
        if (this.selectedMesh) {
            this.applyHighlight(this.selectedMesh, 0x000000); // 강조 색상 해제
        }
        this.selectedMesh = null;
    }
}
