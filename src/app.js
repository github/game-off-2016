const THREE = require("three");
const VoxLoader = require('./VoxLoader/Vox.js');
const GameLoop = require('fixed-game-loop');
const viewWidth =  document.documentElement.clientWidth;
const viewHeight =  document.documentElement.clientHeight;
const modelNames = require('./modelNames.json');

var sel = document.getElementById('modelSelector');
var fragment = document.createDocumentFragment();


modelNames.forEach(function(modelName) {
    var opt = document.createElement('option');
    opt.innerHTML = modelName;
    opt.value = modelName;
    fragment.appendChild(opt);
});

sel.addEventListener('change', function(event){
  loadModel(event.target.value);
});

sel.appendChild(fragment);

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

let focus;
window.focus = focus;
const scene = new THREE.Scene();
setLights(scene);

const camera = new THREE.PerspectiveCamera(
        35,         // Field of view
        viewWidth / viewHeight,  // Aspect ratio
        0.1,        // Near
        10000       // Far
);


window.camera = camera;
camera.position.set( 0, 5, 10 );

var geometry = new THREE.BoxGeometry( 5, 5, 5 );
var material = new THREE.MeshLambertMaterial( { color: 0xFF0000 } );
var box = new THREE.Mesh( geometry, material );
focus = box;
scene.add( box );

var textureLoader = new THREE.TextureLoader();
var texture2 = textureLoader.load( "./assets/textures/crate.gif" );
var material2 = new THREE.MeshPhongMaterial( {
  color: 0xffffff,
  map: texture2,
} );
texture2.anisotropy = 1;
texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
texture2.repeat.set( 512, 512 );

var geometry = new THREE.PlaneBufferGeometry( 100, 100 );
var mesh1 = new THREE.Mesh( geometry, material2 );
mesh1.rotation.x = - Math.PI / 2;
mesh1.scale.set( 1000, 1000, 1000 );
scene.add(mesh1);


renderer.setClearColor( 0xdddddd, 1);
renderer.render( scene, camera );


function loadModel(modelName){
  const vl = new VoxLoader({
    filename: `./assets/mmmm/vox/${modelName}`,
    blockSize: 1
  });

  vl.LoadModel((vox) => {
    scene.children.forEach(function(child){
      if(child.type === 'Mesh'){
        scene.remove(child);
      }
    });
    vox.getChunk().Rebuild();
    var mesh = vox.getMesh();
    scene.add(mesh);
    focus = mesh;
    window.mesh = mesh;
    camera.lookAt(focus.position);      
  });
}

function onWindowResize(){
  camera.aspect = viewWidth / viewHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( viewWidth, viewHeight );
}
window.addEventListener( 'resize', onWindowResize, false );

var ticks = 0;
var update = function(dt, elapsed){
  ticks++;
  camera.position.x = Math.cos(ticks * 0.004) * 100;
  camera.position.y = 50;
  camera.position.z = Math.sin(ticks * 0.004) * 100;
  camera.lookAt(focus.position);  
};

var render = function() {
  renderer.render(scene, camera);
};

loadModel('chr_fatkid.vox');
const loop = new GameLoop({ update, render });


