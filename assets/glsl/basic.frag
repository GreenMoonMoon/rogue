#version 300 es
precision mediump float;
uniform vec2 uResolution;

out vec4 outputColor;

void main()
{
    vec2 uv = gl_FragCoord.xy / uResolution;
    uv.x *= uResolution.x / uResolution.y;
    uv = fract(uv * 16.0);
    outputColor = vec4(uv, 0.0, 1.0);
}