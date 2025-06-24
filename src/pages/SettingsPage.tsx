import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/toast";
import supabase from "../supabase/supabase";
import "../index.css";
import "../style/settingspage.css";

const SettingsPage = () => {
  const { isAuthenticated, userName, userId, logout } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [newName, setNewName] = useState(userName);
  const [newPassword, setNewPassword] = useState("");
  const showToast = useToast();

  if (!isAuthenticated) {
    location.href = "/"; // Redireciona para a página de login se o usuário não estiver logado
    return null; // Evita renderizar o componente se não houver usuário
  }

  const handleSave = async () => {
    if (newPassword.length < 6) {
      showToast("Erro", "A senha deve conter no mínimo 6 dígitos", "error");
      return;
    }

    setIsSaving(true);

    const { error } = await supabase
      .from("usuarios")
      .update({ nome: newName })
      .eq("id", userId);

    if (newPassword.length > 0) {
      const { error } = await supabase
        .from("usuarios")
        .update({ senha: newPassword })
        .eq("id", userId);

      if (error) showToast("Erro ao salvar", error.message, "error");
      else
        showToast(
          "Sucesso",
          "Nome e senha atualizados com sucesso!",
          "success"
        );

      setNewName("");
      setIsSaving(false);
      return;
    }

    if (error) showToast("Erro ao salvar", error.message, "error");
    else showToast("Sucesso", "Nome atualizado com sucesso!", "success");

    setNewName("");
    setIsSaving(false);
  };

  return (
    <div className="flex-col gap-10 flex-center desktop-fit">
      <div className="flex-col text-center margin-10">
        <span className="text-big">Configurações</span>
        <span className="text-gray">Defina as informações da sua conta.</span>
      </div>

      <div className="card gap-10 margin-b-10 w-85p">
        <div className="flex-left margin-b-10 card-title">
          <span>Informações da conta</span>
        </div>

        <div className="flex-col gap-10">
          <div className="flex-col flex-left">
            <span>Nome</span>
            <input
              type="text"
              onChange={(e) => setNewName(e.target.value)}
              defaultValue={userName}
            />
          </div>

          <div className="flex-col flex-left">
            <span>Nova senha</span>
            <input
              type="text"
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="insira uma nova senha aqui"
            />
          </div>

          <div className="flex-col flex-left">
            <span>ID</span>
            <input
              type="text"
              value={userId}
              disabled={true}
              style={{ color: "#777" }}
            />
            <i style={{ color: "#777" }} className="margin-t-10">
              Seu ID não pode ser alterado *
            </i>
          </div>

          <div className="h-box">
            <button
              className="button w-100p"
              disabled={isSaving || (newName == "" && newPassword == "")}
              onClick={handleSave}
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-row gap-10 w-90p">
        <button className="button-red w-100p" onClick={logout}>
          Sair da conta
        </button>
        <button
          className="button-gray w-100p"
          onClick={() => (location.href = "/dashboard")}
        >
          Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
