#define PI 3.141592653589793
#define TAU 6.283185307

uniform sampler2D image;
uniform vec2 imageSize;
uniform vec2 resolution;
uniform float radius;
uniform float slices;
uniform float maxSize;
uniform float seperation;

vec2 polarToCartesian( float angle, float r ) {
    return vec2(
        r * cos( angle ),
        r * sin( angle )
    );
}

vec3 drawCircle( vec2 center ) {

    vec2 positionFromCenter = gl_FragCoord.xy - center;
    float distancePercent = length( positionFromCenter ) / radius;

    distancePercent = min( distancePercent, 1.0 );

    float piece = 1.0 / slices;

    vec2 positionDirection = normalize( positionFromCenter );

    float angle = atan( positionDirection.y, positionDirection.x );
    float anglePercent = ( 1.0 + ( angle / PI ) ) / 2.0;

    float leftover = mod( anglePercent, piece );
    float sectionPercent = leftover / piece;

    float index = floor( anglePercent / piece );

    if ( mod( index, 2.0 ) == 0.0 ) {
        sectionPercent = 1.0 - sectionPercent;
        leftover = piece - leftover;
    }

    vec2 uv = polarToCartesian( leftover * TAU, distancePercent * radius );

    uv /= vec2( radius, maxSize );

    vec2 triangleBox = vec2( radius, maxSize );
    vec2 imageBox = imageSize;

    vec2 scaleVector = triangleBox / imageBox;
    float scale = max( scaleVector.x, scaleVector.y );

    vec2 scaleBox = imageSize * scale;
    vec2 startingPoints = scaleBox / 2.0 - triangleBox / 2.0;

    vec2 coord = startingPoints + uv * triangleBox;

    uv = coord / scaleBox;

    return texture2D( image, uv ).rgb;
}


void main() {

    vec2 center = resolution / 2.0;

    gl_FragColor = vec4( drawCircle( center ), 1.0 );
}
