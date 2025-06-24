import { useRef, useState } from "react";
import { useToast } from "./toast";
import { useAuth } from "../hooks/useAuth";
import supabase from "../supabase/supabase";
import "../index.css";
import "../style/authpage.css";
import Button from "./base/Button";

const RegisterForm = () => {
  const [signingUp, setSigningUp] = useState(false);
  const [idAvailable, setIdAvailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Insira um ID de 4 dígitos");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const showToast = useToast();

  const nameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

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
      } else {
        setErrorMessage("Depois de criado, o ID não pode ser alterado.");
        nameInputRef.current?.focus();
      }
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
          maxLength={4}
          max={9999}
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
              ref={nameInputRef}
            />
          </div>

          <div className="flex-col align-left">
            <span>Senha</span>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie sua senha"
              maxLength={50}
              ref={passwordInputRef}
            />
          </div>

          {password.length < 6 && (
            <i className="text-gray">Mínimo: 6 dígitos</i>
          )}

          <div className="flex-row gap-10">
            <Button
              label="Criar conta"
              disabled={signingUp || !id || password.length < 6 || !name}
              onClick={handleSubmit}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default RegisterForm;
