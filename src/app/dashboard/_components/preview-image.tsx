'use client'
import { env } from "@/env"
import { api } from "@/trpc/react"
import { ArrowRight, Loader } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function PreviewImage(props:{file: string | undefined}){
    const {data:fileData, isLoading} = api.file.getById.useQuery({
        file: props.file!
    },{
        enabled: props.file !== undefined
    })
console.log("DA FILE: ", fileData)
const fileUrl = env.NEXT_PUBLIC_CDN_STORAGE_URL + fileData?.url

    if(!fileData && isLoading){
        return <div className="w-full aspect-square flex justify-center items-center">
            <Loader size={36}  className="animate-spin" />
        </div>
    }

    if(fileData?.mimeType.split("/")[1] === "pdf"){
        return <div className="w-full p-4 flex flex-col justify-between items-center aspect-square relative">
            <h2>File Name: {fileData.originalName}</h2>
            <Image className="w-32" src={"pdf.svg"}  width={256} height={256} alt={"pdf icon"} />

                   <Link className="flex gap-2 items-center justify-center p-2 px-4" rel="no-referrer" target="_blank" href={fileUrl}>PDF Preview <ArrowRight /></Link> 
        </div>
    }
    return <div className="w-full aspect-square relative">
<Image src={fileUrl ?? "default.png"} className="object-contain" fill alt={fileData?.fileName ?? "preview"} />
    </div>
}