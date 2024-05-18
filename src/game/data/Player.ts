import * as THREE from "three";

export class Player extends THREE.Group {
    constructor(angle: number = 0) {
        super();

        const main = new THREE.Mesh(new THREE.BoxGeometry(30, 8, 1), new THREE.MeshBasicMaterial({ color: "#252525" }));
        const middle = new THREE.Mesh(new THREE.BoxGeometry(25, 8, 0.2), new THREE.MeshBasicMaterial({ color: "#cccccc" }));

        main.position.y = 4;
        main.position.z = 25;
        main.rotation.x = -0.5;
        middle.position.y = 2;
        middle.position.z = 23;
        middle.rotation.x = 1;

        super.add(middle);
        super.add(main);
        this.rotation.y = THREE.MathUtils.degToRad(angle);
    }

    public update() {}
}
