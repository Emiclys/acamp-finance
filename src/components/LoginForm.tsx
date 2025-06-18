import supabase from "../supabase";
import Toast, { useToast } from "./toast";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "../index.css";
import "../style/authpage.css";

const LoginForm = () => {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  const showToast = useToast();

  const handleSubmit = async () => {
    const { data } = await supabase
      .from("usuarios")
      .select()
      .eq("id", id)
      .eq("senha", password)
      .single();

    if (data) {
      login(id);
      location.href = "/dashboard"; // Redireciona para o dashboard se o login for bem-sucedido
    } else showToast("Erro no login", "ID ou senha incorretos.", "error");
  };

  return (
    <>
      <Toast />
      <div className="flex-col gap-10">
        <div className="flex-col align-left">
          <span>ID</span>
          <input
            type="text"
            onChange={(e) => setId(e.target.value)}
            placeholder="Digite seu ID"
            maxLength={4}
          />
        </div>

        <div className="flex-col align-left">
          <span>Senha</span>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Insira sua senha"
            maxLength={50}
          />
        </div>

        <div className="flex-row gap-10">
          <button className="button w-100p" onClick={handleSubmit}>
            Entrar
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
