import JsZip from 'jszip';
import { useCallback, useState } from 'react';

export const useZipFile = () => {
    const [zipFiles, setZipFiles] = useState<JsZip.JSZipObject[]>([]);

    const setFile = useCallback((file: File) => {
        JsZip.loadAsync(file).then((zip) => {
            console.log('files', zip.files);
            setZipFiles(Object.values(zip.files));
        });
    }, [])

    return { setFile, zipFiles }
}

export type useZipFileType = ReturnType<typeof useZipFile>;
