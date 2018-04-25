/*
 * PA03 Group J-Crew
 */
console.log("Welcome to Hungry Hungry Hippos");
	// Global variable declarations
	var scene, renderer;
	var camera, avatarCam;
	var avatar1;
	var avatar2;
	var suzyOBJ;
	var theObj;
	var ground;
	var clock;
	var sound;
	var begin = true;
	var start = true;
	var endScene, endLoseScene, endCamera, endText, endLoseText;
	var startScene;
	var textMesh;
	var textMesh2;
	var textMesh3;
	var textMesh4;
	var textGeometry
	var health=5
	var health2=5;
	var score= 0;
	var score2=0;
	var wall1, wall2, wall3;
	var npc;
	var npc1;
  	var loader = new THREE.FontLoader();
	var play = true;

	var controls =
	     {fwd:false, bwd:false, left:false, right:false, up:false,
				speed:10,speed2:10, fly:false, reset:false, fwd2:false, bwd2:false, left2:false, right2:false}

	var gameState =
	     {score:0, health:5, score2:0, health2:5, scene:'start', camera:'none' }

	// Main game control
  	init();
	initControls();
	createStartScene();
	animate();

	/****************************************************************
	  To initialize the scene, we initialize each of its components *
	****************************************************************/
	function init(){
   	initPhysijs();
		scene = initScene();
		initRenderer();
		createMainScene();
	}

	function initEndScenes(){
		createEndScene();
		createEndLoseScene();
	}

	/****************************************************************
			Defines different game scenes 		        *
	****************************************************************/
	function createMainScene(){
		//Added by Aviya Zarur
		wall1 = createBoxMesh(0x0000ff);
		wall1.position.set(93,2,-8);
		wall1.scale.set(1,2,60);
		scene.add(wall1);

		wall2 = createBoxMesh(0x0000ff);
		wall2.position.set(-93,2,-8);
		wall2.scale.set(1,2,60);
		scene.add(wall2);

		wall3 = createBoxMesh(0x0000ff);
		wall3.position.set(0,2,-35);
		wall3.scale.set(190,2,2);
		scene.add(wall3);

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

		// Four text meshes for scores and health
    // Added by Jerry
		loader.load( 'fonts/helvetiker_regular.typeface.json',
		function ( font ) {
				textGeometry = new THREE.TextGeometry( "Avatar1 Health: "+gameState.health, {
				font: font,
				size: 3,
				height: 0.2,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 0.01,
				bevelSize: 0.08,
				bevelSegments: 5
			} );
			var textMaterial = new THREE.MeshLambertMaterial( { color: 'black' } );
			textMesh = new THREE.Mesh( textGeometry, textMaterial );
			textMesh.position.set(-40,30,-20);
			textMesh.rotation.x=-.9;
			textMesh.name= "Text";
			scene.add(textMesh);
		})


		loader.load( 'fonts/helvetiker_regular.typeface.json',
		function ( font ) {
				textGeometry = new THREE.TextGeometry( "Avatar2 Health: "+gameState.health2, {
				font: font,
				size: 3,
				height: 0.2,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 0.01,
				bevelSize: 0.08,
				bevelSegments: 5
			} );
			var textMaterial = new THREE.MeshLambertMaterial( { color: 'black' } );
			textMesh2 = new THREE.Mesh( textGeometry, textMaterial );
			textMesh2.position.set(15,30,-20);
			textMesh2.rotation.x=-.9;
			scene.add(textMesh2);
		})
		loader.load( 'fonts/helvetiker_regular.typeface.json',
		function ( font ) {
				textGeometry = new THREE.TextGeometry( "Avatar1 Score: "+gameState.score, {
				font: font,
				size: 3,
				height: 0.2,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 0.01,
				bevelSize: 0.08,
				bevelSegments: 5
			} );
			var textMaterial = new THREE.MeshLambertMaterial( { color: 'black' } );
			textMesh3 = new THREE.Mesh( textGeometry, textMaterial );
			textMesh3.position.set(-40,20,-20);
			textMesh3.rotation.x=-.9;
			scene.add(textMesh3);
		})
		loader.load( 'fonts/helvetiker_regular.typeface.json',
		function ( font ) {
				textGeometry = new THREE.TextGeometry( "Avatar2 Score: "+gameState.score2, {
				font: font,
				size: 3,
				height: 0.2,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 0.01,
				bevelSize: 0.08,
				bevelSegments: 5
			} );
			var textMaterial = new THREE.MeshLambertMaterial( { color: 'black' } );
			textMesh4 = new THREE.Mesh( textGeometry, textMaterial );
			textMesh4.position.set(15,20,-20);
			textMesh4.rotation.x=-.9;
			scene.add(textMesh4);
		})


		addBalls();
		initSuzanneOBJ();
		playGameMusic();

	//NPC by Aviya Zarur
		npc = createBoxMesh2(0x0000ff,1,2,4);
		npc.position.set(-30,5,-30);
		npc.addEventListener( 'collision',
			function( other_object, relative_velocity, relative_rotation, contact_normal ) {
				if (other_object==avatar1){
						console.log("npc"+i+" hit the avatar");
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


  //NPC by Aviya Zarur
    npc1 = createBoxMesh2(0xff0000,1,2,4);
    npc1.position.set(30,5,-30);
    npc1.addEventListener( 'collision',
      function( other_object, relative_velocity, relative_rotation, contact_normal ) {
        if (other_object==avatar2){
            console.log("npc"+i+" hit the avatar");
            gameState.health2=gameState.health2-1;
            console.log(gameState.health2);
            if(gameState.health2==0){
                    console.log("minus");
                    gameState.scene='youlose';
            }
        this.position.y = this.position.y - 100;
        this.__dirtyPosition = true;
        npc1.__dirtyPosition = true;
        npc1.position.set(Math.random()*70, 5,Math.random()*40);
        }
      }
    )
    scene.add(npc1);
    console.dir(npc1);

  }
  /* Done by: Jerry */
  function createStartScene(){
    startScene = initScene();
    var startText = createPlaneBox('start.png');
    startScene.add(startText);
    var light1 = createPointLight();
    light1.position.set(0,150,-100);
    startScene.add(light1);
    var light2 = createPointLight();
    light2.position.set(0,200,20);
    endCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
    endCamera.position.set(0,50,1);
    endCamera.lookAt(0,0,0);
  }
	/* Done by: Aviya & Allison */
	function createEndScene(){
		sound.stop();
		begin = false;
		endScene = initScene();
		if(gameState.score == 5) { //yellow hippo won
			var winFile = 'yellow_win_2.png';
		}else { //red hippo must have won
			var winFile = 'red_win_2.png';
		}
		endText = createSkyBox(winFile,10);
		endScene.add(endText);
		var light1 = createPointLight();
		light1.position.set(0,200,20);
		endScene.add(light1);
		endCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		endCamera.position.set(0,50,1);
		endCamera.lookAt(0,0,0);
	}

	/* Done by: Aviya & Allison */
	 function createEndLoseScene(){
		 sound.stop();
		 begin = false;
	    endLoseScene = initScene();
			if(gameState.health < 0) { //yellow hippo lost
				var loseFile = 'yellow_lose_2.png';
			}else { //red hippo must have lost
				var loseFile = 'red_lose_2.png';
			}
			endLoseText = createSkyBox(loseFile,20);
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
			 			soundEffect('sounds/good.wav');
			 			gameState.score += 1;  // add one to the score
			 			if (gameState.score>= 5) {
							initEndScenes();
			 				gameState.scene='youwon';
			 			}
			 			// make the ball drop below the scene ..
			 			this.position.y = this.position.y - 100;
			 			this.__dirtyPosition = true;
			 		}
					if (other_object== avatar2){
			 			console.log("Another ball was eaten!");
			 			soundEffect('sounds/good.wav');
			 			gameState.score2 += 1;  // add one to the score
			 			if (gameState.score2>= 5) {
							initEndScenes();
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
							soundEffect('sounds/bad.wav');
							gameState.health -= 1;  // add one to the score
							if (gameState.health < 0) {
								initEndScenes();
								gameState.scene='youlose';
							}
							// make the ball drop below the scene ..
							this.position.y = this.position.y - 100;
							this.__dirtyPosition = true;
						}
						if (other_object== avatar2){
							console.log("Uh oh, hippo ate a bad ball!");
							soundEffect('sounds/bad.wav');
							gameState.health2 -= 1;  // add one to the score
							if (gameState.health2 < 0) {
								initEndScenes();
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
							soundEffect('sounds/good.wav');
							gameState.health += 1;
							// make the ball drop below the scene ..
							this.position.y = this.position.y - 100;
							this.__dirtyPosition = true;
						}
						if (other_object== avatar2){
							console.log("Healthy Ball was eaten!");
							soundEffect('sounds/good.wav');
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
		sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( 'sounds/HippoSong.mp3', function( buffer ) {
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
	    Physijs.scripts.worker = 'js/physijs_worker.js';
	    Physijs.scripts.ammo = 'ammo.js';
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
		var texture = new THREE.TextureLoader().load( 'images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 15, 15 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture, side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );
		mesh.receiveShadow = true;
		mesh.rotateX(Math.PI/2);
		return mesh;
	}

	function createSkyBox(image,k){
		var geometry = new THREE.SphereGeometry(400, 20, 20 );
		var texture = new THREE.TextureLoader().load( 'images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( k, k );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture, side:THREE.DoubleSide} );
		var mesh = new THREE.Mesh( geometry, material, 0 );
		mesh.receiveShadow = false;
		return mesh;
	}
	// Plane for start scene
  // Added by Jerry
	function createPlaneBox(image){
		var geometry = new THREE.PlaneGeometry(400, 258, 200 );
		var texture = new THREE.TextureLoader().load( 'images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
  		texture.repeat.x = - 1;
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture, side:THREE.DoubleSide} );
		var mesh = new THREE.Mesh( geometry, material, 0 );
		mesh.position.y=-2
		mesh.rotateX(Math.PI/8);
		return mesh;
	}

	/*added by Aviya Zarur*/
	function createBoxMesh(color){
		var geometry = new THREE.BoxGeometry( 1, 1, 1);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
		mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}

	//Added by Aviya Zarur
	function createBoxMesh2(color,w,h,d){
		var geometry = new THREE.BoxGeometry( w, h, d);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
		mesh.castShadow = true;
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

	/* Added by: Allison and Alex */
	function createHealthDownBall() {
		var geometry = new THREE.SphereGeometry( 1, 16, 16);
    		var texture = new THREE.TextureLoader().load( 'images/NewWhite.jpg' );
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set( 0.1, 0.1 );
                var material = new THREE.MeshLambertMaterial( { color: 0xFAF9F9,  map: texture ,side:THREE.DoubleSide} );
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
	var loader3 = new THREE.OBJLoader();
	var loader4 = new THREE.OBJLoader();
	var loader5 = new THREE.OBJLoader();
	var loader6 = new THREE.OBJLoader();

		loader.load("models/hipp.obj",
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

			loader2.load("models/hipp.obj",
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

			loader3.load("models/Palm1.obj",
				function ( obj) {
					console.log("loading obj file");
					console.dir(obj);
					obj.castShadow = true;
					tOBJ = obj;

					var geometry3 = tOBJ.children[0].geometry;
					var material3 = tOBJ.children[0].material;
					tOBJ = new Physijs.BoxMesh(geometry3,material3,0);

					tOBJ.position.set(-65,0,10);
					tOBJ.castShadow=true;

					tOBJ.traverse( function ( child ) {
						if ( child instanceof THREE.Mesh )
								child.material.color.setRGB (0, 1, 0);
					 } );
					scene.add(tOBJ);
				},
				function(xhr){
					console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},

				function(err){
					console.log("error in loading: "+err);}
			)

			loader4.load("models/Palm2.obj",
				function ( obj) {
					console.log("loading obj file");
					console.dir(obj);
					obj.castShadow = true;
					tOBJ2 = obj;

					var geometry4 = tOBJ2.children[0].geometry;
					var material4 = tOBJ2.children[0].material;
					tOBJ2 = new Physijs.BoxMesh(geometry4,material4,0);

					tOBJ2.position.set(70,0,5);
					tOBJ2.castShadow=true;

					tOBJ2.traverse( function ( child ) {
						if ( child instanceof THREE.Mesh )
								child.material.color.setRGB (0, 1, 0);
					 } );
					scene.add(tOBJ2);
				},
				function(xhr){
					console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},

				function(err){
					console.log("error in loading: "+err);}
			)

			loader5.load("models/Palm3.obj",
				function ( obj) {
					console.log("loading obj file");
					console.dir(obj);
					obj.castShadow = true;
					tOBJ3 = obj;

					var geometry5 = tOBJ3.children[0].geometry;
					var material5 = tOBJ3.children[0].material;
					tOBJ3 = new Physijs.BoxMesh(geometry5,material5,0);

					tOBJ3.position.set(-80,0,-20);
					tOBJ3.castShadow=true;

					tOBJ3.traverse( function ( child ) {
						if ( child instanceof THREE.Mesh )
								child.material.color.setRGB (0, 1, 0);
					 } );
					scene.add(tOBJ3);
				},
				function(xhr){
					console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},

				function(err){
					console.log("error in loading: "+err);}
			)

			loader6.load("models/Palm4.obj",
				function ( obj) {
					console.log("loading obj file");
					console.dir(obj);
					obj.castShadow = true;
					tOBJ4 = obj;

					var geometry6 = tOBJ4.children[0].geometry;
					var material6 = tOBJ4.children[0].material;
					tOBJ4 = new Physijs.BoxMesh(geometry6,material6,0);

					tOBJ4.position.set(80,0,-20);
					tOBJ4.castShadow=true;

					tOBJ4.traverse( function ( child ) {
						if ( child instanceof THREE.Mesh )
								child.material.color.setRGB (0, 1, 0);
					 } );
					scene.add(tOBJ4);
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
		//if the game is in a winning state and the user wants to play again, change the scene back to main
		if ((gameState.scene == 'youwon' && event.key=='r') || (gameState.scene == 'youlose' && event.key=='r')) {
			gameState.scene = 'main';
			sound.play();
			gameState.score = 0;
			gameState.score2 = 0;
			gameState.health = 5;
			gameState.health2 = 5;
			controls.reset1 = true;
			controls.reset2 = true;
			begin = true;
			return;
		}
		//if the game is not in a winning state, determine moves based on key events
		switch (event.key){
			// change the way the avatar1 is moving
			case "s": controls.fwd = true;  break;
			case "w": controls.bwd = true; break;
			case "a": controls.left = true; break;
			case "d": controls.right = true; break;
			case "x": controls.speed = 30; break;
			case "e": controls.fly = true; break;
			case "f": controls.reset1 = true; break;
			case " ": gameState.scene='main'; start=false;break;
			case "m": play = !play; break;

			// change the way the avatar2 is moving
			case "k": controls.fwd2 = true;  break;
			case "i": controls.bwd2 = true; break;
			case "j": controls.left2 = true; break;
			case "l": controls.right2 = true; break;
			case "n": controls.speed2 = 30; break;
			case "u": controls.fly2=true; break;
			case "h": controls.reset2 = true; break;

			//reset both avatars
			case "r":  controls.reset1 = true; break;controls.reset2 = true; break;
		}
}

		function updateNPC(){
			npc.lookAt(avatar1.position);
			npc.__dirtyPosition = true;
			if(avatar1.position.x-npc.position.x<20 && npc.position.x-avatar1.position.x<20){
					console.log(avatar1.position.x-npc.position.x);
					npc.setLinearVelocity(npc.getWorldDirection().multiplyScalar(1));
			}
		}

		function updateNPC1(){
			npc1.lookAt(avatar2.position);
			npc1.__dirtyPosition = true;
			if(avatar2.position.x-npc1.position.x<20 && npc1.position.x-avatar2.position.x<20){
					console.log(avatar2.position.x-npc1.position.x);
					npc1.setLinearVelocity(npc1.getWorldDirection().multiplyScalar(1));
			}
		}

	function keyup(event){
		switch (event.key){
			case "s": controls.fwd   = false;  break;
			case "w": controls.bwd   = false; break;
			case "a": controls.left  = false; break;
			case "d": controls.right = false; break;
			case "x": controls.speed = 10; break;
			case "e": controls.fly=false; break;
			case "f": controls.reset1 = false; break;
			//controls for second hippo
			case "k": controls.fwd2 = false;  break;
			case "i": controls.bwd2 = false; break;
			case "j": controls.left2 = false; break;
			case "l": controls.right2 = false; break;
			case "n": controls.speed2 = 10; break;
			case "u": controls.fly2=false; break;
			case "h": controls.reset2 = false; break;
		}
	}
	// Done by: Jerry
	function updateText() {
		if(gameState.health!=health){
			if(gameState.health<health){
				health=health-1;
			}
			if(gameState.health>health){
				health=health+1
			}
			textMesh._dirtyPosition=true;
			textMesh.position.set(0,-100,0);

			console.log(textGeometry)
			var loader = new THREE.FontLoader();
			loader.load( 'fonts/helvetiker_regular.typeface.json',
			function ( font ) {
					textGeometry = new THREE.TextGeometry( "Avatar1 Health: "+gameState.health, {
					font: font,
					size: 3,
					height: 0.2,
					curveSegments: 12,
					bevelEnabled: true,
					bevelThickness: 0.01,
					bevelSize: 0.08,
					bevelSegments: 5
				} );
				var textMaterial = new THREE.MeshLambertMaterial( { color: 'black' } );
				textMesh = new THREE.Mesh( textGeometry, textMaterial );
				textMesh.position.set(-40,30,-20);
				textMesh.rotation.x=-.9;
				scene.add(textMesh)

		})
	}
		if(gameState.score!=score) {
			if(gameState.score>score) {
				score=score+1;
			}
			if(gameState.score<score) {
				score=score-1;
			}
			textMesh3._dirtyPosition=true;
			textMesh3.position.set(0,-100,0);
			var loader = new THREE.FontLoader();
		loader.load( 'fonts/helvetiker_regular.typeface.json',
		function ( font ) {
				textGeometry = new THREE.TextGeometry( "Avatar1 Score: "+gameState.score, {
				font: font,
				size: 3,
				height: 0.2,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 0.01,
				bevelSize: 0.08,
				bevelSegments: 5
			} );
			var textMaterial = new THREE.MeshLambertMaterial( { color: 'black' } );
			textMesh3 = new THREE.Mesh( textGeometry, textMaterial );
			textMesh3.position.set(-40,20,-20);
			textMesh3.rotation.x=-.9;
			scene.add(textMesh3);
		})

	}
}
  // Done by: Jerry
  function updateText2() {
    if(gameState.health2!=health2){
      if(gameState.health2<health2){
        health2=health2-1;
      }
      if(gameState.health2>health2){
        health2=health2+1
      }
      textMesh2._dirtyPosition=true;
      textMesh2.position.set(0,-100,0);
      console.log(textGeometry)
      var loader = new THREE.FontLoader();
      loader.load( 'fonts/helvetiker_regular.typeface.json',
      function ( font ) {
          textGeometry = new THREE.TextGeometry( "Avatar2 Health: "+gameState.health2, {
          font: font,
          size: 3,
          height: 0.2,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.01,
          bevelSize: 0.08,
          bevelSegments: 5
        } );
        var textMaterial = new THREE.MeshLambertMaterial( { color: 'black' } );
        textMesh2 = new THREE.Mesh( textGeometry, textMaterial );
        textMesh2.position.set(15,30,-20);
        textMesh2.rotation.x=-.9;
        scene.add(textMesh2)
    })
  }
  if(gameState.score2!=score2) {
    if(gameState.score2>score2) {
      score2=score2+1;
    }
    if(gameState.score2<score2) {
      score2=score2-1;
    }
    textMesh4._dirtyPosition=true;
    textMesh4.position.set(0,-100,0);
      var loader = new THREE.FontLoader();
      loader.load( 'fonts/helvetiker_regular.typeface.json',
     function ( font ) {
      textGeometry = new THREE.TextGeometry( "Avatar2 Score: "+gameState.score2, {
      font: font,
      size: 3,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.08,
      bevelSegments: 5
    } );
    var textMaterial = new THREE.MeshLambertMaterial( { color: 'black' } );
    textMesh4 = new THREE.Mesh( textGeometry, textMaterial );
    textMesh4.position.set(15,20,-20);
    textMesh4.rotation.x=-.9;
    scene.add(textMesh4);
  })

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
 			if (controls.reset1){
 	      			avatar1.__dirtyPosition = true;
 	      			avatar1.position.set(-60,2,-30);
				avatar1.__dirtyRotation = true;
				avatar1.rotation.set(0,0,0);
				avatar1.setAngularVelocity(new THREE.Vector3((0,0,0)));
				avatar1.setLinearVelocity(new THREE.Vector3((0,0,0)));
				console.log("controls reset");
				controls.reset1 = false;
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
 			 if (controls.fly2){
 			 	avatar2.setLinearVelocity(new THREE.Vector3(0,controls.speed,0));
 			 }
 			if (controls.left2){
 				avatar2.setAngularVelocity(new THREE.Vector3(0,controls.speed2*0.1,0));
 			} else if (controls.right2){
 				avatar2.setAngularVelocity(new THREE.Vector3(0,-controls.speed2*0.1,0));
 			}
 			if (controls.reset2){
 				avatar2.__dirtyPosition = true;
 				avatar2.position.set(60,2,-30);
				avatar2.__dirtyRotation = true;
				avatar2.rotation.set(0,0,0);
				avatar2.setAngularVelocity(new THREE.Vector3((0,0,0)));
				avatar2.setLinearVelocity(new THREE.Vector3((0,0,0)));
				controls.reset2 = false;
				console.log("controls reset");
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
			case "start":
				sCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
				sCamera.position.set(0,50,-120);
				sCamera.lookAt(0,0,0);
				renderer.render(startScene, sCamera);
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
				updateNPC1();
				updateSuzyOBJ();
				updateText();
				updateText2();

				if(!play) {
					sound.stop();
				}else if(!sound.isPlaying) {
					sound.play();
				}

	    	scene.simulate();
				if (gameState.camera!= 'none'){
					renderer.render( scene, camera );
				}
				break;

			default:
			  console.log("don't know the scene "+gameState.scene);
		}

	/* Display to the user instructions
	    Done by: Allison */
		if(begin && !start) {
	  	var info = document.getElementById("info");
			info.innerHTML='<div style="font-size:15pt;color:black;text-align:center">Eat colored balls for points and gold balls for health up. Avoid white balls and the red and blue blocks or your health will go down. <br>First hippo to 5 points wins, a hippo with negative health loses the game. Press m to mute and unmute the song.' + '</div>';
		}else if(!begin && !start) {
			var info = document.getElementById("info");
			info.innerHTML='<div style="font-size:15pt;color:black;text-align:center">Thanks for playing! Press r to play again. </div>';
		}
}
