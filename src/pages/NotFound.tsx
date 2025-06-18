const NotFound = () => {
  return (
    <div className="flex-col align-center gap-10 padding-25">
      <h1 className="text-2xl font-bold">Erro 404 - Página Não Encontrada</h1>
      <a
        style={{ textDecoration: "underline" }}
        onClick={() => (location.href = "/dashboard")}
      >
        Voltar ao Dashboard
      </a>
    </div>
  );
};

export default NotFound;
