function Level(context){
	var gl = context;
	var meshLoader = new MeshLoader(gl);
	var cubesLG;
	var gameObjects = [];
	var movingCube;
	var movingCubeDirection = vec3.fromValues(-0.1,0.0,0.0);
	
	this.load = function(callback){
		// meshLoader.LoadMesh("spinne", "models/spinne.js", 1, function(){
			// meshLoader.LoadScene("models/wohnung2.js", function(){
				// meshLoader.BindToBuffers();
				// callback();
			// });
		// });
		cubesLG = new LodGroup(meshLoader);
		var goNames = [];
		meshLoader.LoadScene("models/shootermesh/shootermesh.js", goNames, function(){
			progressbar.SetProgress(40);
			meshLoader.LoadScene("models/water_sky.js", goNames, function(){
				progressbar.SetProgress(60);
				//Add objects from scenes as game objects to list
				for(var i = 0; i < goNames.length; i++){
					var go = new GameObject(meshLoader);
					go.SetMesh(goNames[i]);
					gameObjects.push(go);
				}
				meshLoader.meshes["Sky"].lit = false;
				meshLoader.meshes["Water"].lit = false;
				meshLoader.LoadMesh("alphaCube", "models/alphaCube.js", vec3.fromValues(0.0,4.0,3.0), quat.create(), vec3.fromValues(1.0,1.0,1.0), function(){
					var go = new GameObject(meshLoader);
					go.SetMesh("alphaCube");
					gameObjects.push(go);
					var go2 = new GameObject(meshLoader);
					go2.SetMesh("alphaCube");
					gameObjects.push(go2);
					go2.Translate(vec3.fromValues(3.0,0.0,0.0));
					movingCube = new GameObject(meshLoader);
					movingCube.SetMesh("alphaCube");
					gameObjects.push(movingCube);
					movingCube.Translate(vec3.fromValues(0.0,0.0,3.0));
					var lodCubes = ["LODCube1", "LODCube2", "LODCube3", "LODCube4", "LODCube5"];
					var i = 0;
					progressbar.SetProgress(100);
					//recursive function when finished loading lod mesh
					lodfunc = function(meshName){
						cubesLG.AddLodMesh(meshName, i*10+10);
						i++;
						if(i >= lodCubes.length){
							progressbar.HideAndShowElement(document.getElementById('renderCanvas'));
							gameObjects.push(cubesLG);
							meshLoader.BindToBuffers();
							callback();
						}else{
							meshLoader.LoadMesh(lodCubes[i], "models/" + lodCubes[i] + ".js", vec3.fromValues(0.0,4.0,0.0), quat.create(), vec3.fromValues(1.0,1.0,1.0), lodfunc);
						}
					};
					meshLoader.LoadMesh(lodCubes[i], "models/" + lodCubes[i] + ".js", vec3.fromValues(0.0,4.0,0.0), quat.create(), vec3.fromValues(1.0,1.0,1.0), lodfunc);
				});
			});
		});
		progressbar.SetProgress(20);
	};
	
	//var transVec = vec3.fromValues(0.0, 0.02, 0.0);
	
	this.update = function(elapsed){
		if(movingCube.position[0] > 2.0){
			movingCubeDirection[0] = -0.1;
		}else if(movingCube.position[0] < -4.0){
			movingCubeDirection[0] = 0.1;
		}
		movingCube.Translate(movingCubeDirection);
		// for(key in meshLoader.meshes){
			// meshLoader.meshes[key].Translate(transVec);
		// }
	};
	
	this.draw = function(shaderProgram, camera){
		meshLoader.Bind();
		//Sort for transparent objects
		gameObjects.sort(function(a,b){
			var distanceA = vec3.distance(camera.position, a.position);
			var distanceB = vec3.distance(camera.position, b.position);
			
			if(a.transparent && a.alpha < 1.0 && b.transparent && b.alpha < 1.0){
				if(distanceA < distanceB){
					return 1;
				}else if(distanceA > distanceB){
					return -1;
				}else{
					return 0;
				}
			}else{
				if(a.transparent && a.alpha < 1.0){
					return 1;
				}else if(b.transparent && b.alpha < 1.0){
					return -1;
				}else{
					return 0;
				}
			}
		});
		for(var i = 0; i < gameObjects.length; i++){
			gameObjects[i].Draw(shaderProgram, camera);
		}
	};
}