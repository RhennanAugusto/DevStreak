// app/index.tsx
import { Redirect } from "expo-router";
import { useAuth } from "../lib/auth-context"; 
import { Text} from "react-native-paper";
import { View } from "react-native";

export default function Index() {
  const { user, isLoadingUser } = useAuth();

  // Enquanto checa sessão, mostramos um loader
  if (isLoadingUser) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 48 }}>⏳</Text>
      </View>
    );
  }

  // Se tiver usuário autenticado, redireciona para as tabs
  return user ? <Redirect href="/(tabs)" /> : <Redirect href="/auth" />;
}
