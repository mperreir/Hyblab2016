#ifdef GL_ES
  precision mediump float;
#endif

#define halfPi 1.57079632679

attribute vec4 aPosition;
attribute vec3 aNormal;
attribute vec3 aColor;
attribute vec4 aFilter;
attribute vec3 aID;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjMatrix;
uniform mat4 uMatrix;
uniform mat4 uSunMatrix;

uniform mat3 uNormalTransform;

uniform vec3 uHighlightColor;
uniform vec3 uHighlightID;
uniform vec2 uViewDirOnMap;
uniform vec2 uLowerEdgePoint;

uniform float uTime;

varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vSunRelPosition;
varying float verticalDistanceToLowerEdge;

float gradientHeight = 90.0;
float gradientStrength = 0.4;

uniform float uBendRadius;
uniform float uBendDistance;

void main() {

  float t = clamp((uTime-aFilter.r) / (aFilter.g-aFilter.r), 0.0, 1.0);
  float f = aFilter.b + (aFilter.a-aFilter.b) * t;

  if (f == 0.0) {
    gl_Position = vec4(0.0, 0.0, 0.0, 0.0);
    vColor = vec3(0.0, 0.0, 0.0);
  } else {

    vec4 pos = vec4(aPosition.x, aPosition.y, aPosition.z*f, aPosition.w);

    //*** bending ***************************************************************

  //  vec4 mwPosition = uViewMatrix * uModelMatrix * aPosition;
  //
  //  float innerRadius = uBendRadius + mwPosition.y;
  //  float depth = abs(mwPosition.z);
  //  float s = depth-uBendDistance;
  //  float theta = min(max(s, 0.0)/uBendRadius, halfPi);
  //
  //  // halfPi*uBendRadius, not halfPi*innerRadius, because the "base" of a building
  //  // travels the full uBendRadius path
  //  float newY = cos(theta)*innerRadius - uBendRadius - max(s-halfPi*uBendRadius, 0.0);
  //  float newZ = normalize(mwPosition.z) * (min(depth, uBendDistance) + sin(theta)*innerRadius);
  //
  //  vec4 newPosition = vec4(mwPosition.x, newY, newZ, 1.0);
  //  gl_Position = uProjMatrix * newPosition;

    gl_Position = uMatrix * pos;

    //*** highlight object ******************************************************

    vec3 color = aColor;
    if (uHighlightID.r == aID.r && uHighlightID.g == aID.g && uHighlightID.b == aID.b) {
      color = mix(aColor, uHighlightColor, 0.5);
    }

    //*** light intensity, defined by light direction on surface ****************

    vNormal = aNormal;
    //vec3 transformedNormal = aNormal * uNormalTransform;
    //float lightIntensity = max( dot(aNormal, uLightDirection), 0.0) / 1.5;
    //color = color + uLightColor * lightIntensity;

    //*** vertical shading ******************************************************

    float verticalShading = clamp((gradientHeight-pos.z) / (gradientHeight/gradientStrength), 0.0, gradientStrength);

    //***************************************************************************

    vColor = color-verticalShading;
    vec4 worldPos = uModelMatrix * pos;
    vec2 dirFromLowerEdge = worldPos.xy / worldPos.w - uLowerEdgePoint;
    verticalDistanceToLowerEdge = dot(dirFromLowerEdge, uViewDirOnMap);
    
    // *** shadow mapping ********
    vec4 sunRelPosition = uSunMatrix * pos;
    vSunRelPosition = (sunRelPosition.xyz / sunRelPosition.w + 1.0) / 2.0;
  }
}
