import JsZip from 'jszip';
import { useState } from 'react';
import { generateFullPathFileName } from './utils';
import { saveAs } from 'file-saver'

export interface IZipFile {
    file_name: string;
    file_extension: string;
    file_parent_folder: string;
    file?: JsZip.JSZipObject;
    is_new?: boolean
    new_file?: File
}

export const useZipFile = () => {
    const [zipFiles, setZipFiles] = useState<IZipFile[]>([]);

    const setFile = (file: File) => {
        JsZip.loadAsync(file).then((zip) => {
            console.log('zip files', zip.files)
            setZipFiles(Object.values(zip.files).map(file => ({
                file_name: (file.name.split('/').pop() || file.name).split('.').shift() || '',
                file_extension: file.name.split('.').pop() || '',
                file_parent_folder: file.name.split('/').slice(0, -1).join('/'),
                file
            })))
        });
    }

    const updateFileName = (index: number, newFileName: string) => {
        setZipFiles(prev => {
            const newFiles = [...prev];
            newFiles[index] = { // creating a new object to avoid updating copies of the object via pass by reference
                file: newFiles[index].file,
                file_extension: newFiles[index].file_extension,
                file_parent_folder: newFiles[index].file_parent_folder,
                file_name: newFileName,
                is_new: newFiles[index].is_new,
                new_file: newFiles[index].new_file,

            };
            return newFiles;
        })
    }

    const copyFile = (index: number) => {
        setZipFiles(prev => {
            const newFiles = [...prev];
            newFiles.splice(index, 0, newFiles[index]);
            return newFiles;
        })
    }

    const addFile = (newFile: File) => {
        setZipFiles(prev => {
            const newFiles = [...prev];
            newFiles.push({
                file_name: newFile.name.split('.').shift() || '',
                file_extension: newFile.name.split('.').pop() || '',
                file_parent_folder: '',
                is_new: true,
                new_file: newFile

            });
            return newFiles;
        })
    }

    const saveAsZip = async () => {
        let zip = new JsZip()

        console.log('ZipFiles', zipFiles)

        for (const zipFile of zipFiles) {
            const completeFileName = generateFullPathFileName(zipFile)

            const data: ArrayBuffer | undefined = zipFile.is_new
                ? await zipFile.new_file?.arrayBuffer()
                : await zipFile.file?.async('arraybuffer')

            console.log('Data', completeFileName, data)

            zip = zip.file(completeFileName, data!)
        }

        saveAs(await zip.generateAsync({type: 'blob'}))
    }

    return {
        setFile,
        updateFileName,
        copyFile,
        addFile,
        saveAsZip,
        zipFiles,
    }
}

export type useZipFileType = ReturnType<typeof useZipFile>;
