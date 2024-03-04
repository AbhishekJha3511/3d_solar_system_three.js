// import * as THREE from "three";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, controls, skybox;

// Characters
let pSun, pEarth, pMercury, pVenus, pMars, pJupiter, pSaturn, pUranus, pNeptune;
let planet_sun_label;

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
let mars_orbit_radius = 160;
let jupiter_orbit_radius = 200;
let mercury_orbit_radius = 100;
let venus_orbit_radius = 120;
let saturn_orbit_radius = 240;
let uranus_orbit_radius = 280;
let neptune_orbit_radius = 320;

//Parameters for speed of the planets around the sun
let earth_orbit_speed = 1;
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
  meshType
) {
  const geometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  );
  const loader = new THREE.TextureLoader();
  const planetTexture = loader.load(texture);
  const material =
    meshType == "standard"
      ? new THREE.MeshStandardMaterial({ map: planetTexture })
      : new THREE.MeshBasicMaterial({ map: planetTexture });

  const planet = new THREE.Mesh(geometry, material);
  return planet;
}

// // Ring Geometry
// function createRingGeometry(outerRadius) {
//   let innerRadius = outerRadius - 0.1;
//   let thetaSegments = 64;
//   const geometry = new THREE.RingGeometry(
//     innerRadius,
//     outerRadius,
//     thetaSegments
//   );
//   const material = new THREE.MeshBasicMaterial({
//     color: "#ffffff",
//     side: THREE.DoubleSide,
//   });
//   const mesh = new THREE.Mesh(geometry, material);
//   scene.add(mesh);
//   mesh.rotation.x = Math.PI / 2;
//   return mesh;
// }


//Old ring geometry
// function createRing(innerRadius) {
//   let outerRadius = innerRadius - 0.1
//   let thetaSegments = 100
//   const geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);
//   const material = new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide });
//   const mesh = new THREE.Mesh(geometry, material);
//   scene.add(mesh)
//   mesh.rotation.x = Math.PI / 2
//   return mesh;

// }

function createRingGeometry(outerRadius, isSaturnRing = false) {
  let innerRadius = outerRadius - 0.1;
  let thetaSegments = 64;

  let geometry, material;

  if (isSaturnRing) {
    const saturnRingTexture = new THREE.TextureLoader();
    const saturnRingTextureMap = saturnRingTexture.load(
      "../img/saturn_ring.png"
    );
    geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);
    material = new THREE.MeshBasicMaterial({
      map: saturnRingTextureMap,
      side: THREE.DoubleSide,
      transparent: true,
    });
  } else {
    geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);
    material = new THREE.MeshBasicMaterial({
      color: "#ffffff",
      side: THREE.DoubleSide,
    });
  }

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}

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
  pSaturn = loadPlanetTexture("../img/saturn_8k.jpg", 16, 100, 100, "standard");
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
  scene.add(pMars);
  scene.add(pMercury);
  scene.add(pJupiter);
  scene.add(pVenus);
  scene.add(pSaturn);
  scene.add(pNeptune);
  scene.add(pUranus);

  const sunLight = new THREE.PointLight(0xffffff, 1, 0);
  sunLight.position.copy(pSun.position);
  scene.add(sunLight);

  createRingGeometry(earth_orbit_radius);
  createRingGeometry(mars_orbit_radius);
  createRingGeometry(jupiter_orbit_radius);
  createRingGeometry(mercury_orbit_radius);
  createRingGeometry(venus_orbit_radius);
  createRingGeometry(saturn_orbit_radius);
  createRingGeometry(saturn_orbit_radius, true); // Saturn ring
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
  //   controls.enableDamping = true;
  //   controls.dampingFactor = 0.25;
  //   controls.enableZoom = true;

  let min = 100;
  let max = 300;
  let camZ = Math.random() * (max - min) + min;
  let camY = Math.random() * (max - min) + min;
  let camX = Math.random() * (max - min) + min;
  camera.position.z = camZ;
  camera.position.y = camY;
  camera.position.x = -camX;

  //set the position of the planets
  pEarth.position.x = pSun.position.x + earth_orbit_radius;
}

function planetRevolution(planet, orbitRadius, orbitSpeed, planetName, time) {
  let orbitSpeedMultiplier = 0.001;
  const planetAngel = time * orbitSpeedMultiplier * orbitSpeed;
  planet.position.x =
    pSun.position.x + pSun.position.x + orbitRadius * Math.cos(planetAngel);
  planet.position.z =
    pSun.position.z + pSun.position.z + orbitRadius * Math.sin(planetAngel);
}

function animate(time) {
  requestAnimationFrame(animate);

  const rotationSpeed = 0.005;
  pSun.rotation.y += rotationSpeed;
  pEarth.rotation.y += rotationSpeed;
  pMars.rotation.y += rotationSpeed;
  pJupiter.rotation.y += rotationSpeed;
  pMercury.rotation.y += rotationSpeed;
  pVenus.rotation.y += rotationSpeed;
  pSaturn.rotation.y += rotationSpeed;
  pUranus.rotation.y += rotationSpeed;
  pNeptune.rotation.y += rotationSpeed;

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

  controls.update();
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
