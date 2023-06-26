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
		<div className={`flex justify-center items-center `}>
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
					className={`overflow-clip group rounded-sm relative max-w-[320px] w-[70%] lg:w-auto`}
				>
					<motion.img
						src={src}
						alt={"Image number " + index + 1}
						className={`w-full h-full object-cover blur-xl group-hover:blur-0 transition-all duration-300 scale-125 group-hover:scale-100 
							ease-in-out`}
					/>
					<motion.img
						src={src}
						onLoad={() => {
							if (rbRef.current !== null) {
								rbRef.current.initialize();
							}
						}}
						alt={"Image number " + index + 1}
						className={`w-full h-full object-cover group-hover:opacity-100 opacity-0 transition-all duration-300 group-hover:duration-1000 ease-in-out absolute inset-0`}
					/>

					<div
						style={{
							textShadow: "#ffffff33 0px 0px 10px",
						}}
						className={`absolute opacity-100 group-hover:opacity-0 origin-center group-hover:blur-md blur-none duration-300 text-[clamp(1rem,3vw,2.75rem)] lg:px-4 px-2 py-1 select-none inset-0 left-0 w-full h-full flex justify-start text-white text-opacity-90 font-bold tracking-tight items-start `}
					>
						image {index + 1}
					</div>
				</motion.button>
			</RigidBody>
		</div>
	);
};
