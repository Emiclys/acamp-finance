import { useEffect, useState } from "react";
import { formatCurrency } from "../utils/utils";
import supabase from "../supabase/supabase";
import { useAuth } from "../hooks/useAuth";
import "../index.css";
import "../style/dashboard.css";

interface Transaction {
  id: string;
  criado_em: string;
  remetente_id: string;
  receptor_id: string;
  valor: number;
  tipo: string;
}

const PAGE_SIZE = 10;

const AllTransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async (pageNum: number) => {
    setLoading(true);
    const from = (pageNum - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, count, error } = await supabase
      .from("transacoes")
      .select("*", { count: "exact" })
      .or(`remetente_id.eq.${userId},receptor_id.eq.${userId}`)
      .order("criado_em", { ascending: false })
      .range(from, to);
    if (data) {
      setTransactions(data as Transaction[]);
      setTotalPages(count ? Math.ceil(count / PAGE_SIZE) : 1);
    } else {
      setTransactions([]);
      setTotalPages(1);
      if (error) console.error("Erro ao buscar transações", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  return (
    <div className="flex-col gap-10 padding-25 desktop-fit">
      <div className="flex-col text-center margin-10">
        <span className="text-big">Todas as Transações</span>
        <span className="text-gray">
          Histórico completo das suas transações
        </span>
      </div>
      <button
        onClick={() => (location.href = "/dashboard")}
        className="button-gray"
      >
        Voltar ao dashboard
      </button>
      <div className="card">
        <div className="card-title">Transações</div>
        <div className="card-content">
          {loading ? (
            <span>carregando...</span>
          ) : transactions.length === 0 ? (
            <span className="text-gray">Nenhuma transação encontrada.</span>
          ) : (
            <ul
              style={{
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                margin: 0,
              }}
            >
              {transactions.map((tx) => {
                // Descobre se a transação foi enviada ou recebida pelo usuário logado
                // Para esta listagem global, vamos mostrar sempre o remetente e receptor
                // e colorir o valor: vermelho se enviado, verde se recebido (do ponto de vista do receptor)
                return (
                  <li
                    key={tx.id}
                    style={{
                      backgroundColor: "#303030",
                      borderRadius: 5,
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 12px",
                      width: "100%",
                    }}
                    onClick={() =>
                      (window.location.href = `/pixsuccess/${tx.id}`)
                    }
                  >
                    <span style={{ fontWeight: 600 }}>
                      {tx.remetente_id === userId
                        ? "Enviado para"
                        : "Recebido de"}{" "}
                      {tx.remetente_id === userId
                        ? tx.receptor_id
                        : tx.remetente_id}
                    </span>
                    <span
                      style={{
                        marginLeft: 8,
                        color:
                          tx.remetente_id === userId ? "#e74c3c" : "#27ae60", // vermelho para enviado
                        fontWeight: 600,
                      }}
                    >
                      M$ {formatCurrency(Number(tx.valor))}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="flex-row gap-10 margin-t-10 flex-center">
          <button
            className="button-gray"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </button>
          <span style={{ color: "#fff" }}>
            Página {page} de {totalPages}
          </span>
          <button
            className="button-gray"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllTransactionsPage;
