import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import PoolAnimation from "./components/PoolAnimation";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "jmZRWx7iGXQ63kqiJRikGa",
      token: "UwChQBuC3aDF7ppotgAd6HMFzxzGd3JtvjENyx3SCJNNMSZeJl0UlArYWQbxd3MSx7GC1ogyHCy4dlllA",
    },
  ],

  // By default Plasmic will use the last published version of your project.
  // For development, you can set preview to true, which will use the unpublished
  // project, allowing you to see your designs without publishing.  Please
  // only use this for development, as this is significantly slower.
  preview: false,
});

PLASMIC.registerComponent(PoolAnimation, {
  name: "PoolAnimation",
  props: {
    speed: { type: "number", defaultValue: 1 },
    color: { type: "string", defaultValue: "#00D1B2" },
  },
});
// You can register any code components that you want to use here; see
// https://docs.plasmic.app/learn/code-components-ref/
// And configure your Plasmic project to use the host url pointing at
// the /plasmic-host page of your nextjs app (for example,
// http://localhost:3000/plasmic-host).  See
// https://docs.plasmic.app/learn/app-hosting/#set-a-plasmic-project-to-use-your-app-host

// PLASMIC.registerComponent(...);
