import { FC } from "react";
import style from "../styles/partials/Authorization.module.scss";
import { useNavigate, NavigateFunction } from "react-router-dom";

const Unauthorized: FC = () => {
    const navigate: NavigateFunction = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <section className={style.authorization}>
            <header className={style.authorization__header}>
                <h1>Tenzi</h1>
            </header>
            <article className={style.authorization__authStatus}>
                <h2>Unauthorized</h2>
                <p>You do not have access to the requested page.</p>
                <button className={style.form__button} onClick={goBack}>
                    Go Back
                </button>
            </article>
        </section>
    );
};

export default Unauthorized;
