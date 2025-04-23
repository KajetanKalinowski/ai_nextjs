'use client'
import { useState,useEffect } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { Button } from "@/components/ui/button"
  import PocketBase, { ClientResponseError } from 'pocketbase';
const pb = new PocketBase('http://172.16.15.138:8080');
export default function Rej() {
    const [inputs, setInputs] = useState({login:null,password:null,password2:null})
    const handleRej = async ()=>{
        try{
        const data = {
            "username": `${(inputs.login).replace("@","")}`,
            "email": `${inputs.login}`,
            "emailVisibility": true,
            "password": `${inputs.password}`,
            "passwordConfirm": `${inputs.password2}`,
            "name": `${(inputs.login).replace("@","")}`
        };
        console.log(data)
        const record = await pb.collection('users').create(data);
        if(typeof window !== "undefined"){
                
            window.location.href="/logowanie"
          
          //   const sensitiveData = {oldPass: inputs.password}
          //   sessionStorage.setItem('sensitiveData', JSON.stringify(sensitiveData));
          //   router.push('/userVerify');
          console.log("dobrze")
            
      }else{
          console.log("zle")
      }
    }catch(err){
        console.log(err)
    }
    }
    const handleInput = (e,target)=>{
        setInputs((prev)=>({...prev,[target]:e.target.value}))
    }
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
          handleRej(); // Wykonaj akcję, jak przy kliknięciu przycisku
        }
      };
    return(
        <div className="flex flex-col justify-center items-center w-full h-[90vh]">
        <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="flex justify-center">Rejestracja</CardTitle>
      </CardHeader>
      <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="login" className="flex flex-row text-center items-center justify-between">E-mail</Label>
              <Input id="login" placeholder="Login" onChange={(e)=>{handleInput(e,"login")}} onKeyDown={handleKeyPress}/>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="pass" className="flex flex-row text-center items-center justify-between">Password</Label>
              <Input type="password" id="pass" placeholder="Password" onChange={(e)=>{handleInput(e,"password")}} onKeyDown={handleKeyPress}/>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="pass" className="flex flex-row text-center items-center justify-between">Powtórz Password</Label>
              <Input type="password" id="pass" placeholder="Password" onChange={(e)=>{handleInput(e,"password2")}} onKeyDown={handleKeyPress}/>
            </div>
          </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={handleRej}>Zarejestruj</Button>
      </CardFooter>
    </Card>
    </div>
    )
}
