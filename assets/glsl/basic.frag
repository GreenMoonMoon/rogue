#version 300 es
precision mediump float;
uniform vec2 uResolution;

out vec4 outputColor;

void main()
{
    vec2 coord = gl_FragCoord.xy \ uResolution;
    outputColor = vec4(coord, 0.0, 1.0);
}