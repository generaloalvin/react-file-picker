import JsZip from 'jszip';
import { useCallback, useEffect, useState } from 'react';
import { generateFullPathFileName, sleep } from './utils';
import { saveAs } from 'file-saver'
import { useInterval } from 'react-timing-hooks'

export interface IZipFile {
    file_name: string;
    file_extension: string;
    file_parent_folder: string;
    file?: JsZip.JSZipObject;
    is_new?: boolean
    new_file?: File
}

let zip: JsZip = new JsZip()

export const useZipFile = () => {
    const [zipFiles, setZipFiles] = useState<IZipFile[]>([]);
    const [copyTracker, setCopyTracker] = useState<{ [key: string]: number }>({})
    const [isSaving, setIsSaving] = useState(false)
    const [progress, setProgress] = useState(0)
    const [counter, setCounter] = useState(0)
    const { isPaused, isStopped, pause: pauseZipping, resume: resumeZipping, start: startZipping, stop:stopZipping } = useInterval(() => {
        setCounter(prev => prev + 1)
    }, 200)

    const updateZip = useCallback(async (i: number) => {
        setProgress(((i + 1) / zipFiles.length) * 100)
        const zipFile = zipFiles[i]
        const completeFileName = generateFullPathFileName(zipFile)

        const data: ArrayBuffer | undefined = zipFile.is_new
            ? await zipFile.new_file?.arrayBuffer()
            : await zipFile.file?.async('arraybuffer')

        zip.file(completeFileName, data!)
    }, [zipFiles])

    useEffect(() => {
        const isCounterStarted = !isPaused && !isStopped

        if (counter === zipFiles.length && zipFiles.length > 0 && isSaving && isCounterStarted) {
            stopZipping()
            zip.generateAsync({ type: 'blob' })
                .then(data => {
                    saveAs(data)
                    setIsSaving(false)
                    console.log('New Zip File Saved.')
                })
            return
        }

        if (isCounterStarted) {
            console.log('Ziping %d', counter)
            updateZip(counter)
                .then(() => {})
        }

    }, [counter, isPaused, isStopped, zipFiles, isSaving, stopZipping, updateZip])

    const updateCopyTracker = (fileName: string) => {
        setCopyTracker((prev) => {
            const newCopyTracker = { ...prev }

            if (newCopyTracker[fileName] !== undefined) {

                newCopyTracker[fileName] = newCopyTracker[fileName] + 1
            } else {
                newCopyTracker[fileName] = 1
            }

            return newCopyTracker
        })
    }

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
        const isFileNameAlreadyExists = zipFiles.some((file, i) => {
            if (i === index) return false

            return file.file_parent_folder === zipFiles[i].file_parent_folder
                && newFileName === zipFiles[i].file_name
                && file.file_extension === zipFiles[i].file_extension
        })

        if (isFileNameAlreadyExists) {
            alert('Filename already exists.')
            return
        }


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
            newFiles.splice(index, 0, { // creating a new object to avoid updating copies of the object via pass by reference
                file: newFiles[index].file,
                file_extension: newFiles[index].file_extension,
                file_parent_folder: newFiles[index].file_parent_folder,
                file_name: newFiles[index].file_name + ` (${copyTracker[generateFullPathFileName(newFiles[index])] ?? 0})`,
                is_new: newFiles[index].is_new,
                new_file: newFiles[index].new_file,

            });
            return newFiles;
        })

        updateCopyTracker(generateFullPathFileName(zipFiles[index]))

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
        // let zip = new JsZip()

        console.log('ZipFiles', zipFiles)
        setIsSaving(true)
        setProgress(0)
        setCounter(0)
        zip = new JsZip()
        await sleep(500) // to give time for the progress bar to update

        // for (let i = 0; i < zipFiles.length; i++) {
            // setProgress(((i + 1) / zipFiles.length) * 100)
            // const zipFile = zipFiles[i]
            // const completeFileName = generateFullPathFileName(zipFile)

            // const data: ArrayBuffer | undefined = zipFile.is_new
            //     ? await zipFile.new_file?.arrayBuffer()
            //     : await zipFile.file?.async('arraybuffer')

            // console.log('Data', completeFileName, data)

            // zip.file(completeFileName, data!)
        // }

        startZipping()

        // saveAs(await zip.generateAsync({ type: 'blob' }))
        // setIsSaving(false)
    }

    return {
        setFile,
        updateFileName,
        copyFile,
        addFile,
        saveAsZip,
        pauseZipping,
        resumeZipping,
        zipFiles,
        progress,
        isSaving,
        isPaused,
    }
}

export type useZipFileType = ReturnType<typeof useZipFile>;
