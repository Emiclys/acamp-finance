import { useState } from "react";
import supabase from "../supabase";
import { GenerateRandom } from "../utils/utils";
import "../index.css";
import "../style/authpage.css";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    await supabase
      .from("usuarios")
      .insert([{ id: GenerateRandom(4), nome: name, senha: password }]);
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
        <button className="button w-100p" onClick={handleSubmit}>
          Criar conta
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
