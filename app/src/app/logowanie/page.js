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
import { BorderBeam } from "@/components/magicui/border-beam"
const pb = new PocketBase('http://172.16.15.138:8080');
//const pb = new PocketBase('http://192.168.0.150:8080');
export default function Log() {
  const [user,setUser] = useState(pb.authStore.record)
    if(user){
      window.location.href="/"
    }
    const [inputs, setInputs] = useState({login:null,password:null})
    const handleLogin = async ()=>{
        try{
            const authData = await pb.collection('users').authWithPassword(
                inputs.login,
                inputs.password,
            );
            if(typeof window !== "undefined"){
                
                  window.location.href="/"
                
                //   const sensitiveData = {oldPass: inputs.password}
                //   sessionStorage.setItem('sensitiveData', JSON.stringify(sensitiveData));
                //   router.push('/userVerify');
                console.log("dobrze")
                  
            }else{
                console.log("zle")
            }
        }catch(err){
            console.log(err)
        }}
    const handleInput = (e,target)=>{
        setInputs((prev)=>({...prev,[target]:e.target.value}))
    }
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        handleLogin(); // Wykonaj akcję, jak przy kliknięciu przycisku
      }
    };
    const handleReje = ()=>{
      window.location.href="/rejestracja"
    }
    return(
        <div className="flex flex-col justify-center items-center w-full h-[90vh]">
        <Card className=" relative w-[350px]">
      <CardHeader>
        <CardTitle className="flex justify-center">Logowanie</CardTitle>
      </CardHeader>
      <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="login" className="flex flex-row text-center items-center justify-between text-orange-400">E-mail</Label>
              <Input id="login" placeholder="Login" onChange={(e)=>{handleInput(e,"login")}} onKeyDown={handleKeyPress}/>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="pass" className="flex flex-row text-center items-center justify-between text-orange-400">Password</Label>
              <Input type="password" id="pass" placeholder="Password" onChange={(e)=>{handleInput(e,"password")}} onKeyDown={handleKeyPress}/>
            </div>
            
          </div>
          
      </CardContent>
      <CardFooter className="flex justify-center gap-2">
        <Button className="hover:bg-orange-400" onClick={handleLogin}>Zaloguj</Button>
        <Button className="hover:bg-orange-400" onClick={handleReje}>Zarejestruj się</Button>
      </CardFooter>
        <BorderBeam
        duration={6}
        size={400}
        className="from-transparent via-red-500 to-transparent"
      />
      <BorderBeam
        duration={6}
        delay={3}
        size={400}
        className="from-transparent via-blue-500 to-transparent"
      />
    </Card>
    </div>
    )
}
