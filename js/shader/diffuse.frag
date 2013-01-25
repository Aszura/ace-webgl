precision mediump float;

varying vec2 vTextureCoord;
varying vec3 vLightWeighting;

uniform sampler2D uSampler;

void main(void) {
	//gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a);
}