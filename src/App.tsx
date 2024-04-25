import { useCallback } from 'react'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { useZipFile } from './lib/extractor'
import { FileList } from './components/FileList/FileList'


function App() {
  const { setFile, zipFiles } = useZipFile()

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }, [])

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      {/* BOX CONTAINER */}
      <div className="w-3/4 h-3/4 bg-gray-200 rounded-lg shadow-xl">

        {
          zipFiles.length > 0
            ? <FileList files={zipFiles} />
            : (
              <div className='h-full'>
                <Label htmlFor='zipFile' className='block text-center text-2xl p-4'>Upload a zip file</Label>
                <Input id='zipFile' type='file' className='h-full text-center' accept='.zip' onChange={handleFileUpload} multiple={false} />
              </div>
            )
        }
      </div>

      {/* END BOX CONTAINER */}
    </div>
  )
}


export default App
