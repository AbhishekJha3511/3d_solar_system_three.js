// import * as THREE from "three";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, controls, skybox;

// Characters
let pSun,
  pEarth,
  pMoon,
  pMercury,
  pVenus,
  pMars,
  pJupiter,
  pSaturn,
  pUranus,
  pNeptune;

//Parameters for radius of the planets from sun
// let earth_orbit_radius = 70;
// let mars_orbit_radius = 80;
// let jupiter_orbit_radius = 100;
// let mercury_orbit_radius = 50;
// let venus_orbit_radius = 60;
// let saturn_orbit_radius = 120;
// let uranus_orbit_radius = 140;
// let neptune_orbit_radius = 160;

let earth_orbit_radius = 140;
let moon_orbit_radius = 70;
let mars_orbit_radius = 160;
let jupiter_orbit_radius = 200;
let mercury_orbit_radius = 100;
let venus_orbit_radius = 120;
let saturn_orbit_radius = 240;
let uranus_orbit_radius = 280;
let neptune_orbit_radius = 320;

//Parameters for speed of the planets around the sun
// let earth_orbit_speed = 0;
// let mars_orbit_speed = 0;
// let jupiter_orbit_speed = 0;
// let mercury_orbit_speed = 0;
// let venus_orbit_speed = 0;
// let saturn_orbit_speed = 0;
// let uranus_orbit_speed = 0;
// let neptune_orbit_speed = 0;

let earth_orbit_speed = 1;
let moon_orbit_speed = 0.5;
let mars_orbit_speed = 0.8;
let jupiter_orbit_speed = 0.7;
let mercury_orbit_speed = 2;
let venus_orbit_speed = 1.5;
let saturn_orbit_speed = 0.6;
let uranus_orbit_speed = 0.5;
let neptune_orbit_speed = 0.4;

//space box
function createMaterialArray() {
  const skyboxImagePaths = [
    "../img/space_angels/space_bk.png",
    "../img/space_angels/space_dn.png",
    "../img/space_angels/space_ft.png",
    "../img/space_angels/space_lf.png",
    "../img/space_angels/space_rt.png",
    "../img/space_angels/space_up.png",
  ];
  const materialArray = skyboxImagePaths.map((image) => {
    let texture = new THREE.TextureLoader().load(image);
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  });
  return materialArray;
}

function setSkyBox() {
  const materialArray = createMaterialArray();
  const skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
  skybox = new THREE.Mesh(skyboxGeo, materialArray);
  scene.add(skybox);
}

function loadPlanetTexture(
  texture,
  radius,
  widthSegments,
  heightSegments,
  meshType,
  ringTexture
) {
  const geometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  );
  const loader = new THREE.TextureLoader();
  const planetTexture = loader.load(texture);
  const material =
    meshType === "standard"
      ? new THREE.MeshStandardMaterial({ map: planetTexture })
      : new THREE.MeshBasicMaterial({ map: planetTexture });

  const planet = new THREE.Mesh(geometry, material);

  if (ringTexture && meshType === "standard") {
    const ringGeometry = new THREE.RingGeometry(radius + 2, radius + 4, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(ringTexture),
      side: THREE.DoubleSide,
      transparent: true,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    planet.add(ringMesh);
  }

  return planet;
}

function createRingGeometry(innerRadius) {
  let outerRadius = innerRadius - 0.1;
  let thetaSegments = 100;
  const geometry = new THREE.RingGeometry(
    innerRadius,
    outerRadius,
    thetaSegments
  );
  const material = new THREE.MeshBasicMaterial({
    color: "#ffffff",
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}

// function createSaturnRing(planet, ringRadius, ringTexture) {
//   const ringGeometry = new THREE.RingGeometry(planet.radius + ringRadius, planet.radius + ringRadius + 2, 64);
//   const ringMaterial = new THREE.MeshBasicMaterial({
//     map: new THREE.TextureLoader().load(ringTexture),
//     side: THREE.DoubleSide,
//     transparent: true,
//   });
//   const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
//   pSaturn.add(ringMesh);
// }

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    85,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  setSkyBox();
  pSun = loadPlanetTexture("../img/sun_hd.jpg", 40, 100, 100, "basic"); //load the sun texture and radius or hxw
  pEarth = loadPlanetTexture("../img/earth_hd.jpg", 8, 100, 100, "standard");
  pMoon = loadPlanetTexture("../img/moon_hd.jpg", 10, 100, 100, "standard");
  pMars = loadPlanetTexture("../img/mars_hd.jpg", 7, 100, 100, "standard");
  pJupiter = loadPlanetTexture(
    "../img/jupiter_hd.jpg",
    20,
    100,
    100,
    "standard"
  );
  pMercury = loadPlanetTexture(
    "../img/mercury_hd.jpg",
    4,
    100,
    100,
    "standard"
  );
  pVenus = loadPlanetTexture("../img/venus_hd.jpg", 6, 100, 100, "standard");
  pSaturn = loadPlanetTexture(
    "../img/saturn_8k.jpg",
    16,
    100,
    100,
    "standard",
    "../img/saturn_ring.png"
  );

  pNeptune = loadPlanetTexture(
    "../img/neptune_hd.jpg",
    10,
    100,
    100,
    "standard"
  );
  pUranus = loadPlanetTexture("../img/uranus_hd.jpg", 12, 100, 100, "standard");

  scene.add(pSun); //add the sun to the scene and the sun is in the center
  scene.add(pEarth);
  scene.add(pMoon);
  scene.add(pMars);
  scene.add(pMercury);
  scene.add(pJupiter);
  scene.add(pVenus);
  scene.add(pSaturn);
  scene.add(pNeptune);
  scene.add(pUranus);

  pMoon.position.x = pEarth.position.x + moon_orbit_radius;

  const sunLight = new THREE.PointLight(0xffffff, 1, 0);
  sunLight.position.copy(pSun.position);
  scene.add(sunLight);

  createRingGeometry(earth_orbit_radius);
  createRingGeometry(moon_orbit_radius);
  createRingGeometry(mars_orbit_radius);
  createRingGeometry(jupiter_orbit_radius);
  createRingGeometry(mercury_orbit_radius);
  createRingGeometry(venus_orbit_radius);
  createRingGeometry(saturn_orbit_radius);
  createRingGeometry(pSaturn, 4, "../img/saturn_ring.png");
  createRingGeometry(neptune_orbit_radius);
  createRingGeometry(uranus_orbit_radius);

  // camera = new THREE.PerspectiveCamera(85degree(isCamera angle), window.innerWidth / window.innerHeight(aspect ratio), 0.1(near), 1000(far));
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.domElement.id = "c";
  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 12;
  controls.maxDistance = 1000;
  controls.enabled = true;
  // controls.enableDamping = true;
  // controls.dampingFactor = 0.25;
  // controls.enableZoom = true;

  // Set the random camera position for the scene
  // let min = 100;
  // let max = 300;
  // let camZ = Math.random() * (max - min) + min;
  // let camY = Math.random() * (max - min) + min;
  // let camX = Math.random() * (max - min) + min;
  // camera.position.z = camZ;
  // camera.position.y = camY;
  // camera.position.x = -camX;
  //end of random camera position

  // Set a fixed camera position
  // camera.position.set(-200, 200, 200);
}
function planetRevolution(planet, orbitRadius, orbitSpeed, planetName, time) {
  let orbitSpeedMultiplier = 0.001;
  const planetAngle = time * orbitSpeedMultiplier * orbitSpeed;
  planet.position.x = orbitRadius * Math.cos(planetAngle);
  planet.position.z = orbitRadius * Math.sin(planetAngle);
  planet.rotation.y -= orbitSpeedMultiplier * orbitSpeed; // Change this line to subtract to make the planets rotate in the opposite direction
}

function planetRevolutionMoon(
  planet,
  orbitRadius,
  orbitSpeed,
  planetName,
  time,
  earthPosition
) {
  let orbitSpeedMultiplier = 0.001;
  const planetAngle = time * orbitSpeedMultiplier * orbitSpeed;
  planet.position.x = earthPosition.x + orbitRadius * Math.cos(planetAngle);
  planet.position.z = earthPosition.z + orbitRadius * Math.sin(planetAngle);
}

function animate(time) {
  requestAnimationFrame(animate);

  const rotationSpeed = 0.005;
  pSun.rotation.y += rotationSpeed;
  pEarth.rotation.y += rotationSpeed;
  pMoon.rotation.y += rotationSpeed;
  pMars.rotation.y += rotationSpeed;
  pJupiter.rotation.y += rotationSpeed;
  pMercury.rotation.y += rotationSpeed;
  pSaturn.rotation.y += rotationSpeed;
  pVenus.rotation.y -= rotationSpeed;
  pUranus.rotation.y -= rotationSpeed;
  pNeptune.rotation.y += rotationSpeed;

  // Update the camera's position to follow planet
  const cameraRotationSpeed = 0.005;
  camera.rotation.y += cameraRotationSpeed;

  // Update the camera position to follow planet
  camera.position.copy(pNeptune.position);
  camera.position.y += 100; // Adjust the height above the planet


  // Update the camera's rotation to match Neptune's rotation (optional)
  // camera.rotation.set(0, pMoon.rotation.y, 0);

  //Revolution around the sun
  //   const orbitSpeedMultiplier = 0.001;
  //   const earthOrbitAngle = time * orbitSpeedMultiplier;
  //   pEarth.position.x =
  //     pSun.position.x + earth_orbit_radius * Math.cos(earthOrbitAngle);
  //   pEarth.position.z =
  //     pSun.position.z + earth_orbit_radius * Math.sin(earthOrbitAngle);

  planetRevolution(
    pEarth,
    earth_orbit_radius,
    earth_orbit_speed,
    "earth",
    time
  );
  planetRevolutionMoon(
    pMoon,
    moon_orbit_radius,
    moon_orbit_speed,
    "moon",
    time,
    pEarth.position
  );

  planetRevolution(pMars, mars_orbit_radius, mars_orbit_speed, "mars", time);
  planetRevolution(
    pJupiter,
    jupiter_orbit_radius,
    jupiter_orbit_speed,
    "jupiter",
    time
  );
  planetRevolution(
    pMercury,
    mercury_orbit_radius,
    mercury_orbit_speed,
    "mercury",
    time
  );
  planetRevolution(
    pVenus,
    venus_orbit_radius,
    venus_orbit_speed,
    "venus",
    time
  );
  planetRevolution(
    pSaturn,
    saturn_orbit_radius,
    saturn_orbit_speed,
    "saturn",
    time
  );
  planetRevolution(
    pUranus,
    uranus_orbit_radius,
    uranus_orbit_speed,
    "uranus",
    time
  );
  planetRevolution(
    pNeptune,
    neptune_orbit_radius,
    neptune_orbit_speed,
    "neptune",
    time
  );

  controls.update(0.5);
  // controls.update();
  renderer.render(scene, camera);
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);

init();
animate(0);
