import '/src/CSS/style.css'
import '/src/CSS/cakrro.css'
import '/src/JS/daypilot/daypilot-init.js'

import * as THREE from 'three';
import * as TWEEN from "@tweenjs/tween.js";

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';

import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { getOutlineEffect, configureOutlineEffectSettings_Default, addOutlinesBasedOnIntersections } from '/helpers/OutlineHelper.js';


const FOV = 30;


//--- Setup Scene and Camera ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    alpha: true,
    antialias: true,
});
camera.near = 1;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.layers.enable(1);
renderer.render(scene, camera);


//--- Setup lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const lightOne = new THREE.DirectionalLight(0xffffff, 2);
lightOne.position.set(0, 5, -29);
lightOne.scale.set(4, 1, 1);
lightOne.target.position.set(0, 0, 0);
scene.add(lightOne);

const lightTwo = new THREE.DirectionalLight(0xffffff, 2);
lightTwo.position.set(-18, 5, -7);
lightTwo.scale.set(1, 1, 4);
lightTwo.target.position.set(0, 0, -7);
scene.add(lightTwo);

const lightThree = new THREE.DirectionalLight(0xffffff, 3);
lightThree.position.set(-8, 2, 10);
lightThree.scale.set(0.4, 0.5, 0.6);
lightThree.target.position.set(-8, 0, 10);
scene.add(lightThree)

// const directionalLightHelper = new THREE.DirectionalLightHelper(lightThree, 5);
// scene.add(directionalLightHelper);

//--- Setup Helpers
// const gridHelper = new THREE.GridHelper(200, 50);
// const axesHelper = new THREE.AxesHelper(50);
// scene.add(gridHelper, axesHelper);

//--- Post Processing
const composer = new EffectComposer(renderer);

//Setup renderPass and add it to the composer
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const outlinePass = getOutlineEffect(window, scene, camera);
configureOutlineEffectSettings_Default(outlinePass);
composer.addPass(outlinePass);

//--- Setup Camera Controls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enablePan = false;
orbitControls.enableZoom = true;
orbitControls.maxPolarAngle = Math.PI / 2;
// orbitControls.minAzimuthAngle = -Math.PI;
// orbitControls.maxAzimuthAngle = Math.PI;

//--- Import 3D Objects
let object = new THREE.Object3D;
const loader = new GLTFLoader();
const rooms = ['Room001', 'Room002', 'BoxScrivania001', 'BoxScrivania002', 'BoxScrivania003', 'BoxScrivania004', 'BoxScrivania005', 'BoxScrivania006', 'BoxScrivania007', 'BoxScrivania008', 'BoxScrivania009', 'BoxScrivania010'];
loader.load('/nube_office_3.gltf',
    function (gltf) {

        const box = new THREE.Box3().setFromObject(gltf.scene);
        const c = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        orbitControls.target.set(c.x, -size.y / 2 - c.y, c.z);
        camera.position.set(c.x, 40, c.z);

        rooms.forEach(el => {
            let obj = gltf.scene.getObjectByName(el, true);
            if (obj != undefined) {
                obj.material.transparent = true;
                obj.material.opacity = 0;
                obj.layers.set(1);

                // const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
                // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                // const cube = new THREE.Mesh(geometry, material);
                // cube.position.set(obj.position.x, obj.position.y, obj.position.z);
                // scene.add(cube);
            }
        })

        object = gltf.scene;
        scene.add(object);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100).toFixed(2) + '% loaded scene');
    },
    function (error) {
        console.error(error);
    }
);

//---
//--- Setup RayCaster for object clicking
const raycaster = new THREE.Raycaster();
raycaster.layers.set(1);
//---
//--- Imports HDRI
// let hdrTexture = new RGBELoader().load('/room.hdr');
// let skySphereGeometry = new THREE.SphereGeometry(300, 60, 60);
// let skySphereMaterial = new THREE.MeshPhongMaterial({
//     map: hdrTexture
// });
// skySphereMaterial.side = THREE.BackSide;
// let skySphereMesh = new THREE.Mesh(skySphereGeometry, skySphereMaterial);
// scene.add(skySphereMesh);
//---

let gIsOnDiv = false;

document.querySelector(".info-panel").addEventListener("mouseenter", function () { gIsOnDiv = true });
document.querySelector(".info-panel").addEventListener("mouseleave", function () { gIsOnDiv = false });

//--- EventListeners
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.addEventListener('click', function (event) {
    event.stopPropagation();
    let infoPanel = document.querySelector(".info-panel");
    let infoPanelTitle = document.querySelector(".info-panel-title");
    const coords = new THREE.Vector2(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -((event.clientY / renderer.domElement.clientHeight) * 2 - 1)
    );
    raycaster.setFromCamera(coords, camera);
    const intersections = raycaster.intersectObjects(scene.children, true);
    if ((intersections.length > 0) && (!gIsOnDiv)) {

        if (addOutlinesBasedOnIntersections(intersections, outlinePass)) {
            infoPanel.style.right = '0px';
        } else {
            infoPanel.style.right = '-45%';
        }
        infoPanelTitle.innerHTML = intersections[0].object.name;

        const obj = intersections[0].object;

        const tweenCoords = { x: orbitControls.target.x, y: orbitControls.target.y, z: orbitControls.target.z };
        new TWEEN.Tween(tweenCoords)
            .to({ x: obj.position.x, y: obj.position.y, z: obj.position.z })
            .onUpdate(() => {
                orbitControls.target.set(tweenCoords.x, tweenCoords.y, tweenCoords.z);
            })
            .start();
    }
});

function animate(time) {
    requestAnimationFrame(animate);
    orbitControls.update();

    composer.render();
    TWEEN.update(time);
}

orbitControls.addEventListener('change', function () {
    //Do something on camera panning/movement/rotation
})

animate();