const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec3 u_color;
uniform float u_speed;
uniform float u_arms;
uniform float u_bloom;
uniform float u_noise;
uniform float u_distortion;
uniform float u_depth;
uniform mat4 u_viewMatrix;

#define PI 3.14159265359
#define MAX_STEPS 100
#define MAX_DIST 100.0
#define SURF_DIST 0.01

float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float fbm(vec2 p) {
    float sum = 0.0;
    float amp = 1.0;
    float freq = 1.0;
    for(int i = 0; i < 4; i++) {
        sum += amp * noise(p * freq);
        freq *= 2.1;
        amp *= 0.5;
    }
    return sum * 2.0 - 1.0;
}

// ...rest of the shader functions...

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    
    vec3 ro = vec3(0.0, 0.0, 3.0);
    vec3 rd = normalize(vec3(uv.x, uv.y, -1.0));
    
    mat4 viewMatrix = inverse(u_viewMatrix);
    ro = (viewMatrix * vec4(ro, 1.0)).xyz;
    rd = (viewMatrix * vec4(rd, 0.0)).xyz;
    
    float d = raymarch(ro, rd);
    vec3 p = ro + rd * d;
    vec3 n = getNormal(p);
    
    vec3 color = u_color * 0.15;
    
    if(d < MAX_DIST) {
        vec3 baseColor = u_color;
        vec3 lightPos = vec3(2.0, 2.0, 4.0);
        vec3 l = normalize(lightPos - p);
        
        float diff = max(dot(n, l), 0.0);
        vec3 h = normalize(l - rd);
        float spec = pow(max(dot(n, h), 0.0), 16.0);
        float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), 2.0);
        
        float density = 1.0 - smoothstep(0.0, 1.0, length(p));
        float glow = exp(-2.0 * abs(map(p)));
        
        color += baseColor * (diff * 0.7 + 0.3);
        color += vec3(1.0) * spec * 0.5;
        color += baseColor * fresnel * 0.8;
        color += baseColor * glow * density * (u_bloom * 3.0);
        
        float bloomIntensity = u_bloom * 2.0;
        vec3 bloomColor = baseColor * glow * bloomIntensity;
        color += bloomColor;
        
        float noiseEffect = noise3D(p + vec3(u_time * 0.2)) * u_noise;
        color += baseColor * noiseEffect * 0.5;
        
        color *= exp(-d * 0.1);
    }
    
    gl_FragColor = vec4(color, 1.0);
}`;

export { vertexShader, fragmentShader };
