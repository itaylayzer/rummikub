import * as THREE from "three";
function facetedBox(w: number, h: number, d: number, f: number, isWireframed: boolean) {
    let hw = w * 0.5,
        hh = h * 0.5,
        hd = d * 0.5;
    let vertices = [
        // px
        hw,
        hh - f,
        -hd + f, // 0
        hw,
        -hh + f,
        -hd + f, // 1
        hw,
        -hh + f,
        hd - f, // 2
        hw,
        hh - f,
        hd - f, // 3

        // pz
        hw - f,
        hh - f,
        hd, // 4
        hw - f,
        -hh + f,
        hd, // 5
        -hw + f,
        -hh + f,
        hd, // 6
        -hw + f,
        hh - f,
        hd, // 7

        // nx
        -hw,
        hh - f,
        hd - f, // 8
        -hw,
        -hh + f,
        hd - f, // 9
        -hw,
        -hh + f,
        -hd + f, // 10
        -hw,
        hh - f,
        -hd + f, // 11

        // nz
        -hw + f,
        hh - f,
        -hd, // 12
        -hw + f,
        -hh + f,
        -hd, // 13
        hw - f,
        -hh + f,
        -hd, // 14
        hw - f,
        hh - f,
        -hd, // 15

        // py
        hw - f,
        hh,
        -hd + f, // 16
        hw - f,
        hh,
        hd - f, // 17
        -hw + f,
        hh,
        hd - f, // 18
        -hw + f,
        hh,
        -hd + f, // 19

        // ny
        hw - f,
        -hh,
        -hd + f, // 20
        hw - f,
        -hh,
        hd - f, // 21
        -hw + f,
        -hh,
        hd - f, // 22
        -hw + f,
        -hh,
        -hd + f, // 23
    ];

    let indices = [
        0, 2, 1, 3, 2, 0, 4, 6, 5, 7, 6, 4, 8, 10, 9, 11, 10, 8, 12, 14, 13, 15, 14, 12, 16, 18, 17, 19, 18, 16, 20, 21, 22, 23, 20, 22,

        // link the sides
        3, 5, 2, 4, 5, 3, 7, 9, 6, 8, 9, 7, 11, 13, 10, 12, 13, 11, 15, 1, 14, 0, 1, 15,

        // link the lids
        // top
        16, 3, 0, 17, 3, 16, 17, 7, 4, 18, 7, 17, 18, 11, 8, 19, 11, 18, 19, 15, 12, 16, 15, 19,
        // bottom
        1, 21, 20, 2, 21, 1, 5, 22, 21, 6, 22, 5, 9, 23, 22, 10, 23, 9, 13, 20, 23, 14, 20, 13,

        // corners
        // top
        3, 17, 4, 7, 18, 8, 11, 19, 12, 15, 16, 0,
        // bottom
        2, 5, 21, 6, 9, 22, 10, 13, 23, 14, 1, 20,
    ];

    let indicesWire = [
        0,
        1,
        1,
        2,
        2,
        3,
        3,
        0,
        4,
        5,
        5,
        6,
        6,
        7,
        7,
        4,
        8,
        9,
        9,
        10,
        10,
        11,
        11,
        8,
        12,
        13,
        13,
        14,
        14,
        15,
        15,
        12,
        16,
        17,
        17,
        18,
        18,
        19,
        19,
        16,
        20,
        21,
        21,
        22,
        22,
        23,
        23,
        20,
        // link the sides
        2,
        5,
        3,
        4, //px - pz
        6,
        9,
        7,
        8, // pz - nx
        10,
        13,
        11,
        12, // nx - nz
        15,
        0,
        14,
        1, // nz - px

        // link the lids
        // top
        16,
        0,
        17,
        3, // px
        17,
        4,
        18,
        7, // pz
        18,
        8,
        19,
        11, // nx
        19,
        12,
        16,
        15, // nz
        // bottom
        20,
        1,
        21,
        2,
        21,
        5,
        22,
        6,
        22,
        9,
        23,
        10,
        23,
        13,
        20,
        14,
    ];

    let geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geom.setIndex(isWireframed ? indicesWire : indices);
    if (!isWireframed) geom.computeVertexNormals();
    return geom;
}

export class Stack extends THREE.Group {
    constructor(count: number = 7, vec: THREE.Vector3 = new THREE.Vector3()) {
        super();
        let y = 0;
        let iy = 1;
        const h = 0.5;
        while (--count >= 0) {
            let geom = facetedBox(2, h, 3, 0.15, false);
            const color = y % 2 ? 255 : 230;
            let mesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({ color: `rgb(${color},${color},${color})` }));

            mesh.position.y = y++ * h + iy;
            super.add(mesh);
        }
        this.position.copy(vec);
    }
}
