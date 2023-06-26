import { useLocationState } from "@/hooks/useLocationState";
import { useScrollbarWidth } from "@/hooks/useScrollbarWidth";
import { Portal } from "@radix-ui/react-portal";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface DialogToggleProps {
	children?: React.ReactNode | React.ReactNode[];
}

export const DialogToggle = ({}: DialogToggleProps) => {
	const { isDialogOpen, isFirstRouteAndDialog } = useLocationState();
	const to = isDialogOpen ? "/" : "/dialog";

	const scrollbarWidth = useScrollbarWidth();

	return (
		<Portal asChild>
			<Link
				tabIndex={1}
				to={to}
				state={{
					from: location.pathname,
				}}
				style={{
					// "on first load css var will be 0px (radix doesn't set CSS var on first load)"
					right: `calc(2rem + ${
						!isFirstRouteAndDialog
							? "var(--removed-body-scroll-bar-size,0px)"
							: `${scrollbarWidth}px`
					})`,
				}}
				className={`fixed top-8 !pointer-events-auto flex justify-center items-center h-10 w-10 z-[99999]`}
			>
				<svg
					style={{
						position: "absolute",
						width: "0",
						height: "0",
					}}
				>
					<clipPath
						id="shape"
						clipPathUnits="objectBoundingBox"
						transform="scale(0.01285, 0.01285)"
					>
						<path d="M0 49H100V59H0V49Z M0 19H100V29H0V19Z" />
					</clipPath>
				</svg>

				<motion.div
					style={{
						clipPath: "url(#shape)",
						originX: 0.5,
						originY: 0.5,
					}}
					initial={false}
					animate={{
						rotate: isDialogOpen ? [0, 90] : [-90, 0],
					}}
					className={`w-6 h-6 backdrop-invert backdrop-opacity-75`}
				></motion.div>
			</Link>
		</Portal>
	);
};
