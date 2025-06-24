import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { formatCurrency } from "../utils/utils";
import QRCode from "react-qr-code";
import Button from "../components/base/Button";

const ChargePage = () => {
  const [formattedValue, setFormattedValue] = useState("");
  const [amountToCharge, setAmountToCharge] = useState("0");
  const [amount, setAmount] = useState("");
  const { userId } = useAuth();

  // Função para formatar o valor conforme digitado
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, ""); // remove tudo que não for número
    if (!raw) raw = "0";
    setAmount(raw);
    // Garante pelo menos 3 dígitos para centavos
    while (raw.length < 3) raw = "0" + raw;
    const numeric = parseFloat(raw) / 100;
    setAmountToCharge(numeric.toString().replace(".", ""));
    setFormattedValue(formatCurrency(numeric));
  };

  const getUserId = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.warn("Nenhum ID de usuário encontrado no localStorage.");
      return "";
    }
    return userId;
  };

  return (
    <div className="flex-col gap-10 padding-25 desktop-fit">
      <div className="flex-col text-center margin-10">
        <span className="text-big">Cobrar Merreca</span>
        <span className="text-gray">
          Solicite merreca de outros participantes do retiro
        </span>
      </div>

      <div className="card">
        <div className="card-title">Cobrar</div>
        <div className="card-content flex-col gap-10">
          <div className="flex-col gap-10">
            <span className="text-gray">Escaneie o QR Code:</span>
            <span>Valor a ser cobrado</span>
            <div className="flex-row flex-start">
              <span className="margin-h-10">M$</span>
              <input
                type="text"
                value={formattedValue}
                onChange={handleValueChange}
                disabled={false}
                placeholder="0,00"
                maxLength={14}
              />
            </div>
            <div
              style={{
                background: "white",
                padding: "16px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <QRCode
                value={
                  "http://" +
                  window.location.hostname +
                  "/send/?userId=" +
                  userId +
                  (amountToCharge != "0" ? "&amount=" + amount : "")
                }
              />
            </div>
          </div>
          <div className="flex-col gap-10">
            <span className="text-gray">Ou informe seu ID:</span>
            <span>{getUserId() || "[ID não encontrado]"}</span>
          </div>
        </div>
      </div>

      <Button
        label="Voltar"
        variant="secondary"
        onClick={() => (location.href = "/dashboard")}
      />
    </div>
  );
};

export default ChargePage;
