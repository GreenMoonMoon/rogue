#version 300 es
precision mediump float;
in vec4 aVertexPosition;

// uniform mat4 uModelViewMatrix;
// uniform mat4 uProjectionMatrix;

void main()
{
    gl_Position = aVertexPosition;
}