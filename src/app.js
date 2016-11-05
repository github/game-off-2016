const THREE = require("three");
window.THREE = THREE;
const vox = require('vox.js');
const viewWidth =  document.documentElement.clientWidth;
const viewHeight =  document.documentElement.clientHeight;

const renderer = new THREE.WebGLRenderer( {antialias: true} );
    renderer.setSize( viewWidth, viewHeight );
    document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();

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

const light = new THREE.PointLight( 0xFFFF00 );
light.position.set( 10, 0, 10 );
scene.add( light );

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

var render = function() {
  mesh.rotateY(0.1);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};
render();
