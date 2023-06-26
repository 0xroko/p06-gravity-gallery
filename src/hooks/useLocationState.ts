import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export const useLocationState = () => {
	const location = useLocation();
	const pathname = location.pathname;
	const isDialogOpen = location.pathname === "/dialog";
	// if we are coming from index page, we want to animate the content (state was set in Link component)
	const backgroundLocation = location.state?.from;

	const firstRouteRef = useRef(pathname);
	const [isFirstRouteAndDialog, setFirstRouteAndDialog] = useState(
		pathname === "/dialog"
	);

	useEffect(() => {
		if (pathname !== firstRouteRef.current && isFirstRouteAndDialog) {
			setFirstRouteAndDialog(false);
		}
	}, [pathname]);

	return {
		isDialogOpen,
		backgroundLocation,
		location,
		isFirstRouteAndDialog,
	};
};
