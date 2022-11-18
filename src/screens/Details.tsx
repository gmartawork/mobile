import { useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { api } from '../services/api';
import { PoolPros } from '../components/PoolCard'


interface RouteParams {
  id: string;
}

export function Details() {
  const [isLoading, setIsLoading] = useState(true); 
  const [poolDetails, setPoolDetails] = useState<PoolPros>({} as PoolPros)
  const route = useRoute();
  const toast = useToast();
  const { id } = route.params as RouteParams;

  async function fetchPoolDetails() {
    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${id}`);
      console.log(response.data.pools)

    } catch (error) {
      toast.show({
        title: 'não foi possível carregar os bolões',
        placement: 'top',
        bgColor: 'red.500',
       })
    } finally {
      setIsLoading(false);
    }    

  }

  useEffect(() =>{
    fetchPoolDetails();
  },[id])

  if(isLoading){
    return (
      <Loading />
    )
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title={id} 
      showBackButton 
      showShareButton
      />
    
    </VStack>
  )
}