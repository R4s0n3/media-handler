'use client'
import { api } from "@/trpc/react"

import { Check, Plus, XIcon } from "lucide-react"
import { type FormEvent, useState } from "react"



export default function CreateKey(){
    const [createMode, setCreateMode] = useState(false)
    const [error, setError] = useState("")
    const [keyName, setKeyName] = useState<string>("")
    const utils = api.useUtils()
    const {mutateAsync:createNewKey} = api.key.create.useMutation({
        onSuccess:async () => {
            setCreateMode(false)
            setKeyName("")
            await utils.key.invalidate()
        },
        onError:(err) =>{
            setError(err.message)
            setTimeout(() => {
                setError("")
            },2000)
        }
    })

    async function handleSubmitForm(event:FormEvent){
        event.preventDefault()
        event.stopPropagation()
        await createNewKey({
            name: keyName
        })
    }
    return <div className="w-full max-w-xl">
    {createMode ? <form onSubmit={handleSubmitForm}>
        <div className="flex gap-2">
        <input maxLength={18}  className="w-full p-2 rounded" onChange={e => setKeyName(e.target.value)} placeholder="key-name (optional)" value={keyName ?? undefined} />
        <button type="submit"  className="p-2 bg-highlight-green/30 hover:bg-highlight-green/50 transition duration-300 rounded text-pirrot-blue-50"><Check /></button>
        <button onClick={() => {
            setKeyName("")
            setCreateMode(false)
            }}  type="button" className="p-2 bg-pirrot-red-400/30 hover:bg-pirrot-red-400/50 transition duration-300 rounded text-pirrot-blue-50"><XIcon /></button>
        </div>
    </form> : <button type="button" onClick={() => setCreateMode(true)} className="flex gap-2 items-center  bg-pirrot-red-400 p-2 px-4 rounded text-pirrot-blue-50"><Plus  size={25} /><span>CREATE KEY</span></button>}
    {error && <span className="font-mono text-sm text-pirrot-red-400">{error}</span>}
</div>
}