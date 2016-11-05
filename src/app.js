const THREE = require("three");
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
camera.position.set( -15, 10, 15 );
camera.lookAt( scene.position );

const geometry = new THREE.BoxGeometry( 5, 5, 5 );
const material = new THREE.MeshLambertMaterial( { color: 0xFF0000 } );
const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

const light = new THREE.PointLight( 0xFFFF00 );
light.position.set( 10, 0, 10 );
scene.add( light );

renderer.setClearColor( 0xdddddd, 1);
renderer.render( scene, camera );


function onWindowResize(){
  camera.aspect = viewWidth / viewHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( viewWidth, viewHeight );
}
window.addEventListener( 'resize', onWindowResize, false );
