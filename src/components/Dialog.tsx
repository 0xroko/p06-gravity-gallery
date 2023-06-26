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
			className={`underline underline-offset-2 hover:decoration-black/60 duration-300 cursor-pointer`}
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
					className={`fixed inset-0 opacity-0 pointer-events-none  z-[9998]`}
				></RDialog.Overlay>
				<RDialog.Content
					onEscapeKeyDown={() => {
						navigate("/", {
							state: location.state,
						});
					}}
					forceMount
					className={`fixed z-[9999] inset-0`}
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
								className={`max-w-5xl mt-32 text-black mx-auto text-sm px-6`}
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
									<Link href="https://github.com/0xroko/rapier-framer-motion">
										More info
									</Link>
								</div>
								<div
									className={`absolute bottom-9 left-0 right-0 flex justify-center items-center`}
								>
									<RigidBody
										collisionGroups={0x00040005}
										bodyType="dynamic"
										mass={0.02}
										restitution={0.9}
										initialRotation={(Math.random() - 0.5) * 45}
										delay={220}
										asChild
									>
										<motion.div className={``}>
											by <Link href="https://rkbk.gq/gh">0xroko</Link>
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
