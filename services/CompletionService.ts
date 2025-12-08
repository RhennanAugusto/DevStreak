import { COMPLETIONS_COLLECTION_ID, DATABASE_ID, databases } from "@/lib/appwrite";
import { HabitCompletion } from "@/types/database_type";
import { ID, Query } from "react-native-appwrite";

export class CompletionService {
  async listarPorUsuario(userId: string): Promise<HabitCompletion[]> {
    try {
      const response = await databases.listDocuments<HabitCompletion>(
        DATABASE_ID,
        COMPLETIONS_COLLECTION_ID,
        [Query.equal("user_id", userId)]
      );
      return response.documents;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async listarCompletacoesDeHoje(userId: string): Promise<HabitCompletion[]> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const response = await databases.listDocuments<HabitCompletion>(
        DATABASE_ID,
        COMPLETIONS_COLLECTION_ID,
        [
          Query.equal("user_id", userId),
          Query.greaterThanEqual("completede_at", today.toISOString()),
        ]
      );
      return response.documents;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async criar(completionData: {
    habit_id: string;
    user_id: string;
    completede_at: string;
  }): Promise<HabitCompletion> {
    try {
      const response = await databases.createDocument<HabitCompletion>(
        DATABASE_ID,
        COMPLETIONS_COLLECTION_ID,
        ID.unique(),
        completionData
      );
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

