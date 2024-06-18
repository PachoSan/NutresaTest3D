import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const gltfLoader = new GLTFLoader()


let modelo;
export function loadModel(url, name) {
    return new Promise((resolve) => {
        gltfLoader.load(url, (gltf) => {
            modelo = gltf;
            resolve(modelo);
        },
        (xhr) => {
            console.log(`${name} || ${(xhr.loaded / xhr.total * 100)} % loaded`);
        },
        (error) => {
            console.error(`${name} tuvo un error`, error);
        });
    });
}