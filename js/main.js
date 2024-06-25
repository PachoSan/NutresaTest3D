import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { portal } from './portal.js'

import { loadModel } from './loadModels';
import * as dat from 'lil-gui'

const rgbeLoader = new RGBELoader()

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

const isla1 = guiIsla1.addFolder('Isla 1').close()
const isla2 = guiIsla1.addFolder('Isla 2').close()
const galaxy = guiIsla1.addFolder('Galaxia').close()
// const portalParametros = guiIsla1.addFolder('Parametros del portal').close()
const portalPosition1 = guiIsla1.addFolder('Portal 1').close()
const portalPosition2 = guiIsla1.addFolder('Portal 2').close()
const portalPosition3 = guiIsla1.addFolder('Portal 3').close()
const camaraPosition = guiIsla1.addFolder('Camara').close()

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

rgbeLoader.load('./hdri/galaxy1.hdr', (environmentMap)=>{
  environmentMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = environmentMap
  scene.environment = environmentMap
})

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

// CASTILLO
loadModel("./models/bishop_castle.glb", "CASTILLO")
  .then((castilloCargado) => {
    camera.lookAt(castilloCargado);
    scene.add(castilloCargado.scene.children[0]);
  })

  
//ISLA 1
loadModel("./models/isla.glb", "ISLA 1")
  .then((islaCargada) => {
    scene.add(islaCargada.scene);
    islaCargada.scene.scale.set(.02,.02,.02)
    islaCargada.scene.position.set(-5.8,3.16,-3.3)

    mixer = new THREE.AnimationMixer(islaCargada.scene)
    const action = mixer.clipAction(islaCargada.animations[0])
    action.play()

    setGuiUI(islaCargada.scene, "ALTURA", "y", "Isla 1", isla1)
    setGuiUI(islaCargada.scene, "LADOS", "x", "Isla 1", isla1)
    setGuiUI(islaCargada.scene, "PROFUNDIDAD", "z", "Isla 1", isla1)
  })
  
//ISLA 2
loadModel("./models/isla.glb", "ISLA 2")
  .then((islaCargada) => {
    scene.add(islaCargada.scene);
    islaCargada.scene.scale.set(.02,.02,.02)
    islaCargada.scene.position.set(4,1.72,9)

    mixer2 = new THREE.AnimationMixer(islaCargada.scene)
    const action2 = mixer2.clipAction(islaCargada.animations[0])
    action2.play()
    setGuiUI(islaCargada.scene, "ALTURA", "y", "Isla 2", isla2)
    setGuiUI(islaCargada.scene, "LADOS", "x", "Isla 2", isla2)
    setGuiUI(islaCargada.scene, "PROFUNDIDAD", "z", "Isla 2", isla2)
  })

/**
 * Portal
 */
const parameters2 = {}
parameters2.count = 100000
parameters2.size = 0.01
parameters2.radius = 1.5
parameters2.branches = 4
parameters2.spin = 2.5
parameters2.randomness = 0.8
parameters2.randomnessPower = 2
parameters2.insideColor = colores.elevacionC
parameters2.outsideColor = colores.primario


let points1 = null
let geometr1 = null
let material1 = null

let portal1 = portal(parameters2, scene, points1, geometr1, material1)
portal1.position.set(7.42,6.7,0)

setGuiUI(portal1, "ALTURA", "y", "Portal 1", portalPosition1)
setGuiUI(portal1, "LADOS", "x", "Portal 1", portalPosition1)
setGuiUI(portal1, "PROFUNDIDAD", "z", "Portal 1", portalPosition1)

let points2 = null
let geometry2 = null
let material2 = null

let portal2 = portal(parameters2, scene, points2, geometry2, material2)
portal2.position.set(-7.27,0.25,3.83)
setGuiUI(portal2, "ALTURA", "y", "Portal 2", portalPosition2)
setGuiUI(portal2, "LADOS", "x", "Portal 2", portalPosition2)
setGuiUI(portal2, "PROFUNDIDAD", "z", "Portal 2", portalPosition2)

let points3 = null
let geometry3 = null
let material3 = null

let portal3 = portal(parameters2, scene, points3, geometry3, material3)
portal3.position.set(0,4.19,-7.27)
setGuiUI(portal3, "ALTURA", "y", "Portal 3", portalPosition3)
setGuiUI(portal3, "LADOS", "x", "Portal 3", portalPosition3)
setGuiUI(portal3, "PROFUNDIDAD", "z", "Portal 3", portalPosition3)

// portalParametros.add(parameters2, 'count').min(100).max(1000000).step(100).onFinishChange(portal1)
// portalParametros.add(parameters2, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(portal)
// portalParametros.add(parameters2, 'radius').min(0.01).max(20).step(0.01).onFinishChange(portal)
// portalParametros.add(parameters2, 'branches').min(2).max(20).step(1).onFinishChange(portal)
// portalParametros.add(parameters2, 'spin').min(- 5).max(5).step(0.001).onFinishChange(portal)
// portalParametros.add(parameters2, 'randomness').min(0).max(2).step(0.001).onFinishChange(portal)
// portalParametros.add(parameters2, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(portal)
// portalParametros.addColor(parameters2, 'insideColor').onFinishChange(portal)
// portalParametros.addColor(parameters2, 'outsideColor').onFinishChange(portal)


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

setGuiUI(camera, "ALTURA", "y", "Camara", camaraPosition)
setGuiUI(camera, "LADOS", "x", "Camara", camaraPosition)
setGuiUI(camera, "PROFUNDIDAD", "z", "Camara", camaraPosition)

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
parameters.radius = 5
parameters.branches = 3
parameters.spin = 1
parameters.randomness = 0.2
parameters.randomnessPower = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'

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
galaxy.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)




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

  //Animacion Portales 
  portal1.rotation.y = elapsedTime*2
  portal2.rotation.y = elapsedTime*-2
  portal3.rotation.y = elapsedTime*-2
  // portal1.position.y = Math.cos(elapsedTime)*1.5
  // portal2.position.y = Math.sin(elapsedTime)*1.5
  // portal3.position.y = Math.cos(elapsedTime)*1.5

  //Mixer de islas
  if (mixer && mixer2) {
    mixer.update(deltaTime)
    mixer2.update(deltaTime)
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();


