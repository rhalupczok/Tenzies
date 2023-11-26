import { FC } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";

const Unauthorized: FC = () => {
    const navigate: NavigateFunction = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <main>
            <h1>Unauthorized</h1>
            <br />
            <p>You do not have access to the requested page.</p>
            <div className="flexGrow">
                <button onClick={goBack}>Go Back</button>
            </div>
        </main>
    );
};

export default Unauthorized;
