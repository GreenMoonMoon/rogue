precision mediump float;

uniform vec2 u_resolution;
uniform sampler2D u_tileset;

void main(){
    // vec2 texCoord = vec2(fract(gl_FragCoord.xy / 16.0) + vec2(17.0));
    // vec4 color = texture2D(u_tileset, texCoord);
    vec4 color = texture2D(u_tileset, gl_FragCoord.xy/u_resolution);

    // gl_FragColor = vec4((gl_FragCoord.xy / u_resolution), 0.0, 1.0);
    gl_FragColor = color;
}