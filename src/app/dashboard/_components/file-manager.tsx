'use client'
import { api } from "@/trpc/react";
import FileGrid from "./file-grid";

export default function FileManager () {
    const [filesData] = api.file.getLatest.useSuspenseQuery()
    return <div className="flex-1 lg:min-h-96 bg-pirrot-blue-900 rounded p-4 flex flex-col gap-4 relative">
    <h2 className="text-2xl uppercase  font-bold">File Manager</h2>
    <FileGrid files={filesData
        .map((f, i) => ({
            id: f.id, 
            name: f.originalName ?? f.fileName ?? `untitled file ${i}`,
            size: f.size,
            type:f.mimeType
        }))} />
        </div>
}