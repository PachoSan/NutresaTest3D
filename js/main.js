import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

import { loadModel } from './loadModels';
import * as dat from 'lil-gui'

const cubeTextureLoader = new THREE.CubeTextureLoader()
const rgbeLoader = new RGBELoader()

/**
 * Environment map
 */
// LDR cube texture
// const environmentMap = cubeTextureLoader.load(
//   '../public/hdri/satara.hdr'
// )
rgbeLoader.load('../static/hdri/galaxy1.jpg', (environmentMap)=>{
  environmentMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = environmentMap
  scene.environment = environmentMap
})

/**
 * Colores
 */
let colores = {
    neutral: "#1C0331",
    primario: "#280D53",
    secundario: "#7E10BD",
    elevacion: "#7E096C",
    elevacionC: "#EF35E3"
}

/**
 * Debug GUI
 */
const guiIsla1 = new dat.GUI({
  width: 300,
  title: 'Isalas',
  closeFolders: false
})

const isla1 = guiIsla1.addFolder('Isla 1').close();
const isla2 = guiIsla1.addFolder('Isla 2').close();
const isla3 = guiIsla1.addFolder('Isla 3').close();
const galaxy = guiIsla1.addFolder('Galaxia').close();

//Funcion para crear el GUI
function setGuiUI(model, campo, parametro, nombre, gui){
  gui.add(model.position, parametro)
    .min(- 20)
    .max(20)
    .step(0.01)
    .name(`${nombre} / ${campo}`)
}


/**
 * Base
 */
// Canvas
const canvas = document.getElementById("canvas");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(colores.elevacion);


/**
 * Light
 */
const ambientLight = new THREE.AmbientLight()
ambientLight.color = new THREE.Color(0xffffff)
ambientLight.intensity = 1
scene.add(ambientLight)

/**
 * Models
*/
let mixer;
let mixer2;
let mixer3;

// CASTILLO
loadModel("../static/models/bishop_castle2.glb", "CASTILLO")
  .then((castilloCargado) => {
    camera.lookAt(castilloCargado);
    scene.add(castilloCargado.scene.children[0]);
  })

  
//ISLA 1
loadModel("../static/models/isla.glb", "ISLA 1")
  .then((islaCargada) => {
    scene.add(islaCargada.scene);
    islaCargada.scene.scale.set(.02,.02,.02)
    islaCargada.scene.position.set(-9,3,4)

    mixer = new THREE.AnimationMixer(islaCargada.scene)
    const action = mixer.clipAction(islaCargada.animations[0])
    action.play()

    setGuiUI(islaCargada.scene, "ALTURA", "y", "Isla 1", isla1)
    setGuiUI(islaCargada.scene, "LADOS", "x", "Isla 1", isla1)
    setGuiUI(islaCargada.scene, "PROFUNDIDAD", "z", "Isla 1", isla1)
  })
  
//ISLA 2
loadModel("../static/models/isla.glb", "ISLA 2")
  .then((islaCargada) => {
    scene.add(islaCargada.scene);
    islaCargada.scene.scale.set(.02,.02,.02)
    islaCargada.scene.position.set(4,1,9)

    mixer2 = new THREE.AnimationMixer(islaCargada.scene)
    const action2 = mixer2.clipAction(islaCargada.animations[0])
    action2.play()
    setGuiUI(islaCargada.scene, "ALTURA", "y", "Isla 2", isla2)
    setGuiUI(islaCargada.scene, "LADOS", "x", "Isla 2", isla2)
    setGuiUI(islaCargada.scene, "PROFUNDIDAD", "z", "Isla 2", isla2)
  })

//ISLA 3
loadModel("../static/models/isla.glb", "ISLA 3")
  .then((islaCargada) => {
    scene.add(islaCargada.scene);
    islaCargada.scene.scale.set(.02,.02,.02)
    islaCargada.scene.position.set(-4,5,-10)

    mixer3 = new THREE.AnimationMixer(islaCargada.scene)
    const action2 = mixer3.clipAction(islaCargada.animations[0])
    action2.play()

    setGuiUI(islaCargada.scene, "ALTURA", "y", "Isla 3", isla3)
    setGuiUI(islaCargada.scene, "LADOS", "x", "Isla 3", isla3)
    setGuiUI(islaCargada.scene, "PROFUNDIDAD", "z", "Isla 3", isla3)
  })


// scene.background = environmentMap

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  //Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 12;
camera.position.y = 3;
camera.lookAt(new THREE.Vector3(50, 0, 0))
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);

controls.enableDamping =false;
controls.enablePan =false;

controls.autoRotate = true;
controls.autoRotateSpeed = .2

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Galaxy
 */
const parameters = {}
parameters.count = 1000
parameters.size = 0.02

let geometry = null
let material = null
let points = null

const generateGalaxy = () =>{
  // Destroy old galaxy
  if(points !== null)
    {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

  /**
     * Geometry
     */
  geometry = new THREE.BufferGeometry()

  const positions = new Float32Array(parameters.count * 3)

  for(let i = 0; i < parameters.count; i++)
  {
      const i3 = i * 3

      positions[i3    ] = (Math.random() - 0.5) * 100
      positions[i3 + 1] = (Math.random() - 0.5) * 100
      positions[i3 + 2] = (Math.random() - 0.5) * 100
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  /**
     * Material
     */
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  /**
     * Points
     */
  points = new THREE.Points(geometry, material)
  scene.add(points)
}
  
generateGalaxy()

galaxy.add(parameters, 'count').min(100).max(10000).step(100).onFinishChange(generateGalaxy)
galaxy.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // Update controls
  controls.update();

  if (mixer && mixer2 && mixer3) {
    mixer.update(deltaTime)
    mixer2.update(deltaTime)
    mixer3.update(deltaTime)
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();


