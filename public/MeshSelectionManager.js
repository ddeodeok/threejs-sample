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

            // 특정 부모 레벨을 찾기 위해 클릭된 객체의 부모를 거슬러 올라감
            let targetParent = this.findParentAtLevel(clickedObject, 1);  // 레벨 1 상위 부모 찾기

            if (targetParent) {
                clickedObject = targetParent;
            }

            // 이전에 선택된 메쉬의 색상을 원래대로 되돌림
            if (this.selectedMesh && this.selectedMesh !== clickedObject) {
                this.clearSelection();
            }

            // 클릭된 메쉬를 선택하고 강조 표시
            this.selectedMesh = clickedObject;
            console.log(`Selected mesh: ${this.selectedMesh.name}`);

            // 부모와 모든 자식 메쉬들을 강조
            this.applyHighlight(this.selectedMesh, 0xff0000); // 강조 색상 설정
        } else {
            // 선택된 메쉬 외부를 클릭했을 경우 선택 취소
            this.clearSelection();
        }
    }

    findParentAtLevel(object, level) {
        let currentObject = object;
        for (let i = 0; i < level; i++) {
            if (currentObject.parent && currentObject.parent !== this.scene) {
                currentObject = currentObject.parent;
            } else {
                break;
            }
        }
        return currentObject;
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
