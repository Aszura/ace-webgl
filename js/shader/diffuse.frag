precision mediump float;

uniform sampler2D uSampler;

varying vec2 vTextureCoord;
varying vec4 vFrontColor;

void main(void) { 
	gl_FragColor   = vec4(vFrontColor.rgb * texture2D(uSampler, vTextureCoord).rgb, 1.0);
}