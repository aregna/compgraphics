/*
This is a ThreeJS program which implements a simple game
The user moves a cube around the board trying to knock balls into a cone

PA02 for COSI155b Brandeis University
Authors: Jin Sung Byun, Jerry Miller, Allison Regna, Alexander Rubin, Aviya Zarur
*/

	// First we declare the variables that hold the objects we need
	// in the animation code
	var scene, renderer;  // all threejs programs need these
	var camera, avatarCam, edgeCam, wholeCam; // we have two cameras in the main scene
	var avatar;

	var cone;
	var npc;

	var endLoseScene, endLoseTest;
	var endScene, endCamera, endText;

//Add Start scene - Allison
	var play = false;
	var gameState =
	     {score:0, health:10, scene:'start', camera:'none' }

	var controls =
	     {fwd:false, bwd:false, left:false, right:false,
				speed:10, fly:false, reset:false,
		    camera:camera}

	// Here is the main game control
  init(); //
	initControls();
	animate();  // start the animation loop!

	function createEndScene(){
		endScene = initScene();
		endText = createSkyBox('youwon.png',10);
		//endText.rotateX(Math.PI);
		endScene.add(endText);
		var light1 = createPointLight();
		light1.position.set(0,200,20);
		endScene.add(light1);
		endCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		endCamera.position.set(0,50,1);
		endCamera.lookAt(0,0,0);

	}

//creating lose scene - Jerry Miller and Alex Rubin
	function createEndLoseScene(){
    endLoseScene = initScene();
    endLoseText = createSkyBox('youlose.png',10);
    endLoseText.rotateZ(Math.PI);
    endLoseScene.add(endLoseText);
    var light1 = createPointLight();
    light1.position.set(0,200,20);
    endLoseScene.add(light1);
    endCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
    endCamera.position.set(0,50,-1);
    endCamera.lookAt(0,0,0);

  }

	/**
	  To initialize the scene, we initialize each of its components
	*/
	function init(){
      initPhysijs();
			scene = initScene();
			createEndScene();
			createEndLoseScene();
			initRenderer();
			createMainScene();
	}

	function createMainScene(){
      // setup lighting
			var light1 = createPointLight();
			light1.position.set(0,200,20);
			scene.add(light1);
			var light0 = new THREE.AmbientLight( 0xffffff,0.25);
			scene.add(light0);

			// create main camera
			camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
			camera.position.set(0,50,0);
			camera.lookAt(0,0,0);

			// create the ground and the skybox
			var ground = createGround('grass.png');
			scene.add(ground);
			var skybox = createSkyBox('sky.jpg',1);
			scene.add(skybox);

			// create the avatar - texture change by Jerry miller, monkey by jin byun
			avatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
			var loader = new THREE.JSONLoader();
			loader.load("../models/suzanne.json",
						function ( geometry, materials ) {
							console.log("loading suzanne");
							 var texture = new THREE.TextureLoader().load( '...zebra.jpg/' );
							// texture.wrapS = THREE.RepeatWrapping;
              //texture.wrapT = THREE.RepeatWrapping;
              //texture.repeat.set( k, k );
							var material = new THREE.MeshLambertMaterial( { color: 0x581845, material: texture, side:THREE.DoubleSide} );
							var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
							avatar = new Physijs.BoxMesh( geometry, pmaterial );
							avatar.setDamping(0.1,0.1);
							avatar.castShadow = true;
							avatarCam.position.set(0,4,0);
							avatarCam.lookAt(0,4,10);
							avatar.add(avatarCam);
							avatar.position.y = 20;
							avatarCam.translateY(-4);
							avatarCam.translateZ(3);
							scene.add(avatar);
						},
						function(xhr){
							console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},
						function(err){console.log("error in loading: "+err);}
					)
			gameState.camera = avatarCam;
      edgeCam = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 0.1, 1000 );
      edgeCam.position.set(20,20,10);


// Extra feature added by Aviya Zarur - 4th camera
			wholeCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
			wholeCam.position.set(50,50,0);
			wholeCam.lookAt(30,0,0);
			//gameState.camera = wholeCam;

			addBalls();
			addSuperBalls();

			cone = createConeMesh(4,6);
			cone.position.set(10,3,7);
			scene.add(cone);

			npc = createBoxMesh2(0x0000ff,1,2,4);
			npc.position.set(30,5,-30);
			npc.addEventListener( 'collision',
	      function( other_object, relative_velocity, relative_rotation, contact_normal ) {
	        if (other_object==avatar){
	            console.log("npc"+i+" hit the avatar");
	            // soundEffect('good.wav');
	            gameState.health=gameState.health-1;
	            console.log(gameState.health);
	            if(gameState.health==0){
	                    console.log("minus");
	                    gameState.scene='youlose';
	        		}
					this.position.y = this.position.y - 100;
	        this.__dirtyPosition = true;
	        npc.__dirtyPosition = true;
	        npc.position.set(Math.random()*40, 5,Math.random()*40);
	   			}
	  		}
 			)
			scene.add(npc);
			console.dir(npc);
			//playGameMusic();

	}
//Extra feature added by - Alex Rubin
	function addSuperBalls(){
		var numBalls = 10;
		var ball;

		for(i=0;i<numBalls;i++){
			ball = createsuperBall();
			ball.position.set(randN(20)+15,30,randN(20)+15);
			scene.add(ball);

			ball.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==cone){
						console.log("ball "+i+" hit the cone");
						soundEffect('good.wav');
						gameState.score += 1;  // add one to the score
						if (gameState.score==numBalls) {
							gameState.scene='youwon';
						}
						this.position.y = this.position.y - 100;
						this.__dirtyPosition = true;
					}
				}
			)
		}
	}

  function createsuperBall(){
  		var geometry = new THREE.SphereGeometry( 1, 24, 24);
  		var material = new THREE.MeshLambertMaterial( { color: 0xFF69B4} );
  		var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
      var mesh = new Physijs.BoxMesh( geometry, pmaterial );
  		mesh.setDamping(0.1,0.1);
  		mesh.castShadow = true;
  		return mesh;
	}

	function randN(n){
		return Math.random()*n;
	}

	function addBalls(){
		var numBalls = 20;
		var ball;
		//Added by Allison, two different colored balls
		for(i=0;i<numBalls;i++){
			if(i % 2 == 0) {
				ball = createBall();
			} else {
				ball = createBall2();
			}
			ball.position.set(randN(20)+15,30,randN(20)+15);
			scene.add(ball);

			ball.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==cone){
						console.log("ball "+i+" hit the cone");
						soundEffect('good.wav');
						gameState.score += 1;  // add one to the score
						if (gameState.score==numBalls) {
							gameState.scene='youwon';
						}
            //scene.remove(ball);  // this isn't working ...
						// make the ball drop below the scene ..
						// threejs doesn't let us remove it from the schene...
						this.position.y = this.position.y - 100;
						this.__dirtyPosition = true;
					}
				}
			)
		}
	}



	function playGameMusic(){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( '/sounds/loop.mp3', function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( true );
			sound.setVolume( 0.05 );
			sound.play();
		});
	}

	function soundEffect(file){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( '/sounds/'+file, function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( false );
			sound.setVolume( 0.5 );
			sound.play();
		});
	}

	/* We don't do much here, but we could do more!
	*/
	function initScene(){
		//scene = new THREE.Scene();
    var scene = new Physijs.Scene();
		return scene;
	}

  function initPhysijs(){
    Physijs.scripts.worker = '/js/physijs_worker.js';
    Physijs.scripts.ammo = '/js/ammo.js';
  }
	/*
		The renderer needs a size and the actual canvas we draw on
		needs to be added to the body of the webpage. We also specify
		that the renderer will be computing soft shadows
	*/
	function initRenderer(){
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight-50 );
		document.body.appendChild( renderer.domElement );
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	}


	function createPointLight(){
		var light;
		light = new THREE.PointLight( 0xffffff);
		light.castShadow = true;
		//Set up shadow properties for the light
		light.shadow.mapSize.width = 2048;  // default
		light.shadow.mapSize.height = 2048; // default
		light.shadow.camera.near = 0.5;       // default
		light.shadow.camera.far = 500      // default
		return light;
	}

	function createBoxMesh(color){
		var geometry = new THREE.BoxGeometry( 1, 1, 1);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
    //mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}

	function createBoxMesh2(color,w,h,d){
		var geometry = new THREE.BoxGeometry( w, h, d);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
		//mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}

	function createGround(image){
		// creating a textured plane which receives shadows
		var geometry = new THREE.PlaneGeometry( 180, 180, 128 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 15, 15 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );

//feature added by Jin Byun - change pmaterial of ground so balls bounce
		var pmaterial = new Physijs.createMaterial(material,0.9,0.4);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );

		mesh.receiveShadow = true;

		mesh.rotateX(Math.PI/2);
		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical
	}

//Extra feature - Allison Regna - red balls
	function createBall2(){
			var geometry = new THREE.SphereGeometry( 1, 16, 16);
			var material = new THREE.MeshLambertMaterial( { color: 0xC0392B} );
			var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
			var mesh = new Physijs.BoxMesh( geometry, pmaterial );
			mesh.setDamping(0.1,0.1);
			mesh.castShadow = true;
			return mesh;
		}

	function createSkyBox(image,k){
		// creating a textured plane which receives shadows
		var geometry = new THREE.SphereGeometry( 80, 80, 80 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( k, k );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		//var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new THREE.Mesh( geometry, material, 0 );

		mesh.receiveShadow = false;

		return mesh
	}

	function createConeMesh(r,h){
		var geometry = new THREE.ConeGeometry( r, h, 32);
		var texture = new THREE.TextureLoader().load( '../images/tile.jpg' );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 1, 1 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		var mesh = new Physijs.ConeMesh( geometry, pmaterial, 0 );
		mesh.castShadow = true;
		return mesh;
	}


	function createBall(){
		//var geometry = new THREE.SphereGeometry( 4, 20, 20);
		var geometry = new THREE.SphereGeometry( 1, 16, 16);
		var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
    var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
		return mesh;
	}

	var clock;

	function initControls(){
		// here is where we create the eventListeners to respond to operations

		  //create a clock for the time-based animation ...
			clock = new THREE.Clock();
			clock.start();

			window.addEventListener( 'keydown', keydown);
			window.addEventListener( 'keyup',   keyup );
  }

	function keydown(event){
		console.log("Keydown: '"+event.key+"'");
		// handle reinitializing the scene when it is the first time they play, or they won and want to play again; added by Allison
		if ((gameState.scene == 'start' && event.key =='p') || (gameState.scene == 'youwon' && event.key=='r') || (gameState.scene == 'youlose' && event.key=='r')) {
			play = true;
			gameState.scene = 'main';
			gameState.score = 0;
			gameState.health = 10;
			addBalls();
			return;
	}

		// this is the regular scene
		switch (event.key){
			// change the way the avatar is moving
			case "w": controls.fwd = true;  break;
			case "s": controls.bwd = true; break;
			case "a": controls.left = true; break;
			case "d": controls.right = true; break;
			case "r": controls.up = true; break;
			case "f": controls.down = true; break;
			case "m": controls.speed = 30; break;
      case " ": controls.fly = true;
          console.log("space!!");
          break;
      case "h": controls.reset = true; break;

			// switch cameras
			case "1": gameState.camera = camera; break;
			case "2": gameState.camera = avatarCam; break;
      case "3": gameState.camera = edgeCam; break;

//Extra feature added by Aviya Zarur
			case "4": gameState.camera = wholeCam;break;

			// move the camera around, relative to the avatar
			case "ArrowLeft": avatarCam.translateY(1);break;
			case "ArrowRight": avatarCam.translateY(-1);break;
			case "ArrowUp": avatarCam.translateZ(-1);break;
			case "ArrowDown": avatarCam.translateZ(1);break;

//Q and E controls
			case "q": avatarCam.translateX(-1);break;
			case "e": avatarCam.translateX(1);break;

		}

	}

	function keyup(event){
		//console.log("Keydown:"+event.key);
		//console.dir(event);
		switch (event.key){
			case "w": controls.fwd   = false;  break;
			case "s": controls.bwd   = false; break;
			case "a": controls.left  = false; break;
			case "d": controls.right = false; break;
			case "r": controls.up    = false; break;
			case "f": controls.down  = false; break;
			case "m": controls.speed = 10; break;
      case " ": controls.fly = false; break;
      case "h": controls.reset = false; break;
		}
	}

	function updateNPC(){
		npc.lookAt(avatar.position);
	  npc.__dirtyPosition = true;
		if(avatar.position.x-npc.position.x<20 && npc.position.x-avatar.position.x<20){
        console.log(avatar.position.x-npc.position.x);
        npc.setLinearVelocity(npc.getWorldDirection().multiplyScalar(1));
		}
	}

  function updateAvatar(){
		"change the avatar's linear or angular velocity based on controls state (set by WSAD key presses)"

		var forward = avatar.getWorldDirection();

		if (controls.fwd){
			avatar.setLinearVelocity(forward.multiplyScalar(controls.speed));
		} else if (controls.bwd){
			avatar.setLinearVelocity(forward.multiplyScalar(-controls.speed));
		} else {
			var velocity = avatar.getLinearVelocity();
			velocity.x=velocity.z=0;
			avatar.setLinearVelocity(velocity); //stop the xz motion
		}

    if (controls.fly){
      avatar.setLinearVelocity(new THREE.Vector3(0,controls.speed,0));
    }

		if (controls.left){
			avatar.setAngularVelocity(new THREE.Vector3(0,controls.speed*0.1,0));
		} else if (controls.right){
			avatar.setAngularVelocity(new THREE.Vector3(0,-controls.speed*0.1,0));
		}

    if (controls.reset){
      avatar.__dirtyPosition = true;
      avatar.position.set(40,10,40);
    }

	}


	function animate() {

		requestAnimationFrame( animate );

		switch(gameState.scene) {

			case "start": //added by Allison Regna
				renderer.render( scene , camera );
				break;
			case "youwon":
				endText.rotateY(0.005);
				renderer.render( endScene, endCamera );
				break;
			case "youlose":
				renderer.render( endLoseScene, endCamera);
				break;

			case "main":
				updateAvatar();
				updateNPC();
        edgeCam.lookAt(avatar.position);
	    	scene.simulate();
				if (gameState.camera!= 'none'){
					renderer.render( scene, gameState.camera );
				}
				break;

			default:
			  console.log("don't know the scene "+gameState.scene);

		}

		//Edited div for start scene - Allison regna
		var info = document.getElementById("info");
		if(!play) {
			info.innerHTML='<div style="font-size:24pt">Press p to begin playing!</div>';
		} else {
			info.innerHTML='<div style="font-size:24pt">Score: '
	    + gameState.score
	    + " health="+gameState.health
	    + '</div>';
		}
	}
