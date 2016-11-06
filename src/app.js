const THREE = require("three");
window.THREE = THREE;
const vox = require('vox.js');
const viewWidth =  document.documentElement.clientWidth;
const viewHeight =  document.documentElement.clientHeight;

const renderer = new THREE.WebGLRenderer( {antialias: true} );
    renderer.setSize( viewWidth, viewHeight );
    document.body.appendChild( renderer.domElement );

const setLights = function(scene) {
  console.log("Initiate lights...");
  var ambientLight = new THREE.AmbientLight( 0x000033 );
  scene.add( ambientLight );

  var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.9 );
  hemiLight.color.setHSL( 0.6, 1, 0.6 );
  hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
  hemiLight.position.set( 0, 500, 0 );
  scene.add( hemiLight );

  var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
  dirLight.color.setHSL( 0.1, 1, 0.95 );
  dirLight.position.set( 10, 10.75, 10 );
  dirLight.position.multiplyScalar( 10 );
  scene.add( dirLight );

  dirLight.castShadow = true;

  dirLight.shadowMapWidth = 2048;
  dirLight.shadowMapHeight = 2048;

  var d = 150;

  dirLight.shadowCameraLeft = -d;
  dirLight.shadowCameraRight = d;
  dirLight.shadowCamefraTop = d;
  dirLight.shadowCameraBottom = -d;

  dirLight.shadowCameraFar = 3500;
  dirLight.shadowBias = -0.0001;
  dirLight.shadowDarkness = 0.45;
};

const scene = new THREE.Scene();
setLights(scene);

const camera = new THREE.PerspectiveCamera(
        35,         // Field of view
        viewWidth / viewHeight,  // Aspect ratio
        0.1,        // Near
        10000       // Far
);


window.camera = camera;
camera.position.set( -15, 10, 15 );
camera.lookAt( scene.position );

const geometry = new THREE.BoxGeometry( 5, 5, 5 );
const material = new THREE.MeshLambertMaterial( { color: 0xFF0000 } );
const mesh = new THREE.Mesh( geometry, material );
//scene.add( mesh );

// const light = new THREE.PointLight( 0xFFFF00 );
// light.position.set( 10, 0, 10 );
// scene.add( light );

renderer.setClearColor( 0xdddddd, 1);
renderer.render( scene, camera );


var parser = new vox.Parser();
parser.parse("./assets/mmmm/vox/chr_fatkid.vox").then(function(voxelData) {
  // voxelData.voxels; // voxel position and color data 
  // voxelData.size; // model size 
  // voxelData.palette; // palette data

  var param = { voxelSize: 1 };
  var builder = new vox.MeshBuilder(voxelData, param);
  var mesh = builder.createMesh();
  window.mesh = mesh;
  scene.add(mesh);
  camera.position.y += 5;  
});

function onWindowResize(){
  camera.aspect = viewWidth / viewHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( viewWidth, viewHeight );
}
window.addEventListener( 'resize', onWindowResize, false );

mesh.rotateY(0.1);

var frame = 0;
var render = function() {
  frame++;
  camera.position.x = Math.cos(frame * 0.004) * 100;
  camera.position.y = 50;
  camera.position.z = Math.sin(frame * 0.004) * 100;
  camera.lookAt(mesh.position);  
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

render();
