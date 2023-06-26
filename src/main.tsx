import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Physics } from "./context/Physics";
import "./index.css";

createRoot(document.getElementById("root") as HTMLElement).render(
	<Suspense fallback={<div className={`w-screen h-screen bg-white`}></div>}>
		<Physics gravity={{ x: 0, y: -200 }}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Physics>
	</Suspense>
);
