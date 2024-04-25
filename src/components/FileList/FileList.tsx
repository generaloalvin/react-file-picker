import { generateFullPathFileName } from "@/lib/utils"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { IZipFile } from "@/lib/zip"


export interface IFileListProps {
    files: IZipFile[]
}

export const FileList = ({ files }: IFileListProps) => {
    return (
        <Table className="max-h-full">
            <TableCaption>Files of the Zipped Folder</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">File Name</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    files.map((file, index) => (
                        <TableRow key={index}>
                            <TableCell>{generateFullPathFileName(file)}</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}
