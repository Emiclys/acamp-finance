import supabase from "../supabase/supabase";
import Toast, { useToast } from "./toast";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "../index.css";
import "../style/authpage.css";
import { limits } from "../data/limits";
import Button from "./base/Button";

const LoginForm = () => {
  const { login } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  const showToast = useToast();

  const idField = useRef<HTMLInputElement>(null);
  const passwordField = useRef<HTMLInputElement>(null);

  onkeydown = (e) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        if (document.activeElement == idField.current)
          passwordField.current?.focus();
        else if (document.activeElement == passwordField.current)
          handleSubmit();
        break;
    }
  };

  // foca o campo de ID automaticamente
  useEffect(() => {
    idField?.current?.focus();
  }, []);

  const handleIdInput = (id: string) => {
    setId(id);
    if (id.length == 4) passwordField.current?.focus();
  };

  const handleSubmit = async () => {
    setSigningIn(true);

    if (!id || !password) {
      showToast("Erro", "Preencha todos os campos", "info");
      setSigningIn(false);
      return;
    }

    if (id.length > limits.idLength) {
      showToast("Erro", "O ID deve ser de 4 dígitos", "info");
      setSigningIn(false);
      return;
    }

    const { data } = await supabase
      .from("usuarios")
      .select()
      .eq("id", id)
      .eq("senha", password)
      .single();

    if (data) {
      login(id);
      setSigningIn(false);
      location.href = "/dashboard"; // Redireciona para o dashboard se o login for bem-sucedido
    } else {
      showToast("Erro no login", "ID ou senha incorretos.", "error");
      setSigningIn(false);
    }
  };

  return (
    <>
      <Toast />
      <div className="flex-col gap-10">
        <div className="flex-col align-left">
          <span>ID</span>
          <input
            type="number"
            onChange={(e) => handleIdInput(e.target.value)}
            placeholder="Digite seu ID"
            maxLength={limits.idLength}
            ref={idField}
          />
        </div>

        <div className="flex-col align-left">
          <span>Senha</span>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Insira sua senha"
            maxLength={50}
            ref={passwordField}
          />
        </div>

        <div className="flex-row gap-10">
          <Button
            label={signingIn ? "Entrando..." : "Entrar"}
            disabled={signingIn || password.length < 6 || id.length < 4}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default LoginForm;
