/*
 * PA03 Group J-Crew
 */

	// Global variable declarations
	var scene, renderer;
	var camera, avatarCam;
	var avatar1;
	var avatar2;
	var suzyOBJ;
	var theObj;
	var ground;
	var clock;
	var endScene, endLoseScene, endCamera, endText;

	var controls =
	     {fwd:false, bwd:false, left:false, right:false, up:false,
				speed:10,speed2:10, fly:false, reset:false, fwd2:false, bwd2:false, left2:false, right2:false}

	var gameState =
	     {score:0, health:5, score2:0, health2:5, scene:'main', camera:'none' }

	// Main game control
  	init();
	initControls();
	animate();

	/****************************************************************
	  To initialize the scene, we initialize each of its components *
	****************************************************************/
	function init(){
      		initPhysijs();
		scene = initScene();
		createEndScene();
		createEndLoseScene();
		initRenderer();
		createMainScene();
	}

	/****************************************************************
			Defines different game scenes 		        *
	****************************************************************/
	function createMainScene(){
		// setup lighting
		var light1 = createPointLight();
		light1.position.set(0,200,20);
		scene.add(light1);
		var light0 = new THREE.AmbientLight( 0xffffff,0.25);
		scene.add(light0);

		// create main camera
		camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		camera.position.set(0,40,25);
		camera.lookAt(0,0,-5);

		// create the ground and the skybox
		ground = createGround('grass.png');
		ground.scale.set(1,.75,1);
		scene.add(ground);

		var skybox = createSkyBox('sky.jpg',1);
		scene.add(skybox);

		addBalls();
		initSuzanneOBJ();
		playGameMusic();
	}
	
	/* Done by: Aviya */
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
	
	/* Done by: Aviya */
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

	/****************************************************************
				Adds balls to the scene 										  *
	****************************************************************/
	function randN(n){
		return Math.random()*n;
	}

	/* Returns a random integer between 0 inclusive and maxInt noninclusive
		 Added by Allison */
	function getRandomInt(maxInt) {
		return Math.floor(Math.random() * Math.floor(maxInt));
	}

	/* Returns a random integer in the range [min, max]
		 Added by Allison */
	function getRandomIntInRange(min, max) {
		return Math.random() * (max - min) + min;
	}

	/* Added by: Allison */
	function addBalls(){
		var numBalls = 75;
		var colors = [0xAFFC41, 0xAAEFDF, 0x843B62, 0xF497DA, 0xF46036, 0x235789, 0x00A5CF, 0xA60067, 0xF08700, 0x8AC926];

		for(i=0; i< numBalls; i++){
			var color = colors[getRandomInt(10)]
			var ball = createBall(color);
			ball.position.set(getRandomIntInRange(-50, 50), 5, getRandomIntInRange(-30,30));
			scene.add(ball);

			ball.addEventListener( 'collision',
			 	function( other_object, relative_velocity, relative_rotation, contact_normal ) {
			 		if (other_object== avatar1){
			 			console.log("Another ball was eaten!");
			 			soundEffect('good.wav');
			 			gameState.score += 1;  // add one to the score
			 			if (gameState.score== 5) {
			 				gameState.scene='youwon';
			 			}
			 			// make the ball drop below the scene ..
			 			this.position.y = this.position.y - 100;
			 			this.__dirtyPosition = true;
			 		}
					if (other_object== avatar2){
			 			console.log("Another ball was eaten!");
			 			soundEffect('good.wav');
			 			gameState.score2 += 1;  // add one to the score
			 			if (gameState.score2== 5) {
			 				gameState.scene='youwon';
			 			}
			 			// make the ball drop below the scene ..
			 			this.position.y = this.position.y - 100;
			 			this.__dirtyPosition = true;
			 		}
				}
			)

			if(i% 10 == 5  || i% 10 == 4) {
				var badBall = createHealthDownBall();
				badBall.position.set(getRandomIntInRange(-50, 50), 5, getRandomIntInRange(-10,10));
				scene.add(badBall);

				badBall.addEventListener( 'collision',
					function( other_object, relative_velocity, relative_rotation, contact_normal ) {
						if (other_object== avatar1){
							console.log("Uh oh, hippo ate a bad ball!");
							soundEffect('bad.wav');
							gameState.health -= 1;  // add one to the score
							if (gameState.health < 0) {
								gameState.scene='youlose';
							}
							// make the ball drop below the scene ..
							this.position.y = this.position.y - 100;
							this.__dirtyPosition = true;
						}
						if (other_object== avatar2){
							console.log("Uh oh, hippo ate a bad ball!");
							soundEffect('bad.wav');
							gameState.health2 -= 1;  // add one to the score
							if (gameState.health2 < 0) {
								gameState.scene='youlose';
							}
							// make the ball drop below the scene ..
							this.position.y = this.position.y - 100;
							this.__dirtyPosition = true;
						}
					}
				)
			}

			if(i% 10 == 0) {
				var goodBall = createHealthUpBall();
				goodBall.position.set(getRandomIntInRange(-50, 50), 5, getRandomIntInRange(-10,10));
				scene.add(goodBall);

				goodBall.addEventListener( 'collision',
					function( other_object, relative_velocity, relative_rotation, contact_normal ) {
						if (other_object== avatar1){
							console.log("Healthy Ball was eaten!");
							soundEffect('good.wav');
							gameState.health += 1;
							// make the ball drop below the scene ..
							this.position.y = this.position.y - 100;
							this.__dirtyPosition = true;
						}
						if (other_object== avatar2){
							console.log("Healthy Ball was eaten!");
							soundEffect('good.wav');
							gameState.health2 += 1;
							// make the ball drop below the scene ..
							this.position.y = this.position.y - 100;
							this.__dirtyPosition = true;
						}
					}
				)
			}
		}
	}

	/****************************************************************
			 Sound effects and game music 		 					  
	****************************************************************/

	/* Plays annoying song in background :)
	   Added by: Allison */
	function playGameMusic(){
		var listener = new THREE.AudioListener();
		camera.add( listener );
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( '/sounds/HippoSong.mp3', function( buffer ) {
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

	/****************************************************************
				Initialize scene 		 					 							  *
	****************************************************************/
	function initScene(){
		//scene = new THREE.Scene();
   		 var scene = new Physijs.Scene();
		return scene;
	}

	function initPhysijs(){
	    Physijs.scripts.worker = '../js/physijs_worker.js';
	    Physijs.scripts.ammo = '../js/ammo.js';
	}

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
		light.shadow.camera.near = 0.5;     // default
		light.shadow.camera.far = 500      // default
		return light;
	}

	/****************************************************************
				Create meshes 											  *
	****************************************************************/
	function createGround(image){
		var geometry = new THREE.PlaneGeometry( 200, 100, 128 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 15, 15 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );
		mesh.receiveShadow = true;
		mesh.rotateX(Math.PI/2);
		return mesh;
	}

	function createSkyBox(image,k){
		var geometry = new THREE.SphereGeometry(400, 20, 20 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( k, k );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var mesh = new THREE.Mesh( geometry, material, 0 );
		mesh.receiveShadow = false;
		return mesh;
	}

	/* Added by: Allison */
	function createBall(color){
		var geometry = new THREE.SphereGeometry( 1, 16, 16);
		var material = new THREE.MeshLambertMaterial( { color: color, wireframe: false} );
		var pmaterial = new Physijs.createMaterial(material, .9, .95);
		var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		var linearDamping = .1;
		var angularDamping = .1;
		mesh.setDamping(linearDamping, angularDamping);
		mesh.castShadow = true;
		mesh.position.set(0,1,0);
		return mesh;
	}

	/* Added by: Allison */
	function createHealthDownBall() {
		var geometry = new THREE.SphereGeometry( 1, 16, 16);
		var material = new THREE.MeshLambertMaterial( { color: 0xFAF9F9, wireframe: false} );
		var pmaterial = new Physijs.createMaterial(material, 0.9, 0.95);
		var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		var linearDamping = .1;
		var angularDamping = .1;
		mesh.setDamping(linearDamping, angularDamping);
		mesh.castShadow = true;
		mesh.position.set(0,1,0);
		return mesh;
	}

	/* Added by: Allison */
	function createHealthUpBall() {
		var geometry = new THREE.SphereGeometry( 1, 16, 16);
		var material = new THREE.MeshPhongMaterial( { color: 0xD4AF37, wireframe: false, shininess: 50} );
		var pmaterial = new Physijs.createMaterial(material, 0.9, 0.95);
		var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		var linearDamping = .1;
		var angularDamping = .1;
		mesh.setDamping(linearDamping, angularDamping);
		mesh.castShadow = true;
		mesh.position.set(0,1,0);
		return mesh;
	}

	/****************************************************************
				Avatar Functions										  
	****************************************************************/
	/* Added by: Jin & Jerry */
	function initSuzanneOBJ(){
		var loader = new THREE.OBJLoader();
		var loader2 = new THREE.OBJLoader();

		loader.load("../models/hipp.obj",
				function ( obj ) {
					console.log("loading obj file");
					console.dir(obj);
					//scene.add(obj);
					obj.castShadow = true;
					suzyOBJ = obj;
					// look inside the OBJ which was imported and find the geometry and material
					// so that you can pull them out and use them to create the Physics object
					var geometry = suzyOBJ.children[0].geometry;
					var material = suzyOBJ.children[0].material;
					suzyOBJ = new Physijs.BoxMesh(geometry,material);

					suzyOBJ.position.set(-60,10,-30);
					suzyOBJ.scale.set(1.5, 1.5, 1.5);
					suzyOBJ.castShadow = true;

					scene.add(suzyOBJ);
					avatar1=suzyOBJ;
				},
				function(xhr){
					console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
				},
				function(err){
					console.log("error in loading: "+err);
				}
			)

			loader2.load("../models/hipp.obj",
				function ( obj) {
					console.log("loading obj file");
					console.dir(obj);
					obj.castShadow = true;
					theOBJ = obj;

					var geometry2 = theOBJ.children[0].geometry;
					var material2 = theOBJ.children[0].material;
					theOBJ = new Physijs.BoxMesh(geometry2,material2);

					theOBJ.scale.set(1.5, 1.5, 1.5);
					theOBJ.position.set(60,10,-30);
					theOBJ.castShadow=true;

					theOBJ.traverse( function ( child ) {
						if ( child instanceof THREE.Mesh )
								child.material.color.setRGB (1, 0, 0);
					 } );

					scene.add(theOBJ);
					avatar2=theOBJ;
				},
				function(xhr){
					console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},

				function(err){
					console.log("error in loading: "+err);}
			)
		}

	function initControls(){
			clock = new THREE.Clock();
			clock.start();

			window.addEventListener( 'keydown', keydown);
			window.addEventListener( 'keyup',   keyup );
  	}
	
	/* Added by Jerry */
	function keydown(event){
		console.log("Keydown: '"+event.key+"'");
		console.dir(event);
		//if the game is in a winning state and the user wants to play again, change the scene back to main
		if ((gameState.scene == 'youwon' && event.key=='r') || (gameState.scene == 'youlose' && event.key=='r')) {
			gameState.scene = 'main';
			gameState.score = 0;
			addBalls();
			return;
		}
		//if the game is not in a winning state, determine moves based on key events
		switch (event.key){
			// change the way the avatar1 is moving
			case "w": controls.fwd = true;  break;
			case "s": controls.bwd = true; break;
			case "a": controls.left = true; break;
			case "d": controls.right = true; break;
			case "m": controls.speed = 30; break;

			// change the way the avatar2 is moving
			case "i": controls.fwd2 = true;  break;
			case "k": controls.bwd2 = true; break;
			case "j": controls.left2 = true; break;
			case "l": controls.right2 = true; break;
			case "n": controls.speed2 = 30; break;

			//for resetting the game
      			case "h": controls.reset = true; break;
			case ";": gameState.scene = 'youwon'; return;
			case "r": avatar1.rotation.set(0,0,0); avatar1.__dirtyRotation=true; avatar2.rotation.set(0,0,0); avatar2.__dirtyRotation=true;
			console.dir(avatar1.rotation); break;
		}
	}

	/* Added by Jerry */
	function keyup(event){
		switch (event.key){
			case "w": controls.fwd   = false;  break;
			case "s": controls.bwd   = false; break;
			case "a": controls.left  = false; break;
			case "d": controls.right = false; break;
			//case "r": controls.up    = false; break;
			case "f": controls.down  = false; break;
			case "m": controls.speed = 10; break;
     			case " ": controls.fly = false; break;
     			case "h": controls.reset = false; break;
			case "y": controls.up = false; break;

			//controls for second hippo
			case "i": controls.fwd2 = false;  break;
			case "k": controls.bwd2 = false; break;
			case "j": controls.left2 = false; break;
			case "l": controls.right2 = false; break;
			case "n": controls.speed2 = 10; break;
		}
	}

	/* Updates the hippo avatars motion
	   Done by: Jin and Jerry */
	  function updateAvatar(){
		"change the avatar's linear or angular velocity based on controls state (set by WSAD key presses)"
		var forward = avatar1.getWorldDirection();
		var forward2 = avatar2.getWorldDirection();

		if (controls.fwd){
			avatar1.setLinearVelocity(forward.multiplyScalar(controls.speed));
		} else if (controls.bwd){
			avatar1.setLinearVelocity(forward.multiplyScalar(-controls.speed));
		} else {
			var velocity = avatar1.getLinearVelocity();
			velocity.x=velocity.z=0;
			avatar1.setLinearVelocity(velocity); //stop the xz motion
		}

		 if (controls.fly){
			  avatar1.setLinearVelocity(new THREE.Vector3(0,controls.speed,0));
		}

		if (controls.left){
			avatar1.setAngularVelocity(new THREE.Vector3(0,controls.speed*0.1,0));
		} else if (controls.right){
			avatar1.setAngularVelocity(new THREE.Vector3(0,-controls.speed*0.1,0));
		}

		// AVATAR2
		if (controls.fwd2){
			avatar2.setLinearVelocity(forward2.multiplyScalar(controls.speed2));
		} else if (controls.bwd2){
			avatar2.setLinearVelocity(forward2.multiplyScalar(-controls.speed2));
		} else {
			var velocity2 = avatar2.getLinearVelocity();
			velocity2.x=velocity2.z=0;
			avatar2.setLinearVelocity(velocity2); //stop the xz motion
		 }

		if (controls.left2){
			avatar2.setAngularVelocity(new THREE.Vector3(0,controls.speed2*0.1,0));
		} else if (controls.right2){
			avatar2.setAngularVelocity(new THREE.Vector3(0,-controls.speed2*0.1,0));
		}

		if (controls.reset){
			avatar1.position.set(-60,1,-30);
			avatar2.position.set(60,1,-30);
		  avatar1.__dirtyPosition = true;
			avatar2.__dirtyPosition = true;
		}
	}

	function updateSuzyOBJ(){
		var t = clock.getElapsedTime();
		suzyOBJ.material.emissive.r = Math.abs(Math.sin(t));
		suzyOBJ.material.color.b=0
	}

	function animate() {
		requestAnimationFrame( animate );
  		 gameState.camera = camera;
		switch(gameState.scene) {
			case "youwon":
				endText.rotateY(0.005);
				renderer.render( endScene, endCamera );
				break;

     			case "youlose":
				renderer.render( endLoseScene, endCamera);
				break;

			case "main":
				updateAvatar();
				updateSuzyOBJ();

	    	scene.simulate();
				if (gameState.camera!= 'none'){
					renderer.render( scene, camera );
				}
				break;

			default:
			  console.log("don't know the scene "+gameState.scene);
		}

	/* Display to the user their score
	    Done by: Jerry and Allison */
	  var info = document.getElementById("info");
		var infohippo2 = document.getElementById("infohippo2");
		info.innerHTML='<div style="font-size:15pt;color:orange;text-align:left">Score 1: ' + gameState.score +
										' Health 1: '+ gameState.health + '</div>';
		infohippo2.innerHTML='<div style="font-size:15pt;color:red;text-align:left">Score 2: ' + gameState.score2 +
																		' Health 2: '+ gameState.health2 + '</div>';
}
