'use client'
import { api } from "@/trpc/react"
import { Copy, Eye, Loader, Trash } from "lucide-react"
import CreateKey from "./create-key"
import { useState } from "react"

export default function ApiKeySection () {
    const {data, isLoading} = api.key.getAll.useQuery()

    return <div className="flex-1 bg-pirrot-blue-900 rounded p-4 flex flex-col gap-4 justify-between min-h-96">
    <h2 className="text-2xl uppercase  font-bold">Api Keys</h2>
    {isLoading && !data ? <div className="w-full flex justify-center items-center"><Loader className="animate-spin" size={32} /></div> : <div className="p-4 gap-4 rounded-md max-h-64 shadow-inner shadow-pirrot-red-900/10 overflow-y-auto grid md:grid-cols-3">
        {data?.length === 0 && <span>no keys yet, create one below...</span>}
        {data?.map((item,idx) => <KeyGridItem key={idx}  item={{
            id: item.id,
            name:item.name,
            apiKey: item.key,
            usage: item.usage,
            createdAt: item.createdAt
        }} />)}
        </div>}
         <CreateKey />
        </div>
}

type KeyGridItemProps = {
    id: string,
    name: string,
    apiKey: string,
    usage: bigint,
    createdAt: Date
}

function KeyGridItem(props:{ item: KeyGridItemProps}){
    const {item } = props
    const [show, setShow] = useState(false)

    const utils = api.useUtils()
    const deleteApiKey = api.key.delete.useMutation({
        onSuccess: async () => {
            await utils.key.invalidate()
        }
    })
    async function handleCopy() {
       
        try {
          await navigator.clipboard.writeText(item.apiKey);
        } catch (err) {
            console.log(err)
        }
      }

      async function handleDelete() {
        await deleteApiKey.mutateAsync(item.id)
      }
    if(deleteApiKey.isPending) return <li className="flex flex-col gap-2 text-xl p-2 border rounded-md justify-center items-center" >
        <Loader className="animate-spin" size={32} />
    </li>
    return<li className="flex flex-col gap-2 text-xl p-2 border-2 rounded-md" >
    <div className="flex gap-2 flex-col">
    <div className="w-full flex justify-between">
        <h5 className="font-bold truncate pr-5">{item.name}</h5>
        <span className="text-sm">usage: {item.usage}</span>
    </div>
    <span className={` transition duration-500 text-xs p-1 px-2 bg-pirrot-blue-950 text-pirrot-blue-50 font-mono rounded`}><span className={!show  ? "blur-sm select-none font-bold" : ""}>
        {show ? item.apiKey : `${item.apiKey.slice(0, 7)}${'•'.repeat(20)}`}
        </span>
        </span>
    <span className="text-xs">created: {new Date(item.createdAt).toLocaleDateString()}</span>
    </div>
    <div className="flex gap-2 text-pirrot-blue-50">
        <button type="button" onClick={() => setShow(prev => !prev)} className="flex-1 text-sm flex gap-2 items-center justify-center border-2 border-pirrot-blue-50 hover:bg-pirrot-blue-50/20 hover:border-pirrot-blue-50/20 hover:text-pirrot-blue-50/20 transition duration-300 rounded p-0.5 px-2"><Eye size={16} /> view</button>
        <button onClick={handleCopy}  className="flex-1 text-sm flex gap-2 items-center justify-center border-2 border-pirrot-blue-50 hover:bg-pirrot-blue-50/20 hover:border-pirrot-blue-50/20 hover:text-pirrot-blue-50/20 transition duration-300 rounded p-0.5 px-2"><Copy size={16} /> copy</button>
        <button onClick={handleDelete} className="text-sm flex-1 flex gap-2 items-center justify-center border-2 border-pirrot-red-400 bg-pirrot-red-400 text-pirrot-blue-50 rounded p-0.5 px-2 hover:animate-pulse"><Trash size={16} /> delete</button>
    </div>
</li>
}