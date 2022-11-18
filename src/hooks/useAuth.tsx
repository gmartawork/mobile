import { useFormControl } from "native-base/lib/typescript/components/composites/FormControl";
import { useContext  } from "react";
import { AuthContext, AuthContextDataProps } from "../contexts/AuthContext";

export function useAuth(): AuthContextDataProps{
  const context = useContext(AuthContext)

  return context;
}