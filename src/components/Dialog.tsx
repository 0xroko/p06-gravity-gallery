import * as RDialog from "@radix-ui/react-dialog";

import { RigidBody } from "@/components/RigidBody";
import { useLocationState } from "@/hooks/useLocationState";
import { AnimatePresence, motion } from "framer-motion";
import { HTMLProps } from "react";
import { useNavigate } from "react-router-dom";

interface LinkProps extends HTMLProps<HTMLAnchorElement> {
  children?: React.ReactNode | React.ReactNode[];
}

export const Link = ({ children, ...props }: LinkProps) => {
  return (
    <a
      {...props}
      rel="noopener noreferrer"
      target="_blank"
      referrerPolicy="no-referrer"
      className={`cursor-pointer underline underline-offset-2 duration-300 hover:decoration-black/60`}
    >
      {children}
    </a>
  );
};

interface DialogProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const Dialog = ({}: DialogProps) => {
  const navigate = useNavigate();

  const { isDialogOpen, location } = useLocationState();

  return (
    <RDialog.Root open={isDialogOpen}>
      <RDialog.Portal>
        <RDialog.Overlay
          tabIndex={-1}
          className={`pointer-events-none fixed inset-0 z-[9998]  opacity-0`}
        ></RDialog.Overlay>
        <RDialog.Content
          onEscapeKeyDown={() => {
            navigate("/", {
              state: location.state,
            });
          }}
          forceMount
          className={`fixed inset-0 z-[9999]`}
        >
          <AnimatePresence>
            {isDialogOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.7,
                }}
                animate={{
                  opacity: 1,
                }}
                className={`mx-auto mt-32 max-w-5xl px-6 text-black`}
              >
                <Link href="https://rapier.rs">Rapier.rs</Link> {" + "}
                <Link href="https://www.framer.com/motion/">
                  Framer Motion
                </Link>{" "}
                demo
                <div className={`mt-2`}>
                  Images from{" "}
                  <Link href="https://unsplash.com/@eugene_golovesov">
                    Unsplash
                  </Link>
                </div>
                <div className={`mt-2`}>
                  <Link href="https://github.com/0xroko/p06-gravity-gallery">
                    More info
                  </Link>
                </div>
                <div
                  className={`absolute bottom-9 left-0 right-0 flex items-center justify-center`}
                >
                  <RigidBody
                    collisionGroups={0x00040005}
                    bodyType="dynamic"
                    mass={0.02}
                    restitution={0.9}
                    initialRotation={(Math.random() - 0.5) * 45}
                    delay={0}
                    asChild
                  >
                    <motion.div className={``}>
                      by <span className={`font-medium`}>0xroko</span>
                    </motion.div>
                  </RigidBody>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  );
};
