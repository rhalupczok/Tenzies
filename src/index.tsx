import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/AuthProvider";
import { PlayerInfoProvider } from "./context/PlayerInfoProvider";
import App from "./App";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <HashRouter>
        <AuthProvider>
            <PlayerInfoProvider>
                <Routes>
                    <Route path="/*" element={<App />} />
                </Routes>
            </PlayerInfoProvider>
        </AuthProvider>
    </HashRouter>
);
