import { generateFullPathFileName } from "@/lib/utils"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { IZipFile } from "@/lib/zip"
import { Button } from "../ui/button"
import React, { useCallback, useState } from "react"
import { Input } from "../ui/input"


export interface IFileListProps {
    files: IZipFile[]
    updateFileName?: ((index: number, newFileName: string) => void)
    copyFile?: ((index: number) => void)
}

export const FileList = ({ files, updateFileName, copyFile }: IFileListProps) => {
    const [renamingIndex, setRenamingIndex] = useState<number | null>(null)
    const [newFileName, setNewFileName] = useState<string>("")

    const handleInitiateRename = useCallback((file: IZipFile, i: number) => {
        return () => {
            setRenamingIndex(i)
            setNewFileName(file.file_name)
        }
    } ,[])

    const handleCopy = useCallback((i: number) => {
        return () => {
            if (copyFile) {
                copyFile(i)
            }
        }
    }, [])

    const handleRename = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewFileName(e.target.value)
    }, [])

    const handleSaveRename = useCallback(() => {
        if (updateFileName && renamingIndex !== null) {
            updateFileName(renamingIndex, newFileName)
        }
        setRenamingIndex(null)
        setNewFileName("")
    }, [newFileName, renamingIndex, updateFileName])

    const handleCancelRename = useCallback(() => {
        setRenamingIndex(null)
    }, [])

    const renderFileCell = (file: IZipFile, i: number) => {
        if (renamingIndex === i) { // we are renaming the file so show an input
            return (
                <Input
                    value={newFileName}
                    onChange={handleRename}
                />
            )
        }

        return generateFullPathFileName(file)
    }

    const renderActionsCell = (file: IZipFile, i: number) => {
        if (renamingIndex === i) {
            return (
                <div>
                    <Button onClick={handleCancelRename} className="mr-2 bg-red-500">Cancel</Button>
                    <Button onClick={handleSaveRename} className="bg-green-500">Save</Button>
                </div>
            )
        }

        return (
            <div>
                <Button onClick={handleInitiateRename(file, i)} className="mr-2 bg-blue-500">Rename</Button>
                <Button onClick={handleCopy(i)} className="bg-slate-400">Copy</Button>
            </div>
        )
    }

    return (
        <Table className="max-h-full">
            <TableCaption>Files of the Zipped Folder</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    files.map((file, index) => (
                        <TableRow key={index}>
                            <TableCell>{renderFileCell(file, index)}</TableCell>
                            <TableCell className="text-right">{renderActionsCell(file, index)}</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}
