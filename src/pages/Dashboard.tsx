import { useEffect, useState } from "react";
import { formatCurrency } from "../utils/utils";
import supabase from "../supabase";
import "../index.css";
import "../style/dashboard.css";
import { useAuth } from "../hooks/useAuth";
import type { RealtimeChannel } from "@supabase/supabase-js";

// Definição do tipo para transação
interface Transaction {
  id: string;
  criado_em: string;
  remetente_id: string;
  receptor_id: string;
  valor: number;
  tipo: string;
}

let channel: RealtimeChannel;

const Dashboard = () => {
  const [saldo, setSaldo] = useState(0);
  const [formattedSaldo, setFormattedSaldo] = useState("");
  const { userId } = useAuth();
  const [loadingSaldo, setLoadingSaldo] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  if (!userId) {
    location.href = "/"; // Redireciona para a página de login se o usuário não estiver logado
    return null; // Evita renderizar o componente se não houver usuário
  }

  if (!channel) {
    channel = supabase
      .channel("balance-refresh")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "usuarios",
        },
        (payload) => {
          const userData = payload?.new;

          if (userData?.id == userId) {
            setSaldo(Number(userData?.dinheiro));
            setFormattedSaldo(formatCurrency(Number(userData?.dinheiro)));
          }
        }
      )
      .subscribe();
  }

  const fetchSaldo = async () => {
    const { data } = await supabase
      .from("usuarios")
      .select("dinheiro")
      .eq("id", userId)
      .single();

    if (data) {
      setSaldo(data?.dinheiro);
      setFormattedSaldo(formatCurrency(data?.dinheiro));
      setLoadingSaldo(false);
    } else console.error("Erro ao buscar saldo");
  };

  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    const { data, error } = await supabase
      .from("transacoes")
      .select("*")
      .or(`remetente_id.eq.${userId},receptor_id.eq.${userId}`)
      .order("criado_em", { ascending: false })
      .limit(6);
    if (data) {
      setTransactions(data as Transaction[]);
    } else {
      setTransactions([]);
      if (error) console.error("Erro ao buscar transações", error);
    }
    setLoadingTransactions(false);
  };

  const gotoSettings = () => {
    location.href = "/settings";
  };

  useEffect(() => {
    fetchSaldo();
    fetchTransactions();
    console.log("Dashboard carregado para o usuário:", userId);
  }, [userId]);

  return (
    <div className="flex-col gap-10 padding-25 desktop-fit">
      <div className="flex-col text-center">
        <div className="flex-col margin-10">
          <span className="text-big">Acamp Finance</span>
          <span className="text-gray">
            Sistema Financeiro para Retiros Espirituais
          </span>
        </div>

        <div className="flex-col gap-10 margin-b-10">
          <div className="card">
            <div className="card-title">Saldo</div>
            <div className="card-content">
              <span>
                {loadingSaldo ? "carregando..." : "M$ " + formattedSaldo}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-row gap-10 margin-b-10">
          <button
            disabled={loadingSaldo}
            onClick={() => (location.href = "/send")}
            className="button w-100p"
          >
            Fazer um PIX
          </button>
          <button
            disabled={loadingSaldo}
            onClick={() => (location.href = "/charge")}
            className="button-gray w-100p"
          >
            Cobrar
          </button>
        </div>

        <div className="flex-row gap-10 margin-b-10">
          <button className="button-gray w-100p" onClick={gotoSettings}>
            Configurações
          </button>
        </div>

        <div className="card gap-10 margin-b-10">
          <div
            className="card-title"
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Histórico de Transações</span>
            <a
              href="/all-transactions"
              style={{
                color: "#27ae60",
                fontWeight: 600,
                textDecoration: "underline",
                fontSize: 16,
              }}
            >
              Ver todas
            </a>
          </div>
          <div className="card-content">
            {loadingTransactions ? (
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
                  width: "93%",
                }}
              >
                {transactions.map((tx) => (
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
                          tx.remetente_id === userId ? "#e74c3c" : "#27ae60",
                        fontWeight: 600,
                      }}
                    >
                      M$ {formatCurrency(Number(tx.valor))}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
