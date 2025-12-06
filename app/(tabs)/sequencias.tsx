import { COMPLETIONS_COLLECTION_ID, DATABASE_ID, databases, HABITS_TABLE } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { HabitCompletion, Metas } from "@/types/database_type";
import { useEffect, useState } from "react";
import { View} from "react-native";
import { Query } from "react-native-appwrite";
import { Card,Text } from "react-native-paper";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function SequenciaScreen() {

    const [metas, setMetas] = useState <Metas[]>([]); // Usando Generics para não ter erro com o Documents
    // Armazena todas as metas criadas pelo usuário
    const [completadasMetas, setCompletadas] = useState<HabitCompletion[]>([]);
    const {user} = useAuth();

      useEffect(() => {
        //  Criação para fazer o Reload automatico ao criar uma meta
        // Sempre que o usuário existir (login feito),
        // busca tanto as metas quanto as metas concluídas no banco
        if (user) {
          
          fetchHabits();
          fetchCompletions();
        }
      
      }, [user]);


      const fetchHabits = async() => {
          try {
            const response = await databases.listDocuments<Metas>(
              DATABASE_ID,
              HABITS_TABLE,
              [Query.equal("user_id", user?.$id ?? "")] // filtro para trazer somente os documentos do usuário logado
            );
            setMetas(response.documents);
          } catch (error) {
            console.error(error);
          }
        };
      
        const fetchCompletions = async() => {
          try {
            const response = await databases.listDocuments<HabitCompletion>(
              DATABASE_ID,
              COMPLETIONS_COLLECTION_ID,
              [Query.equal("user_id", user?.$id ?? "")]
            );
            const completadas = response.documents
              setCompletadas(completadas);
          } catch (error) {
            console.error(error);
          }
        };

        interface StreakData {
            streak: number;
            bestStreak: number;
            total: number;
        }



        const getStreakData  = (metaId: string): StreakData  => {
            const metasCompletadas = completadasMetas?.filter(
                (c) => c.habit_id === metaId
            ).sort((a,b)  => 
                new Date(a.completede_at).getTime()- 
                new Date(b.completede_at).getTime()
            );

            if (metasCompletadas?.length === 0) {
                return { streak: 0,  bestStreak: 0, total: 0};
            }
            // criando o streak data
            let streak = 0;
            let bestStreak = 0;
            let total = metasCompletadas.length;

            let lastDate: Date | null = null;
            let  currentStreak = 0;

            metasCompletadas?.forEach((c) => {
                const date = new Date(c.completede_at)
                if (lastDate) {
                    const diff = 
                    (date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
                    
                    if (diff <= 1.5) {
                        currentStreak += 1
                    } else {
                        currentStreak = 1
                    }
                } else {
                    if (currentStreak > bestStreak) bestStreak = currentStreak;
                    streak = currentStreak
                    lastDate = date
                }
            });

            return {streak,  bestStreak, total}
        };   
    
        const metaSequencia = metas.map((metas) => {
                const {streak, bestStreak, total} = getStreakData(metas.$id);
                return {metas, bestStreak, streak, total};  // Criamos isso para ter acesso as nossas metas no objeto que anteriormente não era utilizado.
                
        })
        .filter((item) => item.total > 0); // So entra no rank o que foi completado já
        // Ordena o array `metaSequencia` em ordem crescente com base na propriedade `bestStreak`
        // ou seja, os hábitos com menor sequência vêm primeiro.
        const rankedHabits = metaSequencia.sort((a,b) => a.bestStreak - b.bestStreak)
        

    return (
        <View style={style.container}>
            <Text style={style.title}> Sequência de Metas </Text>

            {metas.length === 0 ? (
              <View>
                  <Text>
                      Sem metas ainda. Adicione sua primeira meta!
                  </Text>
                  </View>
            ): (
              <ScrollView showsHorizontalScrollIndicator={false}
              style={style.container}>
                {rankedHabits.map(({metas, streak, bestStreak, total}, key) => 
                  <Card key = {key} style={[style.card, key === 0  && style.firstcard]}>
                    <Card.Content>
                      <Text variant="titleMedium" style={style.habitTitle}>
                        {metas.title}
                      </Text>
                      <Text style={style.metaDescricao}>
                        {metas.descricao}
                      </Text>
                      <View style={style.statsRow}>
                          <View style={style.statBadge}>
                              <Text style={style.statsBadgeText}> 🔥{streak} </Text>
                              <Text style={style.statsLabel}> Atual </Text>
                          </View>
                          <View style={style.statsBadgeGold}>
                              <Text style={style.statsBadgeText}> 🏆 {bestStreak} </Text>
                              <Text style={style.statsLabel}> Melhor </Text>
                          </View>
                            <View style={style.statsBadgeGreen}>
                              <Text style={style.statsBadgeText}> ✅ {total} </Text>
                              <Text style={style.statsLabel}> Total </Text>
                          </View>
                      </View>
                    </Card.Content>
                  </Card>
                )}
                  </ScrollView>
                )}
          
        </View>
    );  
}

const style = StyleSheet.create({
   container: {
       flex: 1,
       padding: 16,
       backgroundColor: "#f5f5f5"
        
   },
   header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
  },
  title:{
    fontWeight: "bold",
    color:"purple",
    marginBottom:16
  },

  card: {
    marginBottom:16,
    borderRadius:18,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {width:0, height:2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth:1,
    borderColor: "#f0f0f0"
  },

  firstcard: {
    borderWidth:2,
    borderColor: "#7c4dff"
  },
  habitTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 2,
  },

  metaDescricao: {
    color: "#6c6c80",
    marginBottom: 8,

  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 8,
  },

  statBadge: {
    backgroundColor: "#fff3e0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    minWidth: 60,
  },

  statsBadgeGold: {
    backgroundColor: "#fffde7",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    minWidth: 60,
  },

  statsBadgeGreen: {
    backgroundColor: "#e8f5e9",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    minWidth: 60,
  },

  statsBadgeText:{
    fontWeight: "bold",
    fontSize: 15,
    color: "#22223b",
  },

  statsLabel:{
    fontSize: 11,
    color: "#888",
    marginTop: 2,
    fontWeight: 500,
  },
  
  

})