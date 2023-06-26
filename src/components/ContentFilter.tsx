import { useLocationState } from "@/hooks/useLocationState";
import {
  HTMLMotionProps,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { useEffect } from "react";

interface ContentFilterProps extends HTMLMotionProps<"div"> {
  children?: React.ReactNode | React.ReactNode[];
}

export const ContentFilter = ({ children, ...props }: ContentFilterProps) => {
  const { isDialogOpen, backgroundLocation } = useLocationState();

  const blurVal = useMotionValue(0);
  const brighnessVal = useMotionValue(1);
  const saturation = useMotionValue(1);
  const opacityVal = useMotionValue(1);

  const filter = useMotionTemplate`brightness(${brighnessVal}) contrast(${saturation}) opacity(${opacityVal})  blur(${blurVal}px)`;

  const animateContent = async (out: boolean, instant: boolean) => {
    const instantOr = (duration: number) => (instant ? 0 : duration);

    if (!out) {
      animate([
        [saturation, 0.4, { duration: instantOr(0.3), at: instantOr(0.1) }],
        [brighnessVal, 3.5, { duration: instantOr(0.2), at: instantOr(0.1) }],
        [opacityVal, 0.8, { duration: instantOr(0.2), at: instantOr(0.1) }],
        [blurVal, 40, { duration: instantOr(0.5), at: instantOr(0.2) }],
      ]);
    } else {
      animate([
        [blurVal, 0, { duration: instantOr(0.4), at: instantOr(0.0) }],
        [opacityVal, 1, { duration: instantOr(0.3), at: instantOr(0.0) }],
        [saturation, 1, { duration: instantOr(0.3), at: instantOr(0.1) }],
        [brighnessVal, 1, { duration: instantOr(0.3), at: instantOr(0.1) }],
      ]);
    }
  };

  useEffect(() => {
    animateContent(!isDialogOpen, !backgroundLocation);
  }, [isDialogOpen]);

  return (
    <motion.div
      style={{
        filter: filter,
        overflowClipMargin: "-999px",
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
