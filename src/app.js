const THREE = require("three");
window.THREE = THREE;
const VoxLoader = require('./VoxLoader/Vox.js');
const GameLoop = require('fixed-game-loop');
const KeyDrown = require('keydrown');
const viewWidth =  document.documentElement.clientWidth;
const viewHeight =  document.documentElement.clientHeight;
const modelNames = require('./modelNames.json');
const OrbitControls = require('three-orbit-controls')(THREE);

var sel = document.createElement('select');
var fragment = document.createDocumentFragment();

modelNames.forEach(function(modelName) {
  var opt = document.createElement('option');
  opt.innerHTML = modelName;
  opt.value = modelName;
  fragment.appendChild(opt);
});

sel.addEventListener('change', function(event){
  loadModel(event.target.value, worldCenterMesh);
});

sel.appendChild(fragment);
document.body.appendChild(sel);


const renderer = new THREE.WebGLRenderer( {antialias: true} );
renderer.setSize( viewWidth, viewHeight );
document.getElementById('mount').appendChild( renderer.domElement );

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

  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;

  var d = 150;

  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;

  dirLight.shadow.camera.far = 3500;
  dirLight.shadow.bias = -0.0001;
};

const scene = new THREE.Scene();
setLights(scene);

const camera = new THREE.PerspectiveCamera(
        75,         // Field of view
        viewWidth / viewHeight,  // Aspect ratio
        0.1,        // Near
        10000       // Far
);


window.camera = camera;
camera.position.set( 0, 25, 50 );
camera.lookAt(scene.position);

var controls = new OrbitControls(camera, document.getElementById('mount'));

var geometry = new THREE.PlaneBufferGeometry( 100, 100 );
var mesh1 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x949799 } ) );
mesh1.rotation.x = - Math.PI / 2;
mesh1.scale.set( 1000, 1000, 1000 );
scene.add(mesh1);


var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshLambertMaterial( { color: 0xFF0000 } );
var anchor = new THREE.Mesh( geometry, material );
window.anchor = anchor;
scene.add( anchor );

var from = new THREE.Vector3( 0, 0, 0 );
var to = new THREE.Vector3( 0, 20, 0 );
var direction = to.clone().sub(from);
var length = direction.length();
var YarrowHelper = new THREE.ArrowHelper(direction.normalize(), from, length, 0x42f448 );
scene.add( YarrowHelper );

from = new THREE.Vector3( 0, 0, 0 );
to = new THREE.Vector3( 20, 0, 0 );
direction = to.clone().sub(from);
length = direction.length();
var XarrowHelper = new THREE.ArrowHelper(direction.normalize(), from, length, 0xea0e53 );
scene.add( XarrowHelper );

from = new THREE.Vector3( 0, 0, 0 );
to = new THREE.Vector3( 0, 0, 20 );
direction = to.clone().sub(from);
length = direction.length();
var ZarrowHelper = new THREE.ArrowHelper(direction.normalize(), from, length, 0x150eea );
scene.add( ZarrowHelper );

renderer.setClearColor( 0x7ccaff, 1);
renderer.render( scene, camera );

var helper,mesh;
function loadModel(modelName, callback){
  const vl = new VoxLoader({
    filename: `./assets/mmmm/vox/${modelName}`,
    blockSize: 1
  });

  vl.LoadModel((vox) => {
    scene.children.forEach(function(child){
      if(child.type === 'Mesh' && child.voxel){
        scene.remove(child);
      }
    });
    vox.getChunk().Rebuild();
    var vmesh = vox.getMesh();
    vmesh.voxel = true;
    scene.add(vmesh);
    scene.updateMatrixWorld(true);

    mesh = vmesh;
    vmesh.parent = anchor;
    window.mesh = mesh;


    // helper = new THREE.BoundingBoxHelper(vmesh, 0xff0000);
    // helper.voxel = true;
    // helper.update();
    // mesh.helper = helper;
    // // If you want a visible bounding anchor
    // scene.add(helper);
    
    camera.lookAt(vmesh.position);
    //cameraFollow();
    if(callback){callback()}
  });
}


function worldCenterMesh(){
  //Center the vmesh in world space once imported  
  mesh.geometry.computeBoundingBox();
  var boundingBox = mesh.geometry.boundingBox;
  var position = new THREE.Vector3();
  position.subVectors( boundingBox.max, boundingBox.min );
  position.multiplyScalar( 0.5 );
  position.add( boundingBox.min );
  position.applyMatrix4( mesh.matrixWorld );

  mesh.position.x += -1 * position.x;
  mesh.position.z += -1 * position.z;  
}
window.worldCenterMesh = worldCenterMesh;

var zVelocity = 0;
var xVelocity = 0;


function onWindowResize(){
  camera.aspect = viewWidth / viewHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( viewWidth, viewHeight );
}
window.addEventListener( 'resize', onWindowResize, false );

var ticks = 0;
var update = function(dt, elapsed){
  ticks++;
  // if(mesh){
  //   anchor.translateZ(dt * zVelocity * 18);
  //   anchor.translateX(dt * xVelocity * 18);
  // }

};

var render = function() {
  renderer.render(scene, camera);
};

loadModel('chr_fatkid.vox', worldCenterMesh);
const loop = new GameLoop({ update, render });
