// pages/plasmic-host.tsx
import * as React from "react";
import { PlasmicCanvasHost, registerComponent } from "@plasmicapp/host"; // 注意这里从 host 引入
import { PLASMIC } from "@/plasmic-init";
import PoolAnimation from "@/components/PoolAnimation"; // 引入你刚建的组件

// 注册自定义组件
registerComponent(PoolAnimation, {
  name: "PoolAnimation",
  props: {
    width: {
      type: "number",
      defaultValue: 600,
    },
    height: {
      type: "number",
      defaultValue: 240,
    },
    // 如果你用 Lottie 版本，可以加这两个属性
    src: {
      type: "string",
      defaultValue: "https://assets9.lottiefiles.com/packages/lf20_sjmccb9b.json",
    },
    loop: {
      type: "boolean",
      defaultValue: true,
    },
    autoplay: {
      type: "boolean",
      defaultValue: true,
    },
  },
  importPath: "@/components/PoolAnimation", // 方便 Studio 显示
});

export default function PlasmicHost() {
  return <PlasmicCanvasHost />;
}
