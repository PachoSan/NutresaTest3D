import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
const gltfLoader = new GLTFLoader()


let modelo;
export function loadModel(url) {
    return new Promise((resolve, reject) => {
        gltfLoader.load(url, (gltf) => {
            modelo = gltf;
            resolve(modelo);
        }, undefined, (error) => {
            reject(error);
        });
    });
}