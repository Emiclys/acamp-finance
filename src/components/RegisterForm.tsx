import { useState } from "react";
import { useToast } from "./toast";
import { useAuth } from "../hooks/useAuth";
import { limits } from "../data/limits";
import supabase from "../supabase/supabase";
import "../index.css";
import "../style/authpage.css";

const RegisterForm = () => {
  const [signingUp, setSigningUp] = useState(false);
  const [idAvailable, setIdAvailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Insira um ID de 4 dígitos");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const showToast = useToast();

  const handleId = async (value: string) => {
    setId(value);

    if (value.length == 4) {
      const { data } = await supabase
        .from("usuarios")
        .select("id")
        .eq("id", value)
        .single();

      setIdAvailable(data == null);

      if (data) {
        setErrorMessage("ID indisponível");
        setPassword("");
        setName("");
      } else setErrorMessage("");
    } else {
      setIdAvailable(false);
      setPassword("");
      setName("");
      setErrorMessage("Insira um ID de 4 dígitos");
    }
  };

  const handleSubmit = async () => {
    if (!name || !password) {
      showToast("Erro", "Preencha todos os campos", "info");
      return;
    }

    const { error: errorCreating } = await supabase
      .from("usuarios")
      .insert([{ id: id, nome: name, senha: password }]);

    if (errorCreating) {
      showToast("Erro ao criar conta", errorCreating.message, "error");
    } else {
      login(id);
      location.href = "/dashboard";
    }

    setSigningUp(false);
  };

  return (
    <div className="flex-col gap-10">
      <div className="flex-col align-left">
        <span>ID</span>
        <input
          type="number"
          onChange={(e) => handleId(e.target.value)}
          placeholder="Crie um ID"
          maxLength={limits.idLength}
        />
      </div>

      {errorMessage && <i className="text-gray">{errorMessage}</i>}

      {idAvailable && (
        <>
          <div className="flex-col align-left">
            <span>Nome</span>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              maxLength={50}
            />
          </div>

          <div className="flex-col align-left">
            <span>Senha</span>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie sua senha"
              maxLength={50}
            />
          </div>

          {password.length < 6 && (
            <i className="text-gray">Mínimo: 6 dígitos</i>
          )}

          <div className="flex-row gap-10">
            <button
              className={signingUp ? "button-disabled w-100p" : "button w-100p"}
              disabled={signingUp || !id || password.length < 6 || !name}
              onClick={handleSubmit}
            >
              Criar conta
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RegisterForm;
