#version 300 es
precision mediump float;

uniform vec2 uResolution;
uniform sampler2D uTilesheet;

out vec4 outputColor;

#define RATIO (1./543.)
#define TILESHEET_RATIO 0.03125

float random(vec2 st){
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

int randomInt(vec2 st){
    return int(fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123)*1024.0);
}

void main()
{
    vec2 uv=gl_FragCoord.xy/uResolution;
    uv.x*=uResolution.x/uResolution.y;
    vec2 tile=floor(uv*8.);
    uv=fract(uv*8.);
    
    int randomTile=randomInt(tile);
    int tileXIndex=randomTile/32;
    int tileYIndex=randomTile-tileXIndex*32;
    
    vec2 tex_uv = vec2(uv.x, 1.-uv.y);
    vec4 color = texture(uTilesheet, tex_uv*TILESHEET_RATIO + vec2(tileXIndex, tileYIndex)*TILESHEET_RATIO);
    outputColor=color;
}