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
