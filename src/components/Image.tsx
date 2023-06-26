import { RigidBody, RigidBodyControl } from "@/components/RigidBody";
import { r } from "@/context/Physics";
import { motion } from "framer-motion";
import { useRef } from "react";

interface ImageProps {
  index: number;
  src: string;
}

export const Image = ({ index, src }: ImageProps) => {
  const rbRef = useRef<RigidBodyControl>(null);

  return (
    <div className={`flex items-center justify-center `}>
      <RigidBody
        asChild
        friction={1.1}
        ref={rbRef}
        delay={0}
        bodyType="dynamic"
        mass={10}
        frictionCombineRule={r.CoefficientCombineRule.Min}
        initialRotation={(Math.random() - 0.5) * 76}
      >
        <motion.button
          style={{
            WebkitTapHighlightColor: "transparent",
            overflowClipMargin: "-999px",
          }}
          className={`group relative w-[70%] max-w-[320px] overflow-clip rounded-sm lg:w-auto`}
        >
          <motion.img
            src={src}
            alt={"Image number " + index + 1}
            className={`h-full w-full scale-125 object-cover blur-xl transition-all duration-300 ease-in-out group-hover:scale-100 
							group-hover:blur-0`}
          />
          <motion.img
            src={src}
            onLoad={() => {
              if (rbRef.current !== null) {
                rbRef.current.initialize();
              }
            }}
            alt={"Image number " + index + 1}
            className={`absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:duration-1000`}
          />

          <div
            style={{
              textShadow: "#ffffff33 0px 0px 10px",
            }}
            className={`absolute inset-0 left-0 flex h-full w-full origin-center select-none items-start justify-start px-2 py-1 text-[clamp(1rem,3vw,2.75rem)] font-bold tracking-tight text-white text-opacity-90 opacity-100 blur-none duration-300 group-hover:opacity-0 group-hover:blur-md lg:px-4 `}
          >
            image {index + 1}
          </div>
        </motion.button>
      </RigidBody>
    </div>
  );
};
