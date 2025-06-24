import React, { useState } from "react";
import supabase from "../supabase/supabase";
import { useAuth } from "../hooks/useAuth";

type PasswordConfirmationModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
};

const PasswordConfirmationModal: React.FC<PasswordConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { userId } = useAuth();

  const handlePassword = (p: string) => {
    setPassword(p);
    setMessage("");
  };

  const handleConfirm = async () => {
    if (!password) return;

    const { data } = await supabase
      .from("usuarios")
      .select()
      .eq("id", userId)
      .eq("senha", password)
      .single();

    if (!data) {
      setMessage("Senha incorreta");
      return;
    }

    onConfirm(password);
    setPassword("");
  };

  const handleCancel = () => {
    setPassword("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="blackground flex centered">
      <div className="card">
        <div className="card-title">Confirme sua Senha</div>
        <div className="card-content gap-10 flex-col">
          <div className="flex-col flex-left">
            <span>Senha</span>
            <input
              type="password"
              onChange={(e) => handlePassword(e.target.value)}
            />
          </div>
          <div className="flex-col margin-10 text-center">{message}</div>
          <div className="flex-row gap-10">
            <button
              className="button w-100p"
              disabled={password.length < 6}
              onClick={handleConfirm}
            >
              Confirmar
            </button>
            <button className="button-gray w-100p" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordConfirmationModal;
