import * as THREE from "https://cdn.skypack.dev/three@0.148.0";
import openSimplexNoise from 'https://cdn.skypack.dev/open-simplex-noise';

//VARIABLES
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const white = 0xffffff;
const black = 0x000000;
const yellow = 0xffc800;
const red = 0xff0000;
const purple = 0xa200ff;
const green = 0x03fc2c;
const blue = 0x031cfc;
const cyan = 0x03d3fc;
const pink = 0xff7dcd;
const lightYellow = 0xffe97d;

//SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(black);
scene.fog = new THREE.Fog(black, 4, 6);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper)

//LIGHT SCENE1
let lightTopColor = new THREE.Color(yellow);
let lightBackColor = new THREE.Color(red);
let rectLightColor = new THREE.Color(purple);

const lightTop = new THREE.PointLight(lightTopColor, 10);
lightTop.position.set(5, 5, 2);
lightTop.castShadow = true;
lightTop.shadow.mapSize.width = lightTop.shadow.mapSize.height = 10000;
lightTop.penumbra = 0.5;

const lightBack = new THREE.SpotLight(lightBackColor, 2);
lightBack.position.set(0, -3, -1);

const rectLight = new THREE.RectAreaLight(rectLightColor, 20, 2, 2);
rectLight.position.set(1, 1, 1);
rectLight.lookAt(0, 0, 0);

scene.add(lightTop, lightBack, rectLight);

//LIGHT SCENE2
const targetScene2 = new THREE.Object3D();
targetScene2.position.set(0, -10, 0);
scene.add(targetScene2);

const lightRight = new THREE.SpotLight(pink, 1);
lightRight.position.set(8, 0, 0);
lightRight.target = targetScene2;

const lightLeft = new THREE.SpotLight(pink, 1);
lightLeft.position.set(-8, 0, 0);
lightLeft.target = targetScene2;

const lightMidSpot = new THREE.SpotLight(lightYellow, 2);
lightMidSpot.position.set(0, -5, 20);
lightMidSpot.target = targetScene2;

const lightMidPoint = new THREE.PointLight(lightYellow, 0.05);
lightMidPoint.position.set(0, 0, -23);

scene.add(lightRight,lightLeft, lightMidSpot, lightMidPoint);


//CAMERA  scene1(-0.3, 0, 5)   scene2(0, -4.5, 10)
let updateCamPos = new THREE.Vector3(-0.3, 0, 5);
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 1, 500);
camera.position.set(-0.3, 0, 5);
scene.add(camera);

//RENDERER
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearAlpha(0);
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.needsUpdate = true;

//SCENE1 OBJECTS
//Space size
function spaceRandom(num = 1) {
  var setNumber = -Math.random() * num + Math.random() * num;
  return setNumber;
}

//Cubes
const cubesGroup = new THREE.Object3D();
scene.add(cubesGroup);
function generateCube() {
  //Init object
  const geometry = new THREE.IcosahedronGeometry(1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.4,
    metalness: 0.5,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.speedRotation = Math.random() * 0.1;
  cube.positionX = spaceRandom();
  cube.positionY = spaceRandom();
  cube.positionZ = spaceRandom();
  cube.castShadow = true;
  cube.receiveShadow = true;
  //Behavior
  const newScaleValue = spaceRandom(0.3);
  cube.scale.set(newScaleValue, newScaleValue, newScaleValue);


    // Add cube to the group
    cubesGroup.add(cube);
  }
  
  for (let i = 0; i < 100; i++) {
    generateCube();
  }
  
  //Background stars
  function generateStar() {
    const geometry = new THREE.SphereGeometry(0.01, 24, 24);
    const material = new THREE.MeshBasicMaterial({ color: white });
    const star = new THREE.Mesh(geometry, material);
    star.positionX = spaceRandom();
    star.positionY = spaceRandom();
    star.positionZ = spaceRandom();
    star.scale.set(spaceRandom(2), spaceRandom(2), spaceRandom(2));
    scene.add(star);
  }
  
  for (let i = 0; i < 200; i++) {
    generateStar();
  }
  
  //SCENE2 OBJECTS
  // Clouds
  const cloudGroup = new THREE.Object3D();
  scene.add(cloudGroup);
  
  const noise = openSimplexNoise.makeNoise2D(Date.now());
  function generateCloud() {
    const geometry = new THREE.SphereGeometry(3, 24, 24);
    const material = new THREE.MeshStandardMaterial({
      color: white,
      transparent: true,
      opacity: 0.7,
      roughness: 0.7,
      metalness: 0.2,
    });
    const cloud = new THREE.Mesh(geometry, material);
    cloud.position.set(spaceRandom(15), spaceRandom(10), spaceRandom(5));
    cloud.scale.set(spaceRandom(2), spaceRandom(2), spaceRandom(2));
    cloud.castShadow = true;
    cloud.receiveShadow = true;
    cloud.noiseOffset = Math.random() * 100;
    cloudGroup.add(cloud);
  }
  
  for (let i = 0; i < 10; i++) {
    generateCloud();
  }
  
  //FUNCTIONS
  function updateObjects() {
    // Update cubes rotation
    cubesGroup.rotation.x += 0.001;
    cubesGroup.rotation.y += 0.001;
    cubesGroup.rotation.z += 0.001;
  
    // Update clouds position based on Perlin noise
    cloudGroup.children.forEach((cloud) => {
      cloud.position.x += Math.sin(noise(cloud.position.x / 5 + cloud.noiseOffset)) * 0.005;
      cloud.position.y += Math.sin(noise(cloud.position.y / 5 + cloud.noiseOffset)) * 0.005;
      cloud.position.z += Math.sin(noise(cloud.position.z / 5 + cloud.noiseOffset)) * 0.005;
    });
  }
  
  //RENDER ANIMATION
  function animate() {
    requestAnimationFrame(animate);
  
    updateObjects();
  
    renderer.render(scene, camera);
  }
  
  animate();
  
  //RESPONSIVE
  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
  
    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
  
    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
  
// CONTINUE: 

// MOUSE MOVE INTERACTION
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  // Mouse movement normalized coordinates
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

// RAYCASTING
const raycaster = new THREE.Raycaster();

// FUNCTIONS
function onMouseMove() {
  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children, true);

  // If there is an intersection, log the object to the console
  if (intersects.length > 0) {
    console.log(intersects[0].object);
  }
}

// RENDER LOOP
function render() {
  requestAnimationFrame(render);

  // Call the onMouseMove function
  onMouseMove();

  // Render the scene
  renderer.render(scene, camera);
}

// Start the rendering loop
render();

// END OF CODE
  
