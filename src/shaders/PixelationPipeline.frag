precision mediump float;

uniform float pixelDensity;
uniform vec2 aspectRatioMultiplier;
uniform sampler2D uSampler;

varying vec2 outTexCoord;


void main(void) {
  vec2 pixelScaling = vec2(pixelDensity * aspectRatioMultiplier.x, pixelDensity * aspectRatioMultiplier.y);
  vec2 pixel_uv = vec2(floor(outTexCoord.x * pixelScaling.x), floor(outTexCoord.y * pixelScaling.y));
  pixel_uv = vec2(pixel_uv.x / pixelScaling.x, pixel_uv.y / pixelScaling.y);
  //pixel_uv = vec2(1.0 * outTexCoord.x, outTexCoord.y);
  vec4 color = texture2D(uSampler, pixel_uv);
  gl_FragColor = color;
}
 