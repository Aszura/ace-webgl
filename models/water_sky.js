{

"metadata" :
{
	"formatVersion" : 3.2,
	"type"          : "scene",
	"sourceFile"    : "water_sky.blend",
	"generatedBy"   : "Blender 2.65 Exporter",
	"objects"       : 2,
	"geometries"    : 2,
	"materials"     : 3,
	"textures"      : 2
},

"urlBaseType" : "relativeToScene",


"objects" :
{
	"Sky" : {
		"geometry"  : "geo_Sky",
		"groups"    : [  ],
		"material"  : "skyMat_sky_107.bmp",
		"position"  : [ 0, 0, 0 ],
		"rotation"  : [ 1.97149e-07, 0, -0 ],
		"quaternion": [ 9.85746e-08, 0, 0, 1 ],
		"scale"     : [ 1, 1, 1 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Water" : {
		"geometry"  : "geo_Water",
		"groups"    : [  ],
		"material"  : "wasserMaterial_waterTexture.png",
		"position"  : [ 0, 0, 0 ],
		"rotation"  : [ 1.97149e-07, 0, -0 ],
		"quaternion": [ 9.85746e-08, 0, 0, 1 ],
		"scale"     : [ 1, 1, 1 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	}
},


"geometries" :
{
	"geo_Sky" : {
		"type" : "ascii",
		"url"  : "water_sky.Sky.js"
	},

	"geo_Water" : {
		"type" : "ascii",
		"url"  : "water_sky.Water.js"
	}
},


"textures" :
{
	"waterTexture.png" : {
		"url": "waterTexture.png",
        "wrap": ["repeat", "repeat"]
	},

	"sky.png" : {
		"url": "sky.png",
        "wrap": ["repeat", "repeat"]
	}
},


"materials" :
{
	"Material" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 10724259, "opacity": 1, "blending": "NormalBlending" }
	},

	"skyMat_sky_107.bmp" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 8553090, "opacity": 1, "map": "sky.png", "transparent": true, "blending": "NormalBlending" }
	},

	"wasserMaterial_waterTexture.png" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 8553090, "opacity": 1, "map": "waterTexture.png", "transparent": true, "blending": "NormalBlending" }
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
