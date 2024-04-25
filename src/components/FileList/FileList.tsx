import JSZip from "jszip"


export interface IFileListProps {
    files: JSZip.JSZipObject[]
}

export const FileList = ({files}: IFileListProps) => {
    return (
        <div>
            File List
        </div>
    )
}
