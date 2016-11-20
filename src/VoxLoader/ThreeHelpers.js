'use strict';
let THREE = require('three');

/**
 * @author WestLangley / http://github.com/WestLangley
 */

// a helper to show the world-axis-aligned bounding box for an object

THREE.BoundingBoxHelper = function ( object, hex ) {

    var color = ( hex !== undefined ) ? hex : 0x888888;

    this.object = object;

    this.box = new THREE.Box3();

    THREE.Mesh.call( this, new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshBasicMaterial( { color: color, wireframe: true } ) );

};

THREE.BoundingBoxHelper.prototype = Object.create( THREE.Mesh.prototype );
THREE.BoundingBoxHelper.prototype.constructor = THREE.BoundingBoxHelper;

THREE.BoundingBoxHelper.prototype.update = function () {

    this.box.setFromObject( this.object );

    this.box.size( this.scale );

    this.box.center( this.position );

};


/**
 * THREE.TargetCamera.js 1.1.0
 * (c) 2013 Luke Moody (http://www.github.com/squarefeet)
 *
 * THREE.TargetCamera may be freely distributed under the MIT license
 *  (See the LICENSE file at root of this repository.)
 */
THREE.TargetCamera=function(a,b,c,d){THREE.PerspectiveCamera.call(this),this.fov=void 0!==a?a:50,this.aspect=void 0!==b?b:1,this.near=void 0!==c?c:.1,this.far=void 0!==d?d:2e3,this.targets={},this.targetOrder=[],this.currentTargetName=null,this._idealObject=new THREE.Object3D,this._isTransitioning=!1,this._defaults={name:null,targetObject:new THREE.Object3D,cameraPosition:new THREE.Vector3(0,30,50),cameraRotation:void 0,fixed:!1,stiffness:.4,matchRotation:!0},this.updateProjectionMatrix()},THREE.TargetCamera.prototype=Object.create(THREE.PerspectiveCamera.prototype),THREE.TargetCamera.prototype._translateIdealObject=function(a){var b=this._idealObject;0!==a.x&&b.translateX(a.x),0!==a.y&&b.translateY(a.y),0!==a.z&&b.translateZ(a.z)},THREE.TargetCamera.prototype._createNewTarget=function(){var a=this._defaults;return{name:a.name,targetObject:a.targetObject,cameraPosition:a.cameraPosition,cameraRotation:a.cameraRotation,fixed:a.fixed,stiffness:a.stiffness,matchRotation:a.matchRotation}},THREE.TargetCamera.prototype._determineCameraRotation=function(a){return a instanceof THREE.Euler?(new THREE.Quaternion).setFromEuler(a):a instanceof THREE.Quaternion?a:void 0},THREE.TargetCamera.prototype.addTarget=function(a){var b=this._createNewTarget();if("object"==typeof a)for(var c in a)b.hasOwnProperty(c)&&("cameraRotation"===c?b[c]=this._determineCameraRotation(a[c]):b[c]=a[c]);this.targets[a.name]=b,this.targetOrder.push(a.name)},THREE.TargetCamera.prototype.setTarget=function(a){this.targets.hasOwnProperty(a)?this.currentTargetName=a:console.warn("THREE.TargetCamera.setTarget: No target with name "+a)},THREE.TargetCamera.prototype.removeTarget=function(a,b){var c=this.targets,d=this.targetOrder;return 1===d.length?void console.warn("THREE.TargetCamera: Will not remove only existing camera target."):(c.hasOwnProperty(a)&&(d.splice(d.indexOf(a),1),c[a]=null),void this.setTarget(b&&c.hasOwnProperty(b)?b:d[d.length-1]))},THREE.TargetCamera.prototype.update=function(a){var b=this.targets[this.currentTargetName],c=this._idealObject;b&&(b.fixed?(this.position.copy(b.cameraPosition),this.lookAt(b.targetObject.position)):(c.position.copy(b.targetObject.position),c.quaternion.copy(b.targetObject.quaternion),void 0!==b.cameraRotation&&c.quaternion.multiply(b.cameraRotation),this._translateIdealObject(b.cameraPosition),this.position.lerp(c.position,b.stiffness),b.matchRotation?this.quaternion.slerp(c.quaternion,b.stiffness):this.lookAt(b.targetObject.position)))};


/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

THREE.FirstPersonControls = function ( object, inputCapture, domElement ) {
    this.object = object;
    this.target = new THREE.Vector3( 0, 0, 0 );

    this.domElement = ( domElement !== undefined ) ? domElement : document;

    this.inputCapture = (inputCapture !== undefined) ? inputCapture : window;

    this.enabled = true;

    this.movementSpeed = 1.0;
    this.lookSpeed = 0.005;

    this.lookVertical = true;
    this.autoForward = false;

    this.activeLook = true;

    this.heightSpeed = false;
    this.heightCoef = 1.0;
    this.heightMin = 0.0;
    this.heightMax = 1.0;

    this.constrainVertical = false;
    this.verticalMin = 0;
    this.verticalMax = Math.PI;

    this.autoSpeedFactor = 0.0;

    this.mouseX = 0;
    this.mouseY = 0;

    this.lat = 0;
    this.lon = 0;
    this.phi = 0;
    this.theta = 0;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    this.mouseDragOn = false;

    this.viewHalfX = 0;
    this.viewHalfY = 0;

    if ( this.domElement !== document ) {

        this.domElement.setAttribute( 'tabindex', - 1 );

    }

    //

    this.handleResize = function () {

        if ( this.domElement === document ) {

            this.viewHalfX = window.innerWidth / 2;
            this.viewHalfY = window.innerHeight / 2;

        } else {

            this.viewHalfX = this.domElement.offsetWidth / 2;
            this.viewHalfY = this.domElement.offsetHeight / 2;

        }

    };

    this.onMouseDown = function ( event ) {

        if ( this.domElement !== document ) {

            this.domElement.focus();

        }

        event.preventDefault();
        event.stopPropagation();

        if ( this.activeLook ) {

            switch ( event.button ) {

                case 0: this.moveForward = true; break;
                case 2: this.moveBackward = true; break;

            }

        }

        this.mouseDragOn = true;

    };

    this.onMouseUp = function ( event ) {

        event.preventDefault();
        event.stopPropagation();

        if ( this.activeLook ) {

            switch ( event.button ) {

                case 0: this.moveForward = false; break;
                case 2: this.moveBackward = false; break;

            }

        }

        this.mouseDragOn = false;

    };

    this.onMouseMove = function ( event ) {

        if ( this.domElement === document ) {

            this.mouseX = event.pageX - this.viewHalfX;
            this.mouseY = event.pageY - this.viewHalfY;

        } else {

            this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
            this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

        }

    };

    this.onKeyDown = function ( event ) {
        //event.preventDefault();

        switch ( event.keyCode ) {

            case 38: /*up*/
            case 87: /*W*/ this.moveForward = true; break;

            case 37: /*left*/
            case 65: /*A*/ this.moveLeft = true; break;

            case 40: /*down*/
            case 83: /*S*/ this.moveBackward = true; break;

            case 39: /*right*/
            case 68: /*D*/ this.moveRight = true; break;

            case 82: /*R*/ this.moveUp = true; break;
            case 70: /*F*/ this.moveDown = true; break;

        }

    };

    this.onKeyUp = function ( event ) {
        switch ( event.keyCode ) {

            case 38: /*up*/
            case 87: /*W*/ this.moveForward = false; break;

            case 37: /*left*/
            case 65: /*A*/ this.moveLeft = false; break;

            case 40: /*down*/
            case 83: /*S*/ this.moveBackward = false; break;

            case 39: /*right*/
            case 68: /*D*/ this.moveRight = false; break;

            case 82: /*R*/ this.moveUp = false; break;
            case 70: /*F*/ this.moveDown = false; break;

        }

    };

    this.update = function( delta ) {
        if ( this.enabled === false ) return;

        if ( this.heightSpeed ) {

            var y = THREE.Math.clamp( this.object.position.y, this.heightMin, this.heightMax );
            var heightDelta = y - this.heightMin;

            this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

        } else {

            this.autoSpeedFactor = 0.0;

        }

        var actualMoveSpeed = delta * this.movementSpeed;

        if ( this.moveForward || ( this.autoForward && ! this.moveBackward ) ) this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
        if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );

        if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
        if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

        if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
        if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );

        var actualLookSpeed = delta * this.lookSpeed;

        if ( ! this.activeLook ) {

            actualLookSpeed = 0;

        }

        var verticalLookRatio = 1;

        if ( this.constrainVertical ) {

            verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

        }

        this.lon += this.mouseX * actualLookSpeed;
        if ( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

        this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
        this.phi = THREE.Math.degToRad( 90 - this.lat );

        this.theta = THREE.Math.degToRad( this.lon );

        if ( this.constrainVertical ) {

            this.phi = THREE.Math.mapLinear( this.phi, 0, Math.PI, this.verticalMin, this.verticalMax );

        }

        var targetPosition = this.target,
            position = this.object.position;

        targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
        targetPosition.y = position.y + 100 * Math.cos( this.phi );
        targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

        this.object.lookAt( targetPosition );

    };

    function contextmenu( event ) {

        event.preventDefault();

    }

    this.dispose = function() {

        this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
        this.domElement.removeEventListener( 'mousedown', _onMouseDown, false );
        this.domElement.removeEventListener( 'mousemove', _onMouseMove, false );
        this.domElement.removeEventListener( 'mouseup', _onMouseUp, false );

        this.inputCapture.removeEventListener( 'keydown', _onKeyDown, false );
        this.inputCapture.removeEventListener( 'keyup', _onKeyUp, false );

    }

    var _onMouseMove = bind( this, this.onMouseMove );
    var _onMouseDown = bind( this, this.onMouseDown );
    var _onMouseUp = bind( this, this.onMouseUp );
    var _onKeyDown = bind( this, this.onKeyDown );
    var _onKeyUp = bind( this, this.onKeyUp );

    this.domElement.addEventListener( 'contextmenu', contextmenu, false );
    this.domElement.addEventListener( 'mousemove', _onMouseMove, false );
    this.domElement.addEventListener( 'mousedown', _onMouseDown, false );
    this.domElement.addEventListener( 'mouseup', _onMouseUp, false );

    this.inputCapture.addEventListener( 'keydown', _onKeyDown, false );
    this.inputCapture.addEventListener( 'keyup', _onKeyUp, false );

    function bind( scope, fn ) {

        return function () {

            fn.apply( scope, arguments );

        };

    }

    this.handleResize();

};

module.exports = THREE;