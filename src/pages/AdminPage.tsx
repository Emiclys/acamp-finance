import { useState } from "react";
import supabase from "../supabase/supabase";
import { useAdminAuth } from "../hooks/useAdminAuth";

const AdminPage = () => {
  const [yieldPercentage, setYieldPercentage] = useState(0);
  const [yieldToUser, setYieldToUser] = useState("");
  const [yieldTo, setYieldTo] = useState("Rendendo para todos");
  const [yieldButtonDisabled, setYieldButtonDisabled] = useState(false);
  const [yieldMessage, setYieldMessage] = useState("");
  const [inputAdminId, setInputAdminId] = useState("");
  const { adminId, validAdminId, login, logout } = useAdminAuth();

  // atalhos do teclado
  onkeydown = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      handleLogin();
    }

    if (e.key == "Escape") {
      e.preventDefault();
      logout();
    }
  };

  const handleYieldTo = async (user_id: string) => {
    setYieldToUser(user_id);

    if (!user_id) {
      setYieldTo("Rendendo para todos");
      setYieldButtonDisabled(false);
      return;
    } else if (user_id.length < 4) {
      setYieldTo("Digite um ID de 4 dígitos");
      setYieldButtonDisabled(true);
    } else if (user_id.length == 4) {
      const { data } = await supabase
        .from("usuarios")
        .select("nome")
        .eq("id", user_id)
        .single();

      if (data) {
        setYieldButtonDisabled(false);
        setYieldTo("Rendendo para: " + data?.nome);
      } else {
        setYieldTo("Usuário não encontrado");
        setYieldButtonDisabled(true);
      }
    }
  };

  // faz login
  const handleLogin = () => {
    if (inputAdminId == validAdminId) {
      login(inputAdminId);
    }
  };

  // processa o rendimento
  const processYield = async () => {
    setYieldButtonDisabled(true);

    setTimeout(() => {
      setYieldButtonDisabled(false);
    }, 5000);

    let ids: string[] = [];

    if (yieldToUser) {
      ids.push(yieldToUser);
    } else {
      let { data } = await supabase.from("usuarios").select();
      data?.forEach((d) => ids.push(d.id));
    }

    ids.forEach(async (id) => {
      // transfere do banco para a conta do usuário
      const { data: rendimento } = await supabase.rpc("yield", {
        user_id: id,
        percentage: yieldPercentage,
      });

      // registra o rendimento
      await supabase.from("rendimentos").insert({
        id_usuario: id,
        porcentagem: yieldPercentage,
        valor: rendimento,
      });
    });

    setYieldMessage(
      "O montante de " +
        ids.length +
        " contas renderam " +
        yieldPercentage +
        "%"
    );

    setInterval(() => {
      setYieldMessage("");
    }, 4000);
  };

  if (!adminId) {
    return (
      <>
        <div className="flex centered margin-10">
          <div className="card">
            <div className="flex-col gap-10">
              <div className="text-center">
                <h3>Página do Bancário</h3>
              </div>
              <div className="flex-col align-left">
                <span>Chave de Acesso</span>
                <input
                  type="text"
                  onChange={(e) => setInputAdminId(e.target.value)}
                />
              </div>
              <button
                className="button"
                onClick={handleLogin}
                disabled={!inputAdminId}
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // se estiver logado, carregar o painel
  return (
    <>
      <div className="flex-col gap-10 centered margin-10">
        <div className="card w-80p">
          <div className="card-title text-gray">Rendimento</div>
          <div className="card-content">
            <div className="flex-col gap-10 w-100p">
              <div className="flex-col gap-10">
                <div className="flex-col">
                  <span>ID do Usuário</span>
                  <input
                    type="number"
                    placeholder="Ex: 1234"
                    onChange={(e) => handleYieldTo(e.target.value)}
                  />
                  <i className="text-small text-gray">{yieldTo}</i>
                </div>
                <div className="flex-col">
                  <span>Porcentagem</span>
                  <div className="flex-row flex-left">
                    <input
                      type="number"
                      onChange={(e) =>
                        setYieldPercentage(Number(e.target.value))
                      }
                    />
                    <span className="margin-l-10 flex-center">%</span>
                  </div>
                </div>
              </div>
              <button
                className="button"
                disabled={yieldButtonDisabled}
                onClick={processYield}
              >
                Render
              </button>
              {yieldMessage && (
                <span className="text-gray">{yieldMessage}</span>
              )}
            </div>
          </div>
        </div>

        <div className="card w-80p">
          <div className="card-title text-gray">Ações</div>
          <div className="card-content">
            <div className="flex-row gap-10">
              <button className="button-red w-100p" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
