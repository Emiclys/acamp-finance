import { useState } from "react";
import supabase from "../supabase";
import { GenerateRandom } from "../utils/utils";
import "../index.css";
import "../style/authpage.css";
import { useToast } from "./toast";
import { useAuth } from "../hooks/useAuth";

const RegisterForm = () => {
  const [signingUp, setSigningUp] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const showToast = useToast();

  const handleSubmit = async () => {
    if (!name || !password) {
      showToast("Erro", "Preencha todos os campos", "info");
      return;
    }

    setSigningUp(true);

    let newUserId = GenerateRandom(4);

    // previne que dois ou mais usuários tenham o mesmo ID
    while (
      await supabase.from("usuarios").select().eq("id", newUserId).single()
    ) {
      newUserId = GenerateRandom(4);
    }

    const { error: errorCreating } = await supabase
      .from("usuarios")
      .insert([{ id: newUserId, nome: name, senha: password }]);

    if (errorCreating) {
      showToast("Erro ao criar conta", errorCreating.message, "error");
    } else {
      login(newUserId);
      location.href = "/dashboard";
    }

    setSigningUp(false);
  };

  return (
    <div className="flex-col gap-10">
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

      <div className="flex-row gap-10">
        <button
          className={signingUp ? "button-disabled w-100p" : "button w-100p"}
          disabled={signingUp}
          onClick={handleSubmit}
        >
          Criar conta
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
