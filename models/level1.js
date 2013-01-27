{

"metadata" :
{
	"formatVersion" : 3.2,
	"type"          : "scene",
	"sourceFile"    : "level1.blend",
	"generatedBy"   : "Blender 2.65 Exporter",
	"objects"       : 2,
	"geometries"    : 2,
	"materials"     : 2,
	"textures"      : 2
},

"urlBaseType" : "relativeToScene",


"objects" :
{
	"Plane" : {
		"geometry"  : "geo_Plane",
		"groups"    : [  ],
		"material"  : "GrassMaterial",
		"position"  : [ 0, -1, -3.42285e-08 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ -16.432, -16.432, -16.432 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Cube" : {
		"geometry"  : "geo_Cube.001",
		"groups"    : [  ],
		"material"  : "Material",
		"position"  : [ 0, 0, 0 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 1, 1, 1 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	}
},


"geometries" :
{
	"geo_Plane" : {
		"type" : "ascii",
		"url"  : "level1.Plane.js"
	},

	"geo_Cube.001" : {
		"type" : "ascii",
		"url"  : "level1.Cube.001.js"
	}
},


"textures" :
{
	"Grass.jpg" : {
		"url": "Grass.jpg",
        "wrap": ["repeat", "repeat"]
	},

	"crate1.png" : {
		"url": "crate1.png",
        "wrap": ["repeat", "repeat"]
	}
},


"materials" :
{
	"GrassMaterial" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 10724259, "opacity": 1, "map": "Grass.jpg", "blending": "NormalBlending" }
	},

	"Material" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 10724259, "opacity": 1, "map": "crate1.png", "blending": "NormalBlending" }
	}
},


"transform" :
{
	"position"  : [ 0, 0, 0 ],
	"rotation"  : [ -1.5708, 0, 0 ],
	"scale"     : [ 1, 1, 1 ]
},

"defaults" :
{
	"bgcolor" : [ 0, 0, 0 ],
	"bgalpha" : 1.000000,
	"camera"  : ""
}

}
