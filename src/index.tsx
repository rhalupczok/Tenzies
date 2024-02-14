import ReactDOM from "react-dom/client";
import {
    createHashRouter,
    createRoutesFromElements,
    RouterProvider,
    Route,
} from "react-router-dom";
import "./styles/index.scss";
import { AuthProvider } from "./context/AuthProvider";
import { PlayerInfoProvider } from "./context/PlayerInfoProvider";
import App from "./App";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
const router = createHashRouter(
    createRoutesFromElements(<Route path="/*" element={<App />} />)
);

root.render(
    <AuthProvider>
        <PlayerInfoProvider>
            <RouterProvider router={router} />
        </PlayerInfoProvider>
    </AuthProvider>
);
