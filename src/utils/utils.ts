import supabase from "../supabase";

export function GenerateRandom(length: number): string {
  const characters = "1234567890";
  let userID = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    userID += characters[randomIndex];
  }

  return userID;
}

export function formatCurrency(value: number): string {
  return value
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export async function getUserNameById(id: string): Promise<string> {
  if (!id) {
    return "[Informe um ID válido]";
  }

  const { data, error } = await supabase
    .from("usuarios")
    .select("nome")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erro ao buscar nome do usuário:", error);
    return "[Usuário não encontrado]";
  }

  return data?.nome || "[Usuário não encontrado]";
}
