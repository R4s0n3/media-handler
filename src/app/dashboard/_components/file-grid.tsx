'use client'
import { useState,useRef, useEffect } from "react"

import { calcSize, makeRandomNumber } from "@/util/functions";
import Modal from "@/app/_components/modal";
import { FileX2Icon, ImageIcon, XIcon } from "lucide-react";
import Image from "next/image"
import PreviewImage from "./preview-image";

type FileItem = {
    id: string;
    name: string;
    size: number;
    type: string;
}


    // function createDummies(_:unknown,idx:number){
    //     return {
    //             id: idx.toString(),
    //             name: `${makeRandomNumber()}${makeRandomNumber()}-${makeRandomNumber()}${makeRandomNumber()}${makeRandomNumber()}`,
    //             type: idx % makeRandomNumber() === 0 ? "application/pdf" : "image/png",
    //             size:Math.floor(Math.random() * 9999999),
    //             url: "/logo.png"
    //         }
    // }


export default function FileGrid(props: { files: FileItem[]}){

    const [sliceIdx, setSliceIdx] = useState(0)
    const [ gridFiles ] = useState<FileItem[]>(props.files)
    const [maxPerView, setMaxPerView] = useState(14)

    const [previewId, setPreviewId] = useState<string>()
    const currentFiles = gridFiles.slice(sliceIdx, sliceIdx + maxPerView)
    const containerRef = useRef<HTMLDivElement>(null)

    const pages = Math.round(gridFiles.length / maxPerView)
    const currentPage = Math.floor(sliceIdx / maxPerView) + 1

  const ITEM_WIDTH = 128 
  const ITEM_HEIGHT = 192
  const GAP = 16
 

  useEffect(() => {
   
  const updateMaxPerView = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth
      const containerHeight = containerRef.current.offsetHeight

      const itemsPerRow = Math
        .floor((containerWidth + GAP) / (ITEM_WIDTH + GAP))
        
      const availableHeight = containerHeight - 48

      const rowsPerView = Math
        .floor((availableHeight + GAP) / (ITEM_HEIGHT + GAP))

      const newMaxPerView = Math
        .max(1, itemsPerRow * rowsPerView)

      setMaxPerView(newMaxPerView)

      if (sliceIdx + newMaxPerView > gridFiles.length) {
        setSliceIdx(Math.max(0, gridFiles.length - newMaxPerView))
      }
    }
  }

    window.addEventListener("resize", updateMaxPerView)
    return () => window.removeEventListener("resize", updateMaxPerView)

  }, [gridFiles.length, sliceIdx])

    function renderFileGridItems(file:FileItem, idx:number){
        return <FileGridItem
            key={idx}
            onClickFileItem={(id:string) => setPreviewId(id)}
            {...file}
        />
    }

    return <>
    <Modal onClose={()=> setPreviewId(undefined)} selector="modal-hook" show={previewId !== undefined}>
    <div  className="size-full flex justify-center items-center absolute top-0 left-0 bg-info-950/90 z-50 p-4">
    <div className="w-full  max-w-2xl flex flex-col z-[60] items-center bg-pirrot-blue-50 aspect-square rounded relative">
        <div className="flex w-full  p-2">
<button className="z-50"  type="button" onClick={() => setPreviewId(undefined)}><XIcon /></button>
        </div>
<PreviewImage file={previewId} />
    </div>
    </div>
    </Modal>
    <div ref={containerRef} className="w-full h-full flex flex-col justify-between gap-8 ">
        <div className="flex flex-wrap gap-4">
        {currentFiles.map(renderFileGridItems)}
    </div>
    <div className="w-full flex justify-between">
        <button disabled={sliceIdx - maxPerView < 0} onClick={() => setSliceIdx(prev => prev -= maxPerView)} className="disabled:opacity-10 disabled:cursor-not-allowed p-2 px-6 bg-info-500/50 hover:bg-pirrot-blue-50/40 transition duration-300 cursor-pointer rounded">Prev</button>
        <span>Page {currentPage}/{pages === 0 ? 1 : pages}</span>
        <button disabled={sliceIdx + maxPerView >= gridFiles.length} onClick={() => setSliceIdx(prev => prev += maxPerView)} className="p-2 px-6 bg-info-500/50 hover:bg-pirrot-blue-50/40 transition duration-300 cursor-pointer disabled:opacity-10 disabled:cursor-not-allowed rounded">Next</button>
    </div>
    </div>
    </>
}


function FileGridItem(file:(FileItem&{onClickFileItem: (id:string) => void})){
    const { id, name, type, size, onClickFileItem } = file
    function renderIcon(mime:string){
        switch (mime) {
            case "application/pdf":
                return  <Image className="max-w-20" src={"pdf_white.svg"}  width={80} height={80} alt={"pdf icon"} />
        
            default:
    
                return <ImageIcon className="size-full max-w-20" />
        }
    }
    function handleClickFileItem(e: React.MouseEvent<HTMLDivElement>){
        e.preventDefault()
        e.stopPropagation()
        onClickFileItem(id)
    }
    return <div onClick={handleClickFileItem} className="w-32 transition duration-300 cursor-pointer group bg-pirrot-blue-950/20 rounded-md border-2 border-pirrot-blue-950/10 hover:border-pirrot-blue-50/50 drop-shadow flex flex-col">
    <div className="w-full bg-pirrot-blue-950/50 rounded-md rounded-b-none aspect-square relative overflow-hidden flex justify-center items-center">
    
   {renderIcon(type)}
    </div>
    <div className="p-2 flex flex-col gap-2">
        
    <div className="w-full flex flex-col">
    <h3 className="text-sm font-bold truncate">Filename:</h3>
    <h5 className="text-xs truncate">{name ?? "untitled file"}</h5>
    </div>
    <div className="w-full flex justify-between absolute top-1 left-0 px-2">
        <span className="uppercase font-bold text-xs">{type.split("/")[1]}</span>
        <span className="text-[10px] uppercase">{calcSize(size)}</span>
    </div>
    </div>
</div>
}