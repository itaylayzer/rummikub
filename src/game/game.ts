import * as THREE from "three";
import { createLight } from "./lib/createLights";
import { loadedAssets } from "../viewmodels/useAssetLoader";
import { Player } from "./data/Player";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Stack } from "./data/Stack";

const colors = {
    background: "#24549c",
    board: "#c0c0c0",
    wood: "#e22a32",
};
const distance = 32;
export default (assets: loadedAssets) => {
    const container = document.querySelector("div.gameContainer") as HTMLDivElement;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(colors.background);

    const camera = new THREE.OrthographicCamera(
        container.clientWidth / -distance,
        container.clientWidth / distance,
        container.clientHeight / distance,
        container.clientHeight / -distance,
        1,
        1000
    );
    camera.position.set(distance, distance, distance * 2);

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    //#region LIGHTS
    createLight(
        [
            {
                color: 0xffffff,
                intensity: 2,
                type: "directional",
                rot: new THREE.Euler(0.1, 0.1, 0),
            },
            {
                color: 0xffffff,
                intensity: 0.7,
                type: "ambient",
                rot: new THREE.Euler(0.9, 0.5, 0),
            },
            {
                color: 0xffffff,
                intensity: 150,
                type: "spot",
                pos: new THREE.Vector3(0, 0, 10),
                rot: new THREE.Euler(0, 0, 0),
            },
        ],
        scene
    );
    //#endregion
    const updates: (() => void)[] = [];

    function _createMap() {
        scene.add(
            new THREE.Mesh(
                new THREE.BoxGeometry(60, 1, 60),
                new THREE.MeshBasicMaterial({
                    color: colors.wood,
                })
            )
        );

        const xmplayer = new Player();
        scene.add(xmplayer);
        scene.add(new Player(90));
        scene.add(new Player(180));
        scene.add(new Player(270));

        const stepX = 2.25;

        const iX = -3.5;
        const stepY = 2;

        scene.add(new Stack(7, new THREE.Vector3(iX + -stepX * 2, 0, -stepY)));
        scene.add(new Stack(7, new THREE.Vector3(iX + -stepX, 0, -stepY)));
        scene.add(new Stack(7, new THREE.Vector3(iX + stepX, 0, -stepY)));
        scene.add(new Stack(7, new THREE.Vector3(iX + stepX * 2, 0, -stepY)));
        scene.add(new Stack(7, new THREE.Vector3(iX + -stepX * 0, 0, stepY)));
        scene.add(new Stack(7, new THREE.Vector3(iX + -stepX * 0, 0, -stepY)));
        scene.add(new Stack(7, new THREE.Vector3(iX + -stepX * 2, 0, stepY)));
        scene.add(new Stack(7, new THREE.Vector3(iX + -stepX, 0, stepY)));
        scene.add(new Stack(7, new THREE.Vector3(iX + stepX, 0, stepY)));
        scene.add(new Stack(7, new THREE.Vector3(iX + stepX * 2, 0, stepY)));
        scene.add(new Stack(5, new THREE.Vector3(-iX, 0, 0)));

        updates.push(() => {
            xmplayer.update();
        });
    }

    function _documentEvents() {
        function onWindowResize() {
            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
        }
        window.addEventListener("resize", onWindowResize);
    }

    _createMap();
    _documentEvents();

    function animate() {
        requestAnimationFrame(animate);

        updates.map((fn) => fn());
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
    return {
        destroyer: () => {
            while (container.firstChild) container.removeChild(container.firstChild);
        },
    };
};
