'use client'
import Link from "next/link"
import { Button } from "./button"
import PocketBase, { ClientResponseError } from 'pocketbase';
const pb = new PocketBase('http://172.16.15.138:8080');
export default function Menu() {
    const wyloguj = ()=>{
        pb.authStore.clear()
        window.location.href="/logowanie"
      }
    return(
        <div className="h-[5vh] w-full flex flex-row justify-center items-center gap-5 bg-orange-400">
            <Link href={"/"}>Quiz</Link>
            <Link href={"/podsumowanie"}>Sesje</Link>
            <Button className="bg-orange-400 text-black hover:bg-orange-400" onClick={wyloguj}>Wyloguj</Button>
        </div>
    )
}