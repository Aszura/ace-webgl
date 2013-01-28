precision mediump float;

uniform sampler2D uSampler;
uniform float uAlpha;

varying vec2 vTextureCoord;
varying vec4 vFrontColor;

void main(void) { 
	vec4 textureColor = texture2D(uSampler, vTextureCoord);
	float alpha = textureColor.a * uAlpha;
	if(alpha < 0.1){
		discard;
	}
	gl_FragColor   = vec4(vFrontColor.rgb * textureColor.rgb, alpha);
}