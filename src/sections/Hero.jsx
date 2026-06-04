import { Leva } from 'leva';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useMediaQuery } from 'react-responsive';
import { PerspectiveCamera } from '@react-three/drei';

import Cube from '../components/Cube.jsx';
import Rings from '../components/Rings.jsx';
import ReactLogo from '../components/ReactLogo.jsx';
import Target from '../components/Target.jsx';
import CanvasLoader from '../components/Loading.jsx';
import HeroCamera from '../components/HeroCamera.jsx';
import { calculateSizes } from '../constants/index.js';
import { HackerRoom } from '../components/HackerRoom.jsx';

const Hero = () => {
  const isSmall = useMediaQuery({ maxWidth: 440 });
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });

  const sizes = calculateSizes(isSmall, isMobile, isTablet);

  return (
    <section
      className="relative flex min-h-screen w-full flex-col overflow-hidden pt-28"
      id="home"
    >
      <div className="hero-grid" aria-hidden="true" />
      <div className=" relative z-20 mx-auto flex w-full max-w-5xl flex-col gap-4 c-space sm:mt-14">
        {/* <p className="mx-auto w-fit rounded-full border border-cyan-300/25 bg-cyan-400/[0.08] px-5 py-2 text-center text-sm font-medium text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.18)] backdrop-blur-md sm:text-base">
          Available for modern web and 3D product builds
        </p> */}
    
          <p className="sm:text-3xl text-xl font-medium text-white text-center font-generalsans">
            Hi, I am Gaurav <span className="waving-hand">👋</span>
          </p>
          <p className="hero_tag text-gray_gradient">
            Building Products & Brands
          </p>
      
        {/* <p className="mx-auto max-w-2xl text-center text-base leading-7 text-white-600 sm:text-lg">
          I craft responsive MERN interfaces with crisp interaction design, polished visuals, and performance-aware 3D details.
        </p> */}
      </div>

      <div className="hero-canvas absolute inset-0 z-0 h-full w-full opacity-80">
        <Canvas className="w-full h-full">
          <Suspense fallback={<CanvasLoader />}>
            <Leva hidden />
            <PerspectiveCamera makeDefault position={[0, 0, 30]} />

            <HeroCamera isMobile={isMobile}>
              <HackerRoom
                scale={sizes.deskScale}
                position={sizes.deskPosition}
                rotation={[0.1, -Math.PI, 0]}
              />
            </HeroCamera>

            <group>
              <Target position={sizes.targetPosition} />
              {/* <ReactLogo position={sizes.reactLogoPosition} /> */}
              {/* <Rings position={sizes.ringPosition} /> */}
              {/* <Cube position={sizes.cubePosition} /> */}
            </group>

            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 10]} intensity={0.5} />
          </Suspense>
        </Canvas>
      </div>


    </section>
  );
};

export default Hero;
