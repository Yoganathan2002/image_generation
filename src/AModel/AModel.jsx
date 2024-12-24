import { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import SceneInit from '../lib/Sceneinit.js';

function Model() {
  useEffect(() => {
    const sceneInit = new SceneInit('myThreeJsCanvas');
    sceneInit.initialize();

    let mixer; // Animation mixer
    let loadedModel;
    const gltfLoader = new GLTFLoader();

    // Load your GLTF model
    gltfLoader.load('src/assets/s2.glb', (gltfScene) => {
      loadedModel = gltfScene;
      gltfScene.scene.position.x = 1;
      gltfScene.scene.position.y = -7;
      gltfScene.scene.scale.set(12, 12, 12);
      sceneInit.scene.add(gltfScene.scene);

      // Initialize AnimationMixer with the loaded model
      mixer = new THREE.AnimationMixer(gltfScene.scene);

      // Store all animation actions
      const actions = gltfScene.animations.map((clip) => mixer.clipAction(clip));

      // Start playing the first two animations simultaneously
      if (actions.length >= 2) {
        actions[0].play();
        actions[1].play();
      }

      // Optionally set blending settings if needed
      actions.forEach(action => {
        action.clampWhenFinished = true; // Optional: clamp animations
      });
    }, undefined, (error) => {
      console.error('An error occurred while loading the model:', error);
    });

    const clock = new THREE.Clock(); // Clock for timing the animation

    const animate = () => {
      if (mixer) {
        mixer.update(clock.getDelta()); // Update animation mixer with time delta
      }

      window.requestAnimationFrame(animate);
      sceneInit.render(); // Render the scene
      sceneInit.stats.update();
      sceneInit.controls.update();
    };

    animate();

    // Clean up on component unmount
    return () => {
      if (loadedModel) {
        sceneInit.scene.remove(loadedModel.scene);
      }
      window.removeEventListener('resize', sceneInit.onWindowResize);
    };
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default Model;
