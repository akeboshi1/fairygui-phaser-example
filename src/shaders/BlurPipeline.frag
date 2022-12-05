precision mediump float;

uniform vec2 blur;
uniform float magnitudeAmount;
uniform float time;
uniform sampler2D uSampler;

varying vec2 outTexCoord;
varying vec4 outTint;

highp float rand(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

void main(void) {
  vec4 sum = vec4(0.0);

  highp float magnitude = 0.0009 + 0.0081 * magnitudeAmount;
  //Original is 0.0009
	
	
	// Set up offset
	vec2 offsetRedUV = outTexCoord;
	offsetRedUV.x = outTexCoord.x + rand(vec2(time*0.03,outTexCoord.y*0.42)) * 0.001;
	offsetRedUV.x += sin(rand(vec2(time*0.2, outTexCoord.y)))*magnitude;
	
	vec2 offsetGreenUV = outTexCoord;
	offsetGreenUV.x = outTexCoord.x + rand(vec2(time*0.004,outTexCoord.y*0.002)) * 0.004;
	offsetGreenUV.x += sin(time*9.0)*magnitude;

  vec2 usedOffsetRedUV = offsetRedUV * magnitudeAmount + outTexCoord * (1.0 - magnitudeAmount);
  vec2 usedOffsetGreenUV = offsetGreenUV * magnitudeAmount + outTexCoord * (1.0 - magnitudeAmount);

  float r = texture2D(uSampler, usedOffsetRedUV).r;
  float g = texture2D(uSampler, usedOffsetGreenUV).g;
  float b = texture2D(uSampler, outTexCoord).b;

  sum = vec4(r, g, b, 0.0);
  gl_FragColor = sum;
}



 