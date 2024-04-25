import JsZip from 'jszip';
import { useCallback, useState } from 'react';

export interface IZipFile {
    file_name: string;
    file_extension: string;
    file_parent_folder: string;
    file: JsZip.JSZipObject;
}

export const useZipFile = () => {
    const [zipFiles, setZipFiles] = useState<IZipFile[]>([]);

    const setFile = useCallback((file: File) => {
        JsZip.loadAsync(file).then((zip) => {
            console.log('zip files', zip.files)
            setZipFiles(Object.values(zip.files).map(file => ({
                file_name: (file.name.split('/').pop() || file.name).split('.').shift() || '',
                file_extension: file.name.split('.').pop() || '',
                file_parent_folder: file.name.split('/').slice(0, -1).join('/'),
                file
            })))
        });
    }, [])

    const updateFileName = useCallback((index: number, newFileName: string) => {
        setZipFiles(prev => {
            const newFiles = [...prev];
            newFiles[index] = { // creating a new object to avoid updating copies of the object via pass by reference
                file: newFiles[index].file,
                file_extension: newFiles[index].file_extension,
                file_parent_folder: newFiles[index].file_parent_folder,
                file_name: newFileName,
            };
            return newFiles;
        })
    }, [])

    const copyFile = useCallback((index: number) => {
        setZipFiles(prev => {
            const newFiles = [...prev];
            newFiles.splice(index, 0, newFiles[index]);
            return newFiles;
        })
    }, [])

    return { 
        setFile,
        updateFileName,
        copyFile,
        zipFiles,
    }
}

export type useZipFileType = ReturnType<typeof useZipFile>;
