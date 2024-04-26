import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { useZipFile } from './lib/zip'
import { FileList } from './components/FileList/FileList'
import { Button } from './components/ui/button'
import { Progress } from './components/ui/progress'


function App() {
  const { setFile, updateFileName, copyFile, addFile, saveAsZip, pauseZipping, resumeZipping, progress, isPaused, isSaving, zipFiles } = useZipFile()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleNewFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFile(e.target.files[0])
    }
  }

  const handleSave = () => {
    saveAsZip()
      .then(() => {
        
      })
      .catch((e) => {
        console.error(e)
        alert('An error occurred while saving the zip file.')
      })
  }

  const handlePause = () => {
    pauseZipping()
  }

  const handleResume = () => {
    resumeZipping()
  }

  const renderBottom = () => {
    if (zipFiles.length === 0) return null

    const saveButton = (
      <Button onClick={handleSave} className='bg-green-700 '>
        Save File
      </Button>
    )

    const pauseButton = (
      <Button onClick={handlePause} className='bg-yellow-400'>
        Pause
      </Button>
    )

    const resumeButton = (
      <Button onClick={handleResume} className='bg-emerald-400'>
        Resume
      </Button>
    )

    return (
      <div className='flex w-3/4 justify-end gap-5'>
        <Progress value={progress} />
        {
          !isSaving && !isPaused
            ? saveButton
            : isSaving && !isPaused
              ? pauseButton
              : isSaving && isPaused
                ? resumeButton
                : null
        }
      </div>
    )
  }

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
      {renderBottom()}

    </div>
  )
}


export default App
