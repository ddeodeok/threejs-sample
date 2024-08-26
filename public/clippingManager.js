// clippingManager.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.141.0/build/three.module.js';

export class ClippingManager {
    constructor() {
        this.clipPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), Infinity); // 클리핑 비활성화 상태로 시작
        this.enabled = false;
    }

    enableClipping(renderer) {
        renderer.localClippingEnabled = true;
    }

    applyClippingToScene(scene) {
        scene.traverse((child) => {
            if (child.isMesh) {
                if (this.enabled) {
                    child.material.clippingPlanes = [this.clipPlane];
                    child.material.clipIntersection = true;
                } else {
                    child.material.clippingPlanes = [];
                    child.material.needsUpdate = true;
                }
            }
        });
    }

    setClipPlanePosition(distance) {
        if (this.enabled) {
            this.clipPlane.constant = distance;
        }
    }

    setClipPlaneDirection(normal) {
        if (this.enabled) {
            this.clipPlane.normal.copy(normal).normalize();
        }
    }

    toggleClipping() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.clipPlane.constant = Infinity; // 클리핑 비활성화 시 무한대로 설정
        } else {
            this.clipPlane.constant = 0; // 클리핑 활성화 시 초기 값으로 설정
        }
    }

    isClippingEnabled() {
        return this.enabled;
    }
}
