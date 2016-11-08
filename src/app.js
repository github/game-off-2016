const THREE = require("three");
window.THREE = THREE;
const VoxLoader = require('./VoxLoader/Vox.js');
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
const box = new THREE.Mesh( geometry, material );
focus = box;
scene.add( box );

renderer.setClearColor( 0xdddddd, 1);
renderer.render( scene, camera );


function loadModel(modelName){
  const vl = new VoxLoader({
    filename: `./assets/mmmm/vox/${modelName}`
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
  });
}

function onWindowResize(){
  camera.aspect = viewWidth / viewHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( viewWidth, viewHeight );
}
window.addEventListener( 'resize', onWindowResize, false );


var frame = 0;
var render = function() {
  frame++;
  camera.position.x = Math.cos(frame * 0.004) * 10;
  camera.position.y = 5;
  camera.position.z = Math.sin(frame * 0.004) * 10;
  camera.lookAt(focus.position);  
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

loadModel('chr_fatkid.vox');
render();
