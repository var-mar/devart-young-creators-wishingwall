//---------------------------------------------------------
/*
butterfly class extend from installation
*/
function butterfly(){

	var self = this;

	this.svgId = 4;
	this.flyMode = 3;
	this.moveWings = true;
	this.phase = 0.1;
	this.alpha = 0.1;
	this.scale = 1.0;
	this.speed = 0.01;
	this.hexColor = '#ff0000';
	this.centerX = -60; // fix const to center

	this.light_ambient = 0x7b7b7b; 
	this.light_color =  0x474444; 
	this.light_specular = 0x444444;//
	this.light_emissive = 0x4c4c4c;
	this.light_shininess = 0.2;//4

	this.body = new THREE.Object3D();

	this.bodyGeos = [];

	this.bodyMaterial = new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture("obj/map_body.jpg"), color: 0x383636});//,
	this.headMaterial = new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture("obj/map_head.jpg"), color: 0x474444});//,

	this.legMaterial = new THREE.LineBasicMaterial({
	        color: 0x000000,
	    });
	this.legs = [];

	this.body_top = function(){
		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total ) {
			console.log( item, loaded, total );
		};
		var self = this;
		// set up the sphere vars
		var loader = new THREE.OBJLoader( manager );
		loader.load( 'obj/butterflyHeadAntennas_new2.obj', function ( object ) {//'obj/butterflyUpPart.obj'
			object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
					child.material = self.headMaterial;
					self.bodyGeos.push(child.geometry);
				}
			} );
			self.body_topObj = object;
			self.group1.add(self.body);
			object.scale.multiplyScalar(0.05);
			
			self.body.add( object );
			self.body.rotation.x = Math.PI/2;
			self.body.position.x = -2.15;
			self.body.position.y = -0.2;
			self.body.position.z = -3;
		} );
	};

	this.body_lower = function(){
		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total ) {
			console.log( item, loaded, total );
		};
		var self = this;
		// set up the sphere vars
		var loader = new THREE.OBJLoader( manager );
		loader.load( 'obj/butterflyBodyLeg_new2.obj', function ( object ) {
			object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
					child.material = self.bodyMaterial;
					self.bodyGeos.push(child.geometry);
				}
			} );
			self.body_lowerObj = new THREE.Object3D();
			self.body_lowerObj.position.set(0, 5, 0);
			object.position.set(0, -5, 0);
			self.body_lowerObj.add( object );

			object.scale.multiplyScalar(0.05);

			self.body.add( self.body_lowerObj );

			//this.butterflyMesh.castShadow = true;
			//this.butterflyMesh.receiveShadow = false;
		} );
	};

	this.makeLegs = function(){
		var totalLegs = 4;

		for(var i=0; i<totalLegs; i++){ 
		    var numPoints = 25;
		    var spline = new THREE.SplineCurve3([
			    new THREE.Vector3(0, 0, 0),
			    new THREE.Vector3(18, -10, 0),
			    new THREE.Vector3(12, -28, 0),
			    new THREE.Vector3(25, -40, 0)
		    ]);

		    var geometry = new THREE.Geometry();
		    var splinePoints = spline.getPoints(numPoints);

		    for (var j = 0; j < splinePoints.length; j++) {
		        geometry.vertices.push(splinePoints[j]);
		    }

		    var legLine = new THREE.Line(geometry, this.legMaterial);
		    legLine.position.x = 40+20*Math.floor(i/2);
		    legLine.position.y = 110-10*(i%2);
		    legLine.position.z = 0;
		    legLine.rotation.y = -Math.PI/2;
		    legLine.rotation.x = -0.5 + (i%2)*0.3;
		    this.legs.push(legLine);
		    this.body_topObj.add(legLine);
		}

		// antennae
		for(var i=0; i<2; i++){ 
			var lr = i%2;
			var sign = lr ? -1 : 1;
		    var numPoints = 25;
		    var spline = new THREE.SplineCurve3([
			    new THREE.Vector3(0, 10, 0),
			    new THREE.Vector3(0, 40, sign*10),
			    new THREE.Vector3(0, 70, sign*25),
			    new THREE.Vector3(0, 100, sign*40)
		    ]);

		    var geometry = new THREE.Geometry();
		    var splinePoints = spline.getPoints(numPoints);

		    for (var j = 0; j < splinePoints.length; j++) {
		        geometry.vertices.push(splinePoints[j]);
		    }

		    var legLine = new THREE.Line(geometry, this.legMaterial);
		    legLine.position.x = 40+20*lr;
		    legLine.position.y = 110;
		    legLine.position.z = 0;
		    legLine.rotation.y = -Math.PI/2;
		    legLine.rotation.x = -0.2;
		    this.legs.push(legLine);
		    this.body_topObj.add(legLine);
		}
	};

	this.wings = function(){
		this.geometry = new ButterflyGeometry();

		this.butterflyTexture = new THREE.Texture();
		this.body_top();
		this.body_lower();
		this.simpleMaterialPhongWings = new THREE.MeshPhongMaterial( { 
			map: this.butterflyTexture, 
			side: THREE.DoubleSide, 
			transparent: true,
			opacity:1,
			alphaTest:1/254,
			// depthWrite: false,
			color: this.light_color, 
			specular: this.light_specular, 
			shininess: this.light_shininess
		});
		this.butterflyMesh = new ButterflyMesh( this.geometry, this.simpleMaterialPhongWings );
		this.butterflyMesh.castShadow = true;
		this.butterflyMesh.receiveShadow = false;
		this.butterflyMesh.position.z = -1.5;
		this.butterflyMesh.position.y = -0.5;
		this.butterflyMesh.position.x = -0.15;
		//
		this.group1.add( this.butterflyMesh );
	};

	this.create = function(){
		this.group1 = new THREE.Object3D();
		this.group1.rotationAutoUpdate = true;
		this.group1.position.x = this.centerX;

		scene.add(this.group1);
		self.wings();
		
		self.changeColorSVGSelected(this.hexColor);

		// butterfly parts		
		// add this butterfly to update
		butterflies[butterflies.length] = this;
	};

	this.update = function(){
		if(this.moveWings){
			this.phase = ( this.phase + this.speed  );
			this.alpha += this.speed;
			// modes fly
			if(this.flyMode==1){
				var maxPhase = Math.radians(60);
				this.phase = maxPhase*Math.sin(this.alpha)-Math.radians(15);
			}
			if(this.flyMode==2){
				var maxPhase = Math.radians(30);
				this.phase = maxPhase*Math.sin(this.alpha);
			}
			if(this.flyMode==3){
				var maxPhase = Math.radians(60);
				this.phase = Math.radians(15)+maxPhase*Math.sin(this.alpha);
			}
			this.moveWings(this.phase);
			
		}	
	};

	this.moveWings = function(phase) {
		this.butterflyMesh.geometry.rotateWings(phase);
		this.butterflyMesh.geometry.verticesNeedUpdate = true;
		if (this.body_lowerObj) {
			this.body_lowerObj.rotation.x = -0.2*phase;
			this.butterflyMesh.rotation.x = -0.1+0.2*phase;
		}
	};

	/* public method use by tutorial */
	this.setShapeModel = function(value){
		if(value>=0 && value<5){
			var old_svgId = this.svgId;
			this.svgId = value;
			if(old_svgId!=value){
				this.changeColorSVGSelected(this.hexColor);
			}
		}
	};

	this.setScale = function(value){
		this.group1.scale.x = value;
		this.group1.scale.y = value;
		this.group1.scale.z = value;
	}

	/* public method use by tutorial */
	this.setRotation = function(x,y,z){
		this.group1.rotation.x = x;
		this.group1.rotation.y = y;
		this.group1.rotation.z = z;
	};

	/* public method use by tutorial */
	this.setSpeed = function(value){
		this.speed = value;
	};
	/* public method use by tutorial */
	this.setPosition = function(x,y,z){
		// setup limits
		if(x<-58){
			x = -58;
			messageOutScreen = true;
		} 

		if(x>45){
			if(x>170){
				x = 170;
			}
			messageOutScreen = true;
		} 

		if(y<-45){
			y = -45;
			messageOutScreen = true;
		} 

		if(y>200){
			y = 200;
			messageOutScreen = true;
		}
		
		if(z>55){
			z = 55;
			messageOutScreen = true;
		}
		if(z<-55){
			z = -55;
			messageOutScreen = true;
		}
		this.group1.position.x = x+this.centerX;
		this.group1.position.y = y;
		this.group1.position.z = z;

	};
	/* public method use by tutorial */
	this.setFlyMode = function(value){
		if(value>0 && value<4){
			this.flyMode = value; 
		}
	};
	/* public method use by tutorial */
	this.setHexColor = function(hexColor){
		this.hexColor = hexColor;
		this.changeColorSVGSelected(hexColor);
	};

	this.changeColorSVGSelected = function(hexColor){
		console.log("svg lenght:",butterFlySVGAr.length);
		this.svgTags = butterFlySVGAr[this.svgId].replace('stop-color:#FF0000','stop-color:'+hexColor);

		this.renderSVGCanvas(this.svgId,function(texture){
			console.log("Create mesh in changeColour");
			console.log(self.butterflyTexture);
			self.butterflyTexture = texture;
			self.simpleMaterialPhongWings.map = self.butterflyTexture;
			// shadow texture
			var vertexShader = document.getElementById( 'vertexShaderDepth' ).textContent;
			var fragmentShader = document.getElementById( 'fragmentShaderDepth' ).textContent;
			var uniforms = { texture:  { type: "t", value: self.butterflyTexture } };
			self.butterflyMesh.customDepthMaterial = new THREE.ShaderMaterial( 
						{ uniforms: uniforms, vertexShader: vertexShader, fragmentShader: fragmentShader } 
			);
		});
	};

	this.renderSVGCanvas = function (svgId, callback){
		var canvas = document.createElement('canvas');
		canvas.id = "canvas_"+counter;
		console.log("canvas_"+counter);
		var current_counter = counter;
		counter+=1;
		canvas.width = 200;
		canvas.height = 400;
		var body = document.getElementsByTagName("body")[0];
		body.appendChild(canvas);

		var ctx = canvas.getContext("2d");
		var data = "data:image/svg+xml," +self.svgTags;
		var img = new Image();
		img.src = data;
		img.onload = function() { 
			ctx.drawImage(img, 0, 0); 
			var butterflyTexture = new THREE.Texture(canvas); 
			butterflyTexture.needsUpdate = true;	
			butterflyTexture.minFilter = THREE.LinearFilter;
			callback(butterflyTexture);
			document.getElementById("canvas_"+current_counter).remove();
		}
	};

	this.create();
}
//---------------------------------------------------------
