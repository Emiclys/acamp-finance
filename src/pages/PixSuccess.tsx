import supabase from "../supabase/supabase";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatCurrency, getUserNameById } from "../utils/utils";

const PixSuccess = () => {
  const { transaction_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState(false);
  const [transactionInfo, setTransactionInfo] = useState({
    id: transaction_id || "[error]",
    date: "[error]",
    amount: "[error]",
    sender: "[error]",
    receiver: "[error]",
    remetente_id: "[error]",
    receptor_id: "[error]",
  });

  const getTransactionInfo = async (id: string) => {
    const { data } = await supabase
      .from("transacoes")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      try {
        const [senderName, receiverName] = await Promise.all([
          getUserNameById(data.remetente_id || ""),
          getUserNameById(data.receptor_id || ""),
        ]);
        setTransactionInfo({
          id: data.id,
          date: formatDateTime(data.criado_em),
          amount: `M$ ${formatCurrency(Number(data.valor))}`,
          sender: senderName,
          receiver: receiverName,
          remetente_id: data.remetente_id || "[error]",
          receptor_id: data.receptor_id || "[error]",
        });
        setErrorLoading(false);
      } catch (err) {
        setErrorLoading(true);
        console.log("Erro ao buscar nomes dos usuários.", err);
      }
    } else {
      setErrorLoading(true);
      console.log("Transação não encontrada.");
    }
  };

  useEffect(() => {
    if (transaction_id) {
      getTransactionInfo(transaction_id);
      setLoading(false);
    }
  }, [transaction_id]);

  return (
    <>
      {!errorLoading ? (
        <div className="flex-col align-left gap-10 padding-25 desktop-fit">
          <h1 className="text-2xl font-bold">
            Comprovante de Transferência PIX
          </h1>

          {!loading && (
            <>
              <p>
                <strong>ID da Transação:</strong> {transaction_id}
              </p>
              <p>
                <strong>Valor Transferido:</strong> {transactionInfo.amount}
              </p>
              <p>
                <strong>Data e Hora:</strong> {transactionInfo.date}
              </p>
              <p>
                <strong>Origem:</strong> {transactionInfo.sender} (ID:{" "}
                {transactionInfo.remetente_id})
              </p>
              <p>
                <strong>Destino:</strong> {transactionInfo.receiver} (ID:{" "}
                {transactionInfo.receptor_id})
              </p>
            </>
          )}

          <p className="margin-t-10">
            Você também encontra este comprovante no seu histórico de
            transações.
          </p>

          <div className="flex-row gap-10">
            <button
              className="button w-100p margin-t-10"
              onClick={() => (location.href = "/dashboard")}
            >
              Voltar ao Dashboard
            </button>
          </div>

          <p className="text-gray text-center">
            O Acamp Finance é um sistema feito para fins de entretenimento e
            este documento não envolve dinheiro de verdade.
          </p>
        </div>
      ) : (
        "Erro ao carregar a transação. Verifique o ID ou tente novamente mais tarde."
      )}
    </>
  );
};

// Função utilitária para formatar data/hora
function formatDateTime(dateString: string): string {
  if (!dateString) return "[erro de data]";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default PixSuccess;
