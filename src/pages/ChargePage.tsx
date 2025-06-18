const ChargePage = () => {
  const getUserId = () => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      console.warn("Nenhum ID de usuário encontrado no localStorage.");
      return "";
    }
    return userId;
  };

  return (
    <div className="flex-col gap-10 padding-25">
      <div className="flex-col text-center margin-10">
        <span className="text-big">Cobrar Merreca</span>
        <span className="text-gray">
          Solicite merreca de outros participantes do retiro
        </span>
      </div>

      <div className="card">
        <div className="card-title">Cobrar</div>
        <div className="card-content flex-col gap-10">
          <span className="text-gray">
            Informe seu ID para que o outro possa fazer a transferência:
          </span>
          <span>{getUserId() || "[ID não encontrado]"}</span>
        </div>
      </div>

      <button
        onClick={() => (location.href = "/dashboard")}
        className="button-gray"
      >
        Voltar ao dashboard
      </button>
    </div>
  );
};

export default ChargePage;
