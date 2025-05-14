"use client"
import { useEffect,useState } from "react"
import { Car, TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  PolarAngleAxis, 
  Radar, 
  RadarChart,
} from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

import PocketBase, { ClientResponseError } from 'pocketbase';
import Link from "next/link"
import Menu from "@/components/ui/menu"
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

const pb = new PocketBase('http://172.16.15.138:8080');
//const pb = new PocketBase('http://192.168.0.150:8080');
export default function Podsumowania() {
  const [sesjons,setSesjons] = useState(null)
  const [quiz,setQuiz] = useState(null)
  const [html,setHtml] = useState(0)
  const [css,setCss] = useState(0)
  const [c,setC] = useState(0)
  const [javascript,setjavascript] = useState(0)
  const [php,setPhp] = useState(0)
  const [python,setPython] = useState(0)
  const [truel,setTruel] = useState(0)
  const [falsel,setFalsel] = useState(0)
  const [sum,setSum] = useState(0)
  const [user,setUser] = useState(pb.authStore.record)
  if(!user){
    window.location.href="/logowanie"
  }
   useEffect(()=>{
      const getHis = async()=>{
        try {
           const data = await fetch('http://172.16.15.138:5678/webhook/sesje')
          //const data = await fetch('http://192.168.0.150:5678/webhook/sesje')
          const json = await data.json()
          console.log(json.items)
          setSesjons(json.items)
          //const dane = await fetch('http://192.168.0.150:5678/webhook/history')
          const dane = await fetch('http://172.16.15.138:5678/webhook/history')
          const jotson = await dane.json()
          console.log(jotson.items)
          setQuiz(jotson.items)
          //licz()
          const records = await pb.collection('Sesje').getFullList({
              filter: `category='PHP' && id_usr='${user.id}'`,
          });
          setPhp(records.length)
          const records1 = await pb.collection('Sesje').getFullList({
              filter: `category="JavaScript" && id_usr="${user.id}"`,
          });
          setjavascript(records1.length)
          const records2 = await pb.collection('Sesje').getFullList({
              filter: `category="HTML" && id_usr='${user.id}'`,
          });
          setHtml(records2.length)
          const records3 = await pb.collection('Sesje').getFullList({
              filter: `category="CSS" && id_usr='${user.id}'`,
          });
          setCss(records3.length)
          const records4 = await pb.collection('Sesje').getFullList({
              filter: `category="Python" && id_usr='${user.id}'`,
          });
          setPython(records4.length)
          const records5 = await pb.collection('Sesje').getFullList({
              filter: `category="C" && id_usr='${user.id}'`,
          });
          setC(records5.length)
           const records6 = await pb.collection('Quiz').getFullList({
              filter: `usr_answer="true" && id_usr='${user.id}'`,
          });
          setTruel(records6.length)
          const records7 = await pb.collection('Quiz').getFullList({
              filter: `usr_answer="false" && id_usr='${user.id}'`,
          });
          setFalsel(records7.length)
          setSum(records6.length+records7.length)
        } catch (error) {
          console.log(error)
        }
      }
      getHis()
    },[])
    const chartData = [
      { month: "HTML", sesje: html },
      { month: "CSS", sesje: css },
      { month: "JavaScript", sesje: javascript },
      { month: "Python", sesje: python },
      { month: "C", sesje: c },
      { month: "PHP", sesje: php },
    ]
    const chartConfig = {
      sesje: {
        label: "Sesje",
        color: "hsl(var(--chart-1))",
      },
    }
    const chartData2 = [
  { poprawnosc: "Poprawne", odpowiedzi: truel, fill: "green" },
  { poprawnosc: "Błędne", odpowiedzi: falsel, fill: "red" },
]
const chartConfig2 = {
  poprawne: {
    label: "Poprawne",
    color: "green",
  },
  bledne: {
    label: "Błędne",
    color: "red",
  },
  
}
  return (
    <>
        <Menu></Menu>
    <div className="flex flex-row h-[95vh] w-[100%]">
    <div className="flex flex-col flex-wrap h-[95vh] w-[50%] rounded-md border">
      {sesjons && sesjons.map((item,idx)=>(
        item.id_usr==user.id?
        <Link key={idx} href={`/${item.nrsesji}`} className="w-[50vh]">
          <CardContainer className="inter-var h-auto w-[50vh] m-2">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="60"
          className="text-xl font-bold text-black dark:text-white"
        >
          Sesja {(item.sesja).substr(4,17)}
        </CardItem>
        <CardItem
          as="p"
          translateZ="80"
          className="text-xl font-bold text-orange-400 dark:text-white"
        >
          {item.category}
        </CardItem>
      </CardBody>
    </CardContainer>
          </Link>:<></>
))}
    </div>
    <div className="w-[50%] h-[95vh] flex-col">
    <Card className="h-[47.5vh]">
      <CardHeader className="items-center">
        <CardTitle>Twoje tematy</CardTitle>
        <CardDescription>
          Najczęściej wybierane przez ciebie tematy Quizów
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar
              dataKey="sesje"
              fill="orange"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
    <Card className="h-[47.5vh]">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-center">Twoja całkowita poprawność</CardTitle>
        <CardDescription className="text-center">Poprawność wszystkich twoich odpowiedzi</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig2}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData2}
              dataKey="odpowiedzi"
              nameKey="poprawnosc"
              innerRadius={60}
            >
            <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {((truel/sum)*100).toFixed(0)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                        {/* {tu moze byc txt} */}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
              </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
    </div>
    </div>
    </>
  )
}
