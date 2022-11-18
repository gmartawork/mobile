import { Heading, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find(){
  const [isLoading, setIsLoading] = useState(false);
 
  const [code, setCode] = useState('');
  const toast = useToast();
  const { navigate } = useNavigation();

  async function handleJoinPool(){
    try {

      setIsLoading(true);

      if(!code.trim()) {
        setIsLoading(false);
        return toast.show({
          title: 'Informe o código',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      await api.post('/pools/join', { code });
      navigate('pools');

    } catch (error) {
      setIsLoading(false);
      console.log(error);

      toast.show({
        title: 'não foi possível encontrar o bolão',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
     
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por Código" showBackButton/>
      <VStack mt={8} mx={5} alignItems="center">
        <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
          Encontrar um bolão através do seu código único
        </Heading>

      <Input 
        mb={2}
        placeholder="Qual o código do bolão?"
        onChangeText={setCode}
        autoCapitalize="characters"
      />

      <Button 
        title="Buscar o Bolão"  
        isLoading={isLoading}
        onPress={handleJoinPool}
      />
      </VStack>
    </VStack>
  )

}