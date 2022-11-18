import { createContext, ReactNode, useState, useEffect } from "react";
import * as AuthSession from 'expo-auth-session';
import * as WebBrownser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import  { api } from '../services/api'

WebBrownser.maybeCompleteAuthSession()

interface UserProps {
  name: string;
  avatarUrl: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

export interface AuthContextDataProps {
  user: UserProps;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
}
export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {
const [isUserLoading, setUserLoading] = useState(false);
const [user, setUser] = useState<UserProps>({} as UserProps);


const [ request, response, promptAsync] = Google.useAuthRequest({
    clientId: '243637921252-i2pcn6sm3ik5c744k5r3l5n9gqfv11p0.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true}),
    scopes: ['profile', 'email']
  })

  async function signIn() {
    try{
      setUserLoading(true);
      await promptAsync();
    } catch (error){
      console.log(error);
      throw error;
    } finally{
      setUserLoading(false)
    }
  }

  async function signInWithGoogle(access_token: string) {
    console.log("TOKEN DE AUTENTICAÇÃO ===>", access_token )
    try{
      setUserLoading(true)

      const tokenResponse = await api.post('/users', { access_token });
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`

      const userInfoResponse = await api.get('/me');
      // console.log(userInfoResponse.data);
      setUser(userInfoResponse.data.user)

    }catch(error){
      console.log(error)
      throw error;
    } finally {
      setUserLoading(false);
    }

  }
    
  

  useEffect(() => {
    if(response?.type ==='success' && response.authentication?.accessToken){
      signInWithGoogle(response.authentication.accessToken);
    }
  },[response]);

  return (
    <AuthContext.Provider value={{
      signIn,
      isUserLoading,
      user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
