import { DATABASE_ID, databases, HABITS_TABLE } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, StyleSheet} from "react-native";
import { ID } from "react-native-appwrite";
import { Button, SegmentedButtons, TextInput, useTheme, Text } from "react-native-paper";

const FREQUENCIAS = ["Diário", "Semanal", "Mensal"]

type Frequencia = (typeof FREQUENCIAS) [number]

export default function MetasScreen() {
    const [title, setTitle] = useState<string> ("");
    const [descricao, setdescricao] = useState<string> ("");
    const [frequencia, setFrequencia] = useState<Frequencia> ("");
    const [error, setError] = useState<string>("");
    const {user} = useAuth();
    const router = useRouter();
    const theme = useTheme();

    const handleSubmit = async ()  => {
        if (!user) return;

        try {
        await databases.createDocument(
            DATABASE_ID, 
            HABITS_TABLE, 
            ID.unique(),
            {
                user_id: user.$id,
                title,
                descricao,
                frequencia,
                contagem_sequencia: 0,
                ultima_vez: new Date().toISOString(),
                criado_em: new Date().toISOString(),

            });

            router.back();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                return;
            }

            setError("Existe um erro ao criar a meta")
                
        }
    };

    
    return (
        <View style={styles.container}>
           <TextInput label= "Título" mode="outlined" style={styles.input} onChangeText={setTitle}/>
           <TextInput label= "Descrição" mode="outlined" style={styles.inputb} onChangeText={setdescricao}/>
           <View  style={styles.containerfrequency}>
                <SegmentedButtons 
                    value={frequencia}
                    onValueChange={(value) => setFrequencia(value as Frequencia)}  
                    buttons = {
                    FREQUENCIAS.map((freq) => ({
                        value:freq,
                        label:freq.charAt(0) + freq.slice(1)
                    }))
                }
                 />
           </View>
           <Button 
           mode="contained" 
           disabled={!title|| !descricao}
           onPress={handleSubmit}
           >
             Adicione uma meta
           </Button>
           {error && (<Text style= {{ color: theme.colors.error}}>{error}</Text>)}
        </View> 
    );  
}


const styles = StyleSheet.create({
    container: {
        flex:1,
        padding: 16,
        backgroundColor: "#f5f5f5f5",
        justifyContent: "center"
    },

    input: {
        marginBottom: 16,
    },

    inputb: {
        marginBottom: 20,
    },


    containerfrequency: {
        marginBottom: 24,
    },

})