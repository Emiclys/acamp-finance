import { useEffect, useState } from "react";
import { formatCurrency, GenerateRandom } from "../utils/utils";
import { useSearchParams } from "react-router-dom";
import supabase from "../supabase";
import PasswordConfirmationModal from "../components/PasswordConfirmationModal";

const SendPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedPassword, setConfirmedPassword] = useState("");

  const [receptorId, setReceptorId] = useState("");
  const [receptorIdViaUrl, setReceptorIdViaUrl] = useState("");
  const [receptorName, setReceptorName] = useState("Digite o ID do receptor");

  const [zeroedAmount, setZeroedAmount] = useState(true);
  const [receptorError, setReceptorError] = useState(true);
  const [preDefinedValue, setPreDefinedValue] = useState(false);
  const [preDefinedId, setPreDefinedId] = useState(false);
  const [loadingSaldo, setLoadingSaldo] = useState(true);
  const [sending, setSending] = useState(false);

  const [transferValue, setTransferValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [valueError, setValueError] = useState("");

  const [searchParams] = useSearchParams();

  const [saldo, setSaldo] = useState(1000000);
  const [userId, setUserId] = useState("");

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleConfirmPassword = (password: string) => {
    setConfirmedPassword(password);
    setIsConfirmed(true);
    setModalOpen(false);
    // Aqui você pode validar a senha, chamar API, etc.
  };

  const handleValueViaUrl = () => {
    let raw = searchParams.get("amount") as string; // Get the value of the 'q' parameter
    if (!raw) return;

    setPreDefinedValue(true);

    raw.replace(/\D/g, ""); // remove tudo que não for número

    if (!raw) raw = "0";

    // Garante pelo menos 3 dígitos para centavos
    while (raw.length < 3) raw = "0" + raw;
    const numeric = parseFloat(raw) / 100;
    setTransferValue(raw);
    setFormattedValue(formatCurrency(numeric));
    setZeroedAmount(numeric == 0); // não deixa o usuário fazer pix de 0,00 merrecas
    console.log(valueError);

    // Verifica se o valor é maior que o saldo
    if (numeric > saldo) {
      setValueError("Saldo insuficiente");
    } else {
      setValueError("");
    }
  };

  const handleReceptorIdViaUrl = async () => {
    const id = searchParams.get("userId") as string; // Get the value of the 'q' parameter
    id.replace(/\D/g, ""); // remove tudo que não for número

    if (!id) return;

    setPreDefinedId(true);

    if (id.length == 4) {
      setReceptorId(id);
      supabase
        .from("usuarios")
        .select()
        .eq("id", id)
        .single()
        .then(({ data }) => {
          if (data) {
            if (id === userId) {
              // Verifica se o ID do receptor é o mesmo do usuário logado
              setReceptorName("Você não pode enviar merreca para si mesmo.");
              setReceptorError(true);
              return;
            } else setReceptorError(false);

            // Receptor encontrado
            setReceptorName("Nome do receptor: " + data.nome);
            setReceptorError(false);
          } else {
            // Receptor não encontrado
            setReceptorName("Receptor não encontrado.");
            setReceptorError(true);
          }
        });

      setReceptorIdViaUrl(id);
    }

    if (id.length < 4) {
      setReceptorId("");
      setReceptorName("Digite o ID do receptor");
      setReceptorError(true);
    }
  };

  useEffect(() => {
    handleReceptorIdViaUrl();
    handleValueViaUrl();
  }, [userId]);

  const fetchSaldo = async () => {
    const { data } = await supabase
      .from("usuarios")
      .select("dinheiro")
      .eq("id", userId) // Substitua "1" pelo ID do usuário logado
      .single();

    if (data) {
      setSaldo(data?.dinheiro);
      setLoadingSaldo(false);
    } else console.error("Erro ao buscar saldo");
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.warn("Nenhum ID de usuário encontrado no localStorage.");
    }
  }, []);

  useEffect(() => {
    fetchSaldo();
  }, [userId]);

  // Função para formatar o valor conforme digitado
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, ""); // remove tudo que não for número
    if (!raw) raw = "0";
    // Garante pelo menos 3 dígitos para centavos
    while (raw.length < 3) raw = "0" + raw;
    const numeric = parseFloat(raw) / 100;
    setTransferValue(raw);
    setFormattedValue(formatCurrency(numeric));
    setZeroedAmount(numeric == 0); // não deixa o usuário fazer pix de 0,00 merrecas
    // Verifica se o valor é maior que o saldo
    if (numeric > saldo) {
      setValueError("Saldo insuficiente");
    } else {
      setValueError("");
    }
  };

  const handleReceptorIdChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const id = e.target.value.replace(/\D/g, ""); // remove tudo que não for número

    if (id.length == 4) {
      setReceptorId(id);
      supabase
        .from("usuarios")
        .select()
        .eq("id", id)
        .single()
        .then(({ data }) => {
          if (data) {
            if (id === userId) {
              // Verifica se o ID do receptor é o mesmo do usuário logado
              setReceptorName("Você não pode enviar merreca para si mesmo.");
              setReceptorError(true);
              return;
            } else setReceptorError(false);

            // Receptor encontrado
            setReceptorName("Nome do receptor: " + data.nome);
            setReceptorError(false);
          } else {
            // Receptor não encontrado
            setReceptorName("Receptor não encontrado.");
            setReceptorError(true);
          }
        });
    }

    if (id.length < 4) {
      setReceptorId("");
      setReceptorName("Digite o ID do receptor");
      setReceptorError(true);
    }
  };

  useEffect(() => {
    handleSend();
  }, [isConfirmed]);

  const handleSend = async () => {
    setSending(true);
    // Verifica se o receptor é válido
    if (receptorError || valueError) {
      console.log("Erro ao enviar: receptor inválido ou valor inválido.");
      setSending(false);
      return;
    }

    const numericValue = parseFloat(transferValue) / 100;

    // Verifica se o saldo é suficiente
    if (numericValue > saldo) {
      console.log("Saldo insuficiente para a transferência.");
      return;
    }

    // Realiza a transferência
    const { error } = await supabase
      .from("usuarios")
      .update({ dinheiro: saldo - numericValue })
      .eq("id", userId);
    if (error) {
      console.error("Erro ao atualizar saldo do remetente:", error);
      return;
    }

    const { data } = await supabase
      .from("usuarios")
      .select("dinheiro")
      .eq("id", receptorId)
      .single();

    const saldoReceptor = data?.dinheiro || 0;

    // Atualiza o saldo do receptor
    const { error: errorReceptor } = await supabase
      .from("usuarios")
      .update({ dinheiro: saldoReceptor + numericValue })
      .eq("id", receptorId);
    if (errorReceptor) {
      console.error("Erro ao atualizar saldo do receptor:", errorReceptor);
      return;
    }

    // Insere o registro da transação
    const { data: transacaoData, error: transacaoError } = await supabase
      .from("transacoes")
      .insert({
        id: GenerateRandom(12),
        remetente_id: userId,
        receptor_id: receptorId,
        valor: numericValue,
        tipo: "PIX",
      })
      .select();

    console.log("Transação registrada:", transacaoData);

    if (transacaoError) {
      console.error("Erro ao registrar transação:", transacaoError);
      return;
    }

    setSending(false);
    setReceptorId("");
    setReceptorName("Digite o ID do receptor");
    setTransferValue("");
    setFormattedValue("");
    setValueError("");
    setReceptorError(true);
    // Exibe mensagem de sucesso
    console.log("PIX enviado com sucesso!");
    if (transacaoData && transacaoData[0] && transacaoData[0].id) {
      window.location.href = "/pixsuccess/" + transacaoData[0].id;
    }
  };

  return (
    <>
      <PasswordConfirmationModal
        open={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmPassword}
      />
      <div className="flex-col gap-10 padding-25 desktop-fit">
        <div className="flex-col text-center margin-10">
          <span className="text-big">Fazer um PIX</span>
          <span className="text-gray">
            Envie merreca para outros participantes do retiro
          </span>
        </div>
        <div className="card margin-10">
          <div className="card-title">Enviar merreca</div>
          <div className="card-content">
            <div className="flex-col gap-10">
              <div className="flex-left flex-col">
                <span>ID de destino</span>
                <input
                  type="text"
                  maxLength={4}
                  onChange={(e) => handleReceptorIdChange(e)}
                  defaultValue={receptorIdViaUrl}
                  placeholder="ID"
                  disabled={loadingSaldo || sending || preDefinedId}
                />

                {receptorName && (
                  <span className="text-gray margin-t-10">{receptorName}</span>
                )}
              </div>
              {!receptorError && (
                <div className="flex-left flex-col">
                  <span>Valor</span>
                  <div className="flex-row flex-center">
                    <span className="margin-h-10">M$</span>
                    <input
                      type="text"
                      value={formattedValue}
                      onChange={handleValueChange}
                      disabled={loadingSaldo || sending || preDefinedValue}
                      placeholder="0,00"
                      maxLength={14}
                    />
                  </div>
                  <span className="margin-t-10 text-gray">
                    {loadingSaldo
                      ? "carregando..."
                      : "Seu saldo: M$ " + formatCurrency(saldo)}
                  </span>
                  {!valueError && !zeroedAmount && (
                    <div className="flex-col margin-t-10">
                      <button
                        className={
                          sending || loadingSaldo
                            ? "button-disabled w-100p"
                            : "button w-100p"
                        }
                        onClick={handleOpenModal}
                        disabled={loadingSaldo || sending}
                      >
                        {sending ? "Enviando..." : "Fazer PIX"}
                      </button>
                    </div>
                  )}

                  {zeroedAmount && (
                    <div className="margin-t-10">
                      <i>Insira um valor</i>
                    </div>
                  )}

                  {!zeroedAmount && valueError && (
                    <div className="margin-t-10">
                      <i>{valueError}</i>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => (location.href = "/dashboard")}
          className="button-gray"
        >
          Voltar ao dashboard
        </button>
      </div>
    </>
  );
};

export default SendPage;
