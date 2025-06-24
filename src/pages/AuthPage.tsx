import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import "../index.css";
import "../style/authpage.css";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/base/Button";

const AuthPage = () => {
  const { userId } = useAuth();

  if (userId) location.href = "/dashboard";

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
            <Button
              label="Login"
              onClick={() => setCurrentTab("entrar")}
              variant={currentTab == "entrar" ? "primary" : "secondary"}
            />
            <Button
              label="Cadastro"
              onClick={() => setCurrentTab("cadastrar")}
              variant={currentTab == "cadastrar" ? "primary" : "secondary"}
            />
          </div>

          {currentTab === "entrar" && <LoginForm />}
          {currentTab === "cadastrar" && <RegisterForm />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
