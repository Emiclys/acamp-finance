import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import "../index.css";
import "../style/authpage.css";

const AuthPage = () => {
  const [currentTab, setCurrentTab] = useState("entrar");

  return (
    <div className="center-content">
      <div className="auth-page">
        <div className="flex-col">
          <div className="flex-col text-center">
            <span className="text-big">Acamp Finance</span>
            <span className="text-gray">
              O sistema financeiro dos Retiros Espirituais
            </span>
          </div>

          <div className="flex-row margin-10 gap-10">
            <button
              className={
                currentTab == "entrar" ? "button w-100p" : "button-gray w-100p"
              }
              onClick={() => setCurrentTab("entrar")}
            >
              Login
            </button>
            <button
              className={
                currentTab == "cadastrar"
                  ? "button w-100p"
                  : "button-gray w-100p"
              }
              onClick={() => setCurrentTab("cadastrar")}
            >
              Cadastro
            </button>
          </div>

          {currentTab === "entrar" && <LoginForm />}
          {currentTab === "cadastrar" && <RegisterForm />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
