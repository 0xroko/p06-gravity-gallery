import { motion } from "framer-motion";

import { ContentFilter } from "@/components/ContentFilter";
import { Dialog } from "@/components/Dialog";
import { DialogToggle } from "@/components/DialogToggle";
import { Image } from "@/components/Image";
import { RigidBody } from "@/components/RigidBody";

import useMediaQuery from "@/hooks/useMediaQuery";
import { Route, Routes } from "react-router-dom";

const imgs = [
  "https://images.unsplash.com/photo-1682099746087-465cd23e9c9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  "https://images.unsplash.com/photo-1657389929896-485239031d89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  "https://images.unsplash.com/photo-1658314330489-1957e6cad76c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  "https://images.unsplash.com/photo-1659786771186-40589b062b96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  "https://images.unsplash.com/photo-1658486825304-1190e88c4827?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  "https://images.unsplash.com/photo-1687251220233-247fca6aae80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
  "https://images.unsplash.com/photo-1687141572261-4679156f5b0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  "https://images.unsplash.com/photo-1679505445778-c19a1d0e9584?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
];

function App() {
  const isSm = useMediaQuery("(max-width: 768px)");

  return (
    <>
      <DialogToggle />

      <Routes>
        <Route path="/" element={<div />} />
        <Route path="/dialog" element={<Dialog />} />
      </Routes>
      <ContentFilter
        className={`mx-auto min-h-[100svh] max-w-7xl overflow-x-hidden overflow-y-clip`}
      >
        <div
          className={`absolute top-[80vh] flex items-center justify-center bg-transparent`}
        >
          <div
            className={`top-[0vh] mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-4 gap-y-9 overflow-x-visible bg-stone-50 bg-transparent p-4 md:gap-x-10 md:gap-y-[150px] md:p-20 xl:grid-cols-3`}
          >
            {imgs.map((s, i) => {
              return <Image key={i} src={s} index={i} />;
            })}
          </div>
        </div>
        <RigidBody
          bodyType="fixed"
          className={`absolute -top-7 left-0 h-7 w-[100%]`}
        />
        <RigidBody
          bodyType="fixed"
          className={`absolute -left-7 bottom-0 top-0 h-[9999px] w-7 `}
        />
        <RigidBody
          bodyType="fixed"
          className={`absolute -right-7 bottom-0 top-0 h-[9999px] w-7`}
        />

        <div
          className={`flex w-full items-center justify-around overflow-x-visible py-[40vh]`}
        >
          <RigidBody bodyType="dynamic" delay={5000} asChild>
            <motion.p
              className={`block w-min text-center text-2xl font-semibold leading-[0.7] text-neutral-900`}
            >
              hellooo
            </motion.p>
          </RigidBody>
          <RigidBody bodyType="dynamic" delay={5000} asChild>
            <motion.p
              className={`block w-min text-center text-2xl font-semibold leading-[0.7] text-neutral-900`}
            >
              woorld
            </motion.p>
          </RigidBody>
        </div>

        <div
          className={`left-0 right-0 top-[220vh] flex items-center justify-center py-4`}
        >
          <RigidBody bodyType="dynamic" restitution={0.9} delay={1000} asChild>
            <motion.div className={`font-semibold text-neutral-900`}>
              !! watch out !!
            </motion.div>
          </RigidBody>
        </div>
        <motion.div
          className={`w-full ${isSm ? "h-[100vh]" : "h-[260vh]"}`}
          initial={{
            height: isSm ? "h-[100vh]" : "h-[260vh]",
          }}
          animate={{
            height: isSm ? "20vh" : "120vh",
          }}
          transition={{
            duration: 10,
            delay: 5,
          }}
        ></motion.div>
      </ContentFilter>
    </>
  );
}

export default App;
