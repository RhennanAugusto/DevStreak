import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account, APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID  } from "./appwrite";
import { router } from "expo-router";


// AuthContextType define o contrato do contexto de auth: quais dados e funções os componentes filhos poderão consumir (user, signUp, signIn)
type AuthContextType = {
    user: Models.User<Models.Preferences> | null;
    isLoadingUser: boolean;
    signUp: (email:string, password:string) => Promise<string | null> ;
    signIn: (email:string, password:string) => Promise<string | null> ;
    signOut: () => Promise<void>; 
}

const AuthContext = createContext <AuthContextType | undefined > (undefined)


export default function AuthProvider ({children}: {children: React.ReactNode}) {
     
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
        null
    );

    // começa com true pois no inicio sempre vamos fazer a checagem do user
    const [isLoadingUser, setIsLoadingUser] = useState <boolean> (true);

    useEffect (() => {
        getUser();
    }, [])

    const getUser = async () => {
        try{
            const session = await account.get()
            setUser(session)
        } catch (error) {
            setUser(null)
        } finally {
            setIsLoadingUser(false);
        }
    }
    
    const signUp =  async (email: string, password:string) => {
        try {
             await account.create(ID.unique(), email, password)
             await signIn (email, password);
             return null;
        } catch (error) {
            if (error instanceof Error) {
                return error.message;
            }

            return "Um erro ocorreu durante o login";
        }
    };

     const signIn=  async (email: string, password:string) => {
        try {
             await account.createEmailPasswordSession(email, password)
             const session = await account.get()
             setUser(session)
             return null;
        } catch (error) {
                if  (error instanceof Error) {
                    return error.message;
                }
                return "Um erro ocorreu durante a criação"
        }       

    };

      const signOut = async () => {
                try {
                    // 1) Cria JWT do usuário logado (auth sem cookies)
                    const { jwt } = await account.createJWT();

                    // 2) Chama a REST API: DELETE /account/sessions (apaga todas)
                    const res = await fetch(`${APPWRITE_ENDPOINT}/account/sessions`, {
                    method: "DELETE",
                    headers: {
                        "X-Appwrite-Project": APPWRITE_PROJECT_ID,
                        "Authorization": `Bearer ${jwt}`,
                    },
                    });

                    if (!res.ok) {
                    const body = await res.text();
                    console.log("[signOut] REST falhou:", res.status, body);
                    }
                } catch (e) {
                    console.log("[signOut] erro:", e);
                } finally {
                    // limpa estado e sai das abas
                    setUser(null);
                    router.replace("/auth"); // ou router.replace("/")
                }
        };
    
    return <AuthContext.Provider value = {{user, isLoadingUser, signUp, signIn, signOut}}>
        {children}
    </AuthContext.Provider>;
}


export function useAuth () {
        const context = useContext(AuthContext)
        if (context === undefined) {
            throw new Error ("useAuth deve estar dentro do Provider")
        }
        return context; 
}