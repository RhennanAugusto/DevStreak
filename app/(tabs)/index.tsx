import {View, StyleSheet} from "react-native";
import {Link} from "expo-router";
import { Redirect } from "expo-router";
import { Metas } from "@/types/database_type";
import { Button, Text, Surface } from "react-native-paper";
import { useAuth } from "@/lib/auth-context";
import { client,  databases, DATABASE_ID, HABITS_TABLE, RealTimeResponse } from "@/lib/appwrite";
import { Query } from "react-native-appwrite";
import { useEffect, useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CardTitle from "react-native-paper/lib/typescript/components/Card/CardTitle";

export default function Index() {
  const {signOut, user} = useAuth();
  const [metas, setMetas] = useState <Metas[]>([]); // Usando Generics para não ter erro com o Documents

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
      
      {metas?.length === 0 ? (
        <View style={style.vazio1}><Text style={style.vazio2}>Sem metas ainda. Adicione sua primeira meta!</Text></View>
      ): (
        metas?.map((meta, key) => (
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
        ))
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
  }

})


