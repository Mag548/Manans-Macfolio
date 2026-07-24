import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

import { Dock, Navbar, Welcome, Home } from '#components';
import LineWaves from '#components/LineWaves/LineWaves.jsx';
// Kept for easy revert: import DotField from '#components/DotField/DotField.jsx';
import { Terminal, Safari, Resume, Finder, Text, Image, Contact, Photos, Model3D } from '#windows';

gsap.registerPlugin(Draggable);

const App = () => {
  return (
    <main>
      {/* Previous backgrounds (wallpaper + DotField) kept under src/components/DotField and CSS comments */}
      <div className="line-waves-layer">
        <LineWaves
          speed={0.3}
          innerLineCount={32}
          outerLineCount={36}
          warpIntensity={1}
          rotation={-45}
          edgeFadeWidth={0}
          colorCycleSpeed={1}
          brightness={0.2}
          color1="#A855F7"
          color2="#A855F7"
          color3="#ffffff"
          enableMouseInteraction
          mouseInfluence={2}
        />
      </div>

      <Navbar />
      <Welcome />
      <Home />
      <Dock />

      <Terminal />
      <Safari />
      <Resume />
      <Finder />
      <Text />
      <Image />
      <Contact />
      <Photos />
      <Model3D />
    </main>
  );
};

export default App;
