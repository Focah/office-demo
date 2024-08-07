import * as THREE from 'three';
import * as TWEEN from "@tweenjs/tween.js";
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'

export function getOutlineEffect(window, scene, camera) {
    let outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);

    return outlinePass;
}

export function configureOutlineEffectSettings_Default(outlinePass) {

    outlinePass.edgeStrength = 10;
    outlinePass.edgeGlow = 0.9;
    outlinePass.edgeThickness = 2;
    outlinePass.pulsePeriod = 9;
    outlinePass.visibleEdgeColor.set('#ffffff');
    outlinePass.hiddenEdgeColor.set('#190a05');

}
//Returns true if clicked object is different from previous
export function addOutlinesBasedOnIntersections(intersections, outlinePass) {
    if (intersections.length > 0) {
        let clickedObj = intersections[0].object;


        let indexObj = outlinePass.selectedObjects.indexOf(clickedObj);
        if (indexObj != -1) {
            //Rimuovo l'outline dall'oggetto precedentemente cliccato
            outlinePass.selectedObjects.splice(indexObj, 1);
            return false;
        } else {
            //Disegno l'outline sul nuovo oggetto cliccato
            outlinePass.selectedObjects = [clickedObj];
            return true;
        }
    }
}