import * as THREE from "three";
import { createLight } from "./lib/createLights";
import { Player } from "./data/Player";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Stack } from "./data/Stack";

const colors = {
    background: "#24549c",
    board: "#c0c0c0",
    red: "#e22a32",
    darkred: "#962126",
};
const distance = 32;
export default () => {
    const container = document.querySelector("div.gameContainer") as HTMLDivElement;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(colors.background);

    const camera = new THREE.OrthographicCamera(
        window.innerWidth / -30,
        window.innerWidth / 30,
        window.innerHeight / 30,
        window.innerHeight / -30,
        -150,
        150
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
        const ground1 = new THREE.Mesh(
            new THREE.BoxGeometry(60, 1, 60),
            new THREE.MeshBasicMaterial({
                color: colors.red,
            })
        );
        const ground2 = new THREE.Mesh(
            new THREE.BoxGeometry(60, 1, 60),
            new THREE.MeshBasicMaterial({
                color: colors.darkred,
            })
        );
        ground1.position.y = 0.5;

        ground2.position.y = -0.5;

        scene.add(ground2, ground1);

        const xmplayer = new Player();
        scene.add(xmplayer);
        scene.add(new Player(90));
        scene.add(new Player(180));
        scene.add(new Player(270));

        const stepX = 2.25;

        const iX = -4;
        const stepY = 2;

        scene.add(new Stack(7, new THREE.Vector3(iX + -stepX * 2, 0, -stepY)));
        scene.add(new Stack(7, new THREE.Vector3(iX + -stepX, 0, -stepY)));
        scene.add(new Stack(7, new THREE.Vector3(iX, 0, -stepY)));
        scene.add(new Stack(7, new THREE.Vector3(iX + stepX, 0, -stepY)));
        scene.add(new Stack(7, new THREE.Vector3(iX + stepX * 2, 0, -stepY)));
        scene.add(new Stack(6, new THREE.Vector3(iX + -stepX * 2, 0, stepY)));
        scene.add(new Stack(6, new THREE.Vector3(iX + -stepX, 0, stepY)));
        scene.add(new Stack(6, new THREE.Vector3(iX, 0, +stepY)));
        scene.add(new Stack(5, new THREE.Vector3(iX + stepX, 0, stepY)));
        scene.add(new Stack(3, new THREE.Vector3(iX + stepX * 2, 0, stepY)));
        scene.add(new Stack(2, new THREE.Vector3(-iX, 0, 0)));

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
