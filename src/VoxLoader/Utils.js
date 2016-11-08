const THREE = require('./ThreeHelpers');

const Utils = {
  //KJZ deprecated use Object.rotateOnAxis
  // Rotate an object around an arbitrary axis in object space
  // rotateAroundObjectAxis: function(object, axis, radians) {
  //     var rotObjectMatrix = new THREE.Matrix4();
  //     rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
  //     object.matrix.multiply(rotObjectMatrix);

  //     object.rotation.setFromRotationMatrix(object.matrix);
  // },

  // Rotate an object around an arbitrary axis in world space       
  rotateAroundWorldAxis: function(object, axis, radians) {
      var rotWorldMatrix = new THREE.Matrix4();
      rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
      rotWorldMatrix.multiply(object.matrix);                // pre-multiply
      object.matrix = rotWorldMatrix;
      object.rotation.setFromRotationMatrix(object.matrix);
  },

  GetDistance: function(v1, v2) {
      var dx = v1.x - v2.x;
      var dy = v1.y - v2.y;
      var dz = v1.z - v2.z;
      return Math.sqrt(dx*dx+dy*dy+dz*dz);
  },

  UniqueArr: function(a) {
      var temp = {};
      for (var i = 0; i < a.length; i++)
          temp[a[i]] = true;
      var r = [];
      for (var k in temp)
          r.push(k);
      return r;
  },

  timeStamp: function() {
    var now = new Date();
    var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
    var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
    time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
    time[0] = time[0] || 12;
    for ( var i = 1; i < 3; i++ ) {
      if ( time[i] < 10 ) {
        time[i] = "0" + time[i];
      }
    }
    return date.join("/") + " " + time.join(":");
  },

  Log: function(msg) {

      if(typeof(msg) != 'object') {
          console.log("["+this.timeStamp()+"] "+msg);
      } else {
          console.log(msg);
      }
  },

  MsgBoard: function(msg) {
      $('#msgboard').fadeIn(1000);
      $('#msgboard_msg').html("<font color='#FF0000'>"+msg+"</font>");
      setTimeout(function() { 
  	$('#msgboard').fadeOut(1000);
      }, 2000);
  },

  // CreateBoundingBox2: function(obj) {
  //     var object3D = obj.mesh;
  //     var box = null;
  //     object3D.geometry.computeBoundingBox();
  //     box = geometry.boundingBox;


  //     var x = box.max.x - box.min.x; 
  //     var y = box.max.y - box.min.y; 
  //     var z = box.max.z - box.min.z;

  //     obj.bbox = box;

  //     var bcube = new THREE.Mesh( new THREE.BoxGeometry( x, y, z ), 
  // 				new THREE.MeshNormalMaterial({ visible: false, wireframe: true, color: 0xAA3333}) );
                  
  //                 game.scene.add(bcube);
  //     var bboxCenter = box.center();
  //     bcube.translateX(bboxCenter.x);
  //     bcube.translateY(bboxCenter.y);
  //     bcube.translateZ(bboxCenter.z);
  //     obj.bcube = bcube;
  //     object3D.add(bcube);

  //     bcube.that = obj.mesh.that;
  // },

  // CreateBoundingBox: function(obj) {
  //     var object3D = obj.mesh;
  //     var box = null;
  //     object3D.traverse(function (obj3D) {
  //         var geometry = obj3D.geometry;
  //         if (geometry === undefined)  {
  // 	    return;
  // 	}
  //         geometry.computeBoundingBox();
  //         if (box === null) {
  // 	    box = geometry.boundingBox;
  //         } else {
  // 	    box.union(geometry.boundingBox);
  //         }
  //     });


  //     var x = box.max.x - box.min.x; 
  //     var y = box.max.y - box.min.y; 
  //     var z = box.max.z - box.min.z;

  //     obj.bbox = box;

  //     var bcube = new THREE.Mesh( new THREE.BoxGeometry( x, y, z ), 
  // 				new THREE.MeshNormalMaterial({ visible: false, wireframe: true, color: 0xAA3333}) );
  //     var bboxCenter = box.center();
  //     bcube.translateX(bboxCenter.x);
  //     bcube.translateY(bboxCenter.y);
  //     bcube.translateZ(bboxCenter.z);
  //     obj.bcube = bcube;
  //     object3D.add(bcube);

  //     bcube.that = obj.mesh.that;

  //     game.targets.push(bcube);
  // },

  rgbToHex: function(r, g, b) {
      if(r < 0) r = 0;
      if(g < 0) g = 0;
      return "0x" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  },

  rgbToHex2: function(r, g, b) {
      if(r < 0) r = 0;
      if(g < 0) g = 0;
      return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  },

  componentToHex: function(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
  },


  // GetWorldYVector: function(vector) {
  //     var world = game.terrain.GetNoise();
  //     var x = Math.round(vector.x/10)+world.length/2;
  //     var z = Math.round(vector.z/10)+world.length/2;
  //     var y = 0;
  //     if(x < world.length-1) {
  // 	if(world[x] != undefined && z < world[x].length-1) {
  // 	    y = world[x][z]*200;
  // 	}
  //     } else {
  // 	y = 0;
  //     }
  //     return y;
  // },


  // GetWorldY: function(mesh) {
  //     var world = game.terrain.GetNoise();
  //     var x = Math.round(mesh.position.x/10)+world.length/2;
  //     var z = Math.round(mesh.position.z/10)+world.length/2;
  //     var y = 0;
  //     if(x < world.length-1) {
  // 	if(world[x] != undefined && z < world[x].length-1) {
  // 	    y = world[x][z]*200;
  // 	}
  //     } else {
  // 	y = 0;
  //     }
  //     return y;
  // },


  ReleasePointer: function() {
     var instructions = document.getElementsByTagName("body")[0];
      instructions.removeEventListener( 'click', instrClick);
      keys_enabled = 0;
      document.exitPointerLock = document.exitPointerLock ||
  	  document.mozExitPointerLock ||
  	  document.webkitExitPointerLock;
      document.exitPointerLock();
  },

  // http://www.html5rocks.com/en/tutorials/pointerlock/intro/
  LockPointer: function() {
    var instructions = document.getElementsByTagName("body")[0];
  	instructions.addEventListener( 'click', this.instrClick, false);
  },

  instrClick: function( event ) {
      var element = document.body;
      keys_enabled = 1;
      element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
      element.requestPointerLock();
  }
};

module.exports = Utils;