import { DATABASE_ID, databases, HABITS_TABLE } from "@/lib/appwrite";
import { Metas } from "@/types/database_type";
import { ID, Query } from "react-native-appwrite";

export class MetaService {
  async listarPorUsuario(userId: string): Promise<Metas[]> {
    try {
      const response = await databases.listDocuments<Metas>(
        DATABASE_ID,
        HABITS_TABLE,
        [Query.equal("user_id", userId)]
      );
      return response.documents;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async criar(metaData: {
    user_id: string;
    title: string;
    descricao: string;
    frequencia: string;
    contagem_sequencia: number;
    ultima_vez: string;
    criado_em: string;
  }): Promise<Metas> {
    try {
      const response = await databases.createDocument<Metas>(
        DATABASE_ID,
        HABITS_TABLE,
        ID.unique(),
        metaData
      );
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deletar(metaId: string): Promise<void> {
    try {
      await databases.deleteDocument(DATABASE_ID, HABITS_TABLE, metaId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async atualizar(metaId: string, data: Partial<Metas>): Promise<Metas> {
    try {
      const response = await databases.updateDocument<Metas>(
        DATABASE_ID,
        HABITS_TABLE,
        metaId,
        data
      );
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

