import {View, StyleSheet, ScrollView} from "react-native";
import {Link} from "expo-router";
import { Redirect } from "expo-router";
import { Metas } from "@/types/database_type";
import { Button, Text, Surface } from "react-native-paper";
import { useAuth } from "@/lib/auth-context";
import { client,  databases, DATABASE_ID, HABITS_TABLE, RealTimeResponse, COMPLETIONS_COLLECTION_ID } from "@/lib/appwrite";
import { ID, Query } from "react-native-appwrite";
import { useEffect, useRef, useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CardTitle from "react-native-paper/lib/typescript/components/Card/CardTitle";
import { Swipeable } from "react-native-gesture-handler";

export default function Index() {
  const {signOut, user} = useAuth();
  const [metas, setMetas] = useState <Metas[]>([]); // Usando Generics para não ter erro com o Documents

  const swipeableRefs = useRef<{[key: string]: Swipeable | null}>({});

  useEffect(() => {
    //  Criação para fazer o Reload automatico ao criar uma meta
    if (user) {
      const channel  = `databases.${DATABASE_ID}.collections.${HABITS_TABLE}.documents`;
      const metasSubscription = client.subscribe(
        channel,
        (response: RealTimeResponse) =>{
            if (
                response.events.includes
                ("databases.*.collections.*.documents.*.create")
            ) {
              fetchHabits();
            } else if (
                response.events.includes
                ("databases.*.collections.*.documents.*.update")
            ) {
              fetchHabits();
            } else if (
                response.events.includes
                ("databases.*.collections.*.documents.*.delete")
            ) {
              fetchHabits();
            }
          }
      );

      fetchHabits();

      return () => {
        metasSubscription();
      };
    }
  
  }, [user]);

  const fetchHabits = async() => {
    try {
      const response = await databases.listDocuments<Metas>(
        DATABASE_ID,
        HABITS_TABLE,
        [Query.equal("user_id", user?.$id ?? "")]
      );
      setMetas(response.documents);
    } catch (error) {
      console.error(error);
    }
  }

  const renderLeftActions = () => (
    <View style={style.left}>
       <MaterialCommunityIcons
          name= "trash-can-outline"
          size={32}
          color={"#ffff"}
       />
    </View>
  );

  const handleDeleteHabit = async (id: string) => {
     try{
        await databases.deleteDocument(DATABASE_ID, HABITS_TABLE, id)
     } catch (error) {
          console.error(error)
     }
  };

  const handleCompleteHabit = async (id: string) => {
    if (!user) return;
     try{

        const currentDate = new Date().toISOString()
        await databases.createDocument(
          DATABASE_ID, 
          COMPLETIONS_COLLECTION_ID, 
          ID.unique(),
          {
              habit_id: id,
              user_id: user.$id,
              completede_at: currentDate,

          }
        );

        const habit = metas?.find((m) => m.$id === id);
          if (!habit) return;

          await databases.updateDocument(DATABASE_ID, HABITS_TABLE, id, {
            contagem_sequencia: habit.contagem_sequencia + 1,
            ultima_vez: currentDate,
          }
        );

     } catch (error) {
          console.error(error)
     }
  };


  const renderRightActions = () => (
    <View style={style.right}>
       <MaterialCommunityIcons
          name= "check-circle-outline"
          size={32}
          color={"#ffff"}
       />
    </View>
  );
  
   
  return (
    <View style={style.container}>
      <View style={style.header}>
          <Text variant="headlineSmall" style={style.title}>
              Metas do dia
          </Text>
          <Button mode="text" onPress={signOut} icon={"logout"}>
                 Sair 
          </Button>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {metas?.length === 0 ? (
          <View style={style.vazio1}><Text style={style.vazio2}>Sem metas ainda. Adicione sua primeira meta!</Text></View>
        ): (
          metas?.map((meta, key) => (
            <Swipeable ref= {(ref) => {
              swipeableRefs.current[meta.$id] = ref
              }}
              key={key}
              overshootLeft={false}
              overshootRight={false}
              renderLeftActions={renderLeftActions}
              renderRightActions={renderRightActions}
              onSwipeableOpen={(direction) => {
                  if (direction === "left") {
                    handleDeleteHabit(meta.$id);
                  } else if (direction === "right") {
                    handleCompleteHabit(meta.$id);
                  }

              }}  
            >
              <Surface key={key} style={style.card} elevation={0}>
                <View style={style.cardContent} >
                  <Text style={style.cardTitle}>{meta.title}</Text>
                  <Text style={style.cardDescricao}>{meta.descricao}</Text>
                  <View style={style.cardFooter}>
                      <View style={style.streak}><MaterialCommunityIcons 
                            name="fire" 
                            size= {19} 
                            color={"#ff9800"}/> 
                            {meta.contagem_sequencia < 1 ? (
                              <Text style={style.streaktext}>{meta.contagem_sequencia} dia de sequência</Text>
                            ) : (
                              <Text style={style.streaktext}>{meta.contagem_sequencia} dias de sequência</Text>
                            )}
                              
                      </View>
                      <View style={style.frequencia}>
                            <Text style={style.frequenciatexto}>{meta.frequencia}</Text>
                        </View>
                  </View>
                </View>
            </Surface>
          </Swipeable>
        ))
      )}
      </ScrollView>
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
    color:"purple"
  },

  card: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "#e1cae6ff",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  cardContent: {
    padding:20,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#22223b"
  },

  cardDescricao: {
    fontSize: 15,
    marginBottom: 16,
    color: "#4a4a50ff"
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  streak: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7edddff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  streaktext: {
    marginLeft: 3,
    color: "#fd9800ff",
    fontWeight: "bold",
    fontSize: 14,
  },

  frequencia: {
    backgroundColor: "#ede7f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },

  frequenciatexto: {
    color: "#000000ff",
    fontWeight: "bold",
    fontSize: 14,
  },

  vazio1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

  },

  vazio2: {
    color: "#666666"
  },

  right: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    backgroundColor: "#4caf50",
    borderRadius: 18,
    marginBottom:16,
    marginTop:1,
    paddingRight: 16
  },
   
  left: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: "#e53935",
    borderRadius: 18,
    marginBottom:16,
    marginTop:1,
    paddingLeft: 16 // aqui que eu controlo a distancia do icone para a margem do seu lado
  },



})


