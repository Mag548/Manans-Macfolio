/* eslint-disable react/no-unknown-property */
import { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  useGLTF,
  useProgress,
  Html,
  Environment,
  ContactShadows,
} from '@react-three/drei';
import * as THREE from 'three';

const Loader = ({ placeholderSrc }) => {
  const { progress, active } = useProgress();
  if (!active && placeholderSrc) return null;
  return (
    <Html center>
      {placeholderSrc ? (
        <img
          src={placeholderSrc}
          width={128}
          height={128}
          className="blur-lg rounded-lg"
          alt=""
        />
      ) : (
        <span className="text-white text-sm">{Math.round(progress)}%</span>
      )}
    </Html>
  );
};

const FittedModel = ({ url, onLoaded }) => {
  const { scene } = useGLTF(url);
  const root = useRef(null);
  const fitted = useRef(false);
  const { camera, invalidate } = useThree();

  const model = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    const g = root.current;
    if (!g || fitted.current) return;

    g.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(g);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    const scale = 1.6 / maxDim;

    g.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    g.scale.setScalar(scale);

    g.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    if (camera.isPerspectiveCamera) {
      const fit = 1.35;
      const dist = fit / Math.sin((camera.fov * Math.PI) / 360);
      camera.position.set(dist * 0.7, dist * 0.4, dist);
      camera.near = Math.max(dist / 100, 0.01);
      camera.far = dist * 100;
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }

    fitted.current = true;
    invalidate();
    onLoaded?.();
  }, [model, camera, invalidate, onLoaded]);

  return (
    <group ref={root}>
      <primitive object={model} />
    </group>
  );
};

const ModelViewer = ({
  url,
  placeholderSrc,
  ambientIntensity = 0.45,
  keyLightIntensity = 1.2,
  fillLightIntensity = 0.55,
  rimLightIntensity = 0.7,
  environmentPreset = 'studio',
  onModelLoaded,
}) => {
  useGLTF.preload(url);

  return (
    <div className="model-viewer-root relative h-full w-full min-h-0">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ fov: 45, near: 0.01, far: 100, position: [2, 1.2, 2.5] }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.setClearColor('#1a1a1c');
        }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        {environmentPreset !== 'none' && (
          <Environment preset={environmentPreset} background={false} />
        )}

        <ambientLight intensity={ambientIntensity} />
        <directionalLight position={[5, 6, 4]} intensity={keyLightIntensity} castShadow />
        <directionalLight position={[-4, 2, 3]} intensity={fillLightIntensity} />
        <directionalLight position={[0, 3, -5]} intensity={rimLightIntensity} />

        <ContactShadows position={[0, -0.85, 0]} opacity={0.4} scale={8} blur={2.5} />

        <Suspense fallback={<Loader placeholderSrc={placeholderSrc} />}>
          <FittedModel url={url} onLoaded={onModelLoaded} />
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={0.6}
          maxDistance={8}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
