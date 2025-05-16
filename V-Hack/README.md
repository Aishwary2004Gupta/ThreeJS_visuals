# Solar Vortex Shader

An interactive WebGL visualization that creates a dynamic, spiraling vortex effect using Three.js and custom GLSL shaders. The visualization combines procedural animation with user-controlled parameters to create an engaging visual experience.

## Features

- Real-time interactive 3D shader visualization
- Orbital camera controls for 3D perspective manipulation
- Dynamic mouse-tracking background effects
- Responsive design that adapts to window size

### Interactive Controls

- **Speed**: Adjust the animation speed (0-5)
- **Arms**: Modify the number of spiral arms (5-14)
- **Color**: Change the primary color of the vortex
- **Bloom**: Control the glow intensity (0-1.5)
- **Noise**: Adjust the noise texture amount (0-1)
- **Distortion**: Control the shape distortion (0-0.5)
- **Tilt**: Modify the perspective tilt response (0-0.5)

## Technical Details

- Built with Three.js r128
- Uses custom GLSL fragment and vertex shaders
- Implements ray marching for 3D effect generation
- Features procedural noise and FBM (Fractional Brownian Motion)
- Combines orbital controls with mouse-based interaction

## Dependencies

- Three.js (r128)
- OrbitControls.js

## Usage

1. Open `index.html` in a WebGL-capable browser
2. Use the mouse to rotate the view
3. Click the "Controls ⚙️" button to access parameter adjustments
4. Experiment with different settings to create unique effects

## Performance Notes

The shader uses ray marching with up to 100 steps per pixel. For optimal performance:
- Use a modern GPU
- Adjust bloom and noise parameters carefully on lower-end devices