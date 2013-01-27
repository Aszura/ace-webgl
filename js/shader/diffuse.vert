attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform vec3 uLightingDirection;
uniform vec3 uDirectionalColor;
uniform vec3 uAmbientColor;
uniform vec3 uSpecularColor;
uniform bool uLightsOn;

varying vec2 vTextureCoord;
varying vec4 vFrontColor;

void main(void) {
	gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aVertexPosition, 1.0);
	vTextureCoord = aTextureCoord;
	
	if(uLightsOn){
		vec3 normal, lightDir;
		vec4 diffuse, ambient, globalAmbient;
		float NdotL;

		normal = normalize(aVertexNormal);
		lightDir = normalize(vec3(uLightingDirection));
		NdotL = max(dot(normal, lightDir), 0.0);
		diffuse = vec4(uDirectionalColor,1.0);
		/* Compute the ambient and globalAmbient terms */

		ambient = vec4(uAmbientColor,1.0);
		vFrontColor =  NdotL * diffuse + ambient;
	}else{
		vFrontColor = vec4(1.0,1.0,1.0,1.0);
	}
}