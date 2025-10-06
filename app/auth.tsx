import { useAuth } from "../lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { 
    KeyboardAvoidingView, 
    Platform, 
    View,
    StyleSheet
}  from "react-native";

import {Button, Text, TextInput, useTheme} from "react-native-paper"

export default function AuthScreen() {
        const [isSignUp, setIsSingUp] = useState<boolean>(false);
        const [email, setEmail] = useState<string>("")
        const [password, setPassword] = useState<string>("")
        const [error, setError] = useState <string | null > ("")
        const theme = useTheme();

        const {signIn, signUp} = useAuth();
        const router = useRouter()

        const handleAuth = async () =>{

            if (!email || !password) {
                setError("Por favor complete todos os campos.");
                return;
            }

            if (password.length < 6) {
                setError("As senhas devem ter no minímo 6 caracteres.");
                return;
            }


            setError(null);


            if (isSignUp) {
                const error = await signUp(email,password)
                if (error) {
                    setError (error);
                    return; 
                }
            } else {
                  const error =  await signIn(email,password)
                  if (error) {
                    setError (error); 
                    return;
                  }
                  router.replace("/");
            }
            
        }; 



        const handleSwitchMode = () => {
            setIsSingUp((prev) => !prev)

        }
        
        return (
            <KeyboardAvoidingView 
            behavior= {Platform.OS === "ios" ? "padding" : "height"}
            style = {styles.container}
            >

                <View style = {styles.content}>
                <Text style={styles.title} variant="headlineMedium">{isSignUp? "Crie sua Conta": "Bem Vindo de Volta"}</Text> 

                    <TextInput 
                        label= "Email" 
                        autoCapitalize="none" 
                        keyboardType="email-address"
                        placeholder="example@gmail.com"
                        style={styles.input}
                        mode = "outlined"
                        onChangeText={setEmail}
                    />

                    

                    <TextInput 
                        label= "Senha" 
                        autoCapitalize="none" 
                        secureTextEntry
                        mode = "outlined"
                        style={styles.input}
                        onChangeText={setPassword}
                    />

                    {error && (<Text style= {{ color: theme.colors.error}}>{error}</Text>)}

                    <Button mode="contained" style={styles.button} onPress={handleAuth}>
                        {isSignUp ? "Cadastrar" : "Entrar"} 
                    </Button>

                    <Button mode="text" 
                    onPress={handleSwitchMode}
                    style={styles.switchModeButton}
                    >
                         {isSignUp 
                         ? "Já tem uma conta? Entrar"
                         : "Não tem uma conta ? Cadastrar"}
                    </Button>

                </View>
            </KeyboardAvoidingView>
        );
} 


const styles = StyleSheet.create ({
        
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5"
    },

    content: {
        flex: 1,
        padding: 15,
        justifyContent: "center"
    },

    title: {
        textAlign:"center",
        marginBottom: 25,

    },

    input: {
        marginBottom: 16,
        backgroundColor: "#dcd5eb"

    },

    button: {
        
        marginTop: 8,

    },

    switchModeButton: {
        marginTop: 16
    }

})

