import { createContext, useState } from "react";

export const Context = createContext();


const ContextProvider = (props) =>{
    const backendUrl = import.meta.env.VITE_BACK_END_URL;
    const [token, settoken] = useState("");
    const val={
        backendUrl,token,settoken
    }
    return (
    <Context.Provider value={val}>{props.children}</Context.Provider>
  );
}


export default ContextProvider