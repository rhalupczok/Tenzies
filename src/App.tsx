import { Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Unauthorized from "./components/Unauthorized";
import PersistLogin from "./components/PersistLogin";
import RequireAuth from "./components/RequireAuth";
import Account from "./components/Account";
import Game from "./components/Game";

export default function App() {
    return (
        <Routes>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route element={<PersistLogin />}>
                <Route element={<RequireAuth allowedRoles={[2001, 2000]} />}>
                    <Route path="/" element={<Game />} />
                    <Route path="account" element={<Account />} />
                </Route>
            </Route>
        </Routes>
    );
}
