import { Models } from "react-native-appwrite";

export interface Metas extends Models.Document {
    user_id: string;
    title: string;
    descricao: string;
    frequencia: string;
    contagem_sequencia: number;
    ultima_vez: string;
    criado_em: string;
}


export interface HabitCompletion extends Models.Document {
    habit_id :string,
    user_id : string,
    completede_at:string,
}