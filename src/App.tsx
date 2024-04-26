import { useCallback } from 'react'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { useZipFile } from './lib/zip'
import { FileList } from './components/FileList/FileList'
import { Button } from './components/ui/button'


function App() {
  const { setFile, updateFileName, copyFile, addFile, saveAsZip, zipFiles } = useZipFile()

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }, [])

  const handleNewFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFile(e.target.files[0])
    }
  }, [])

  const handleSave = useCallback(() => {
    saveAsZip()
      .then(() => {
        console.log('New Zip File Saved.')
      })
      .catch((e) => {
        console.error(e)
        alert('An error occurred while saving the zip file.')
      })
  }, [zipFiles])

  return (
    <div className="flex flex-col gap-1 justify-center items-center w-screen h-screen">
      {
        zipFiles.length > 0
          ? (
            <div className='flex justify-end w-3/4 items-center'>
              <Label htmlFor='addFile' className='w-36'>Add New File:</Label>
              <Input id='addFile' type='file' title='Upload a new File' multiple={false} onChange={handleNewFileUpload} />
            </div>
          )
          : null
      }
      {/* BOX CONTAINER */}
      <div className="w-3/4 h-3/4 bg-gray-200 rounded-lg shadow-xl max-h-3/4 overflow-y-auto">
        {
          zipFiles.length > 0
            ? <FileList files={zipFiles} updateFileName={updateFileName} copyFile={copyFile} />
            : (
              <div className='h-full'>
                <Label htmlFor='zipFile' className='block text-center text-2xl p-4'>Upload a zip file</Label>
                <Input id='zipFile' type='file' className='h-full text-center' accept='.zip' onChange={handleFileUpload} multiple={false} />
              </div>
            )
        }
      </div>
      {/* END BOX CONTAINER */}
      {
        zipFiles.length > 0
          ? (
            <div className='flex w-3/4 justify-end'>
              <Button onClick={handleSave} className='bg-green-700 '>
                Save File
              </Button>
            </div>
          )
          : null
      }

    </div>
  )
}


export default App
