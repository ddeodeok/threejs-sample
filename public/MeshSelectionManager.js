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
    
            // 클릭된 메쉬와 부모 메쉬들의 이름을 콘솔에 출력
            console.log(`Clicked object: ${clickedObject.name}`);
            let parent = clickedObject.parent;
            while (parent && parent !== this.scene) {
                console.log(`Parent: ${parent.name}`);
                parent = parent.parent;
            }
    
            // 최상위 부모 메쉬까지 찾아 올라감 ('01_PCB_ASSY_ASM'이 있는 곳까지)
            let targetParent = this.findParentAtLevel(clickedObject, ['01_PCB_ASSY_ASM']); 
    
            if (targetParent) {
                clickedObject = targetParent;  // 부모 메쉬로 변경
                console.log(`Parent object selected: ${clickedObject.name}`);
            }
    
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
    

// 특정 부모 레벨 찾기, 특정 이름에 도달하면 멈추는 기능을 추가하여 원하는 상위 부모까지 올라감
findParentAtLevel(object, stopNames = []) {
    let currentObject = object;

    // 부모를 계속 타고 올라가면서 stopNames에 있는 이름을 찾을 때까지 반복
    while (currentObject.parent && currentObject.parent !== this.scene) {
        if (stopNames.includes(currentObject.name)) {
            break;
        }
        currentObject = currentObject.parent; // 부모로 계속 올라감
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
