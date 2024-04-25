import { Input } from './components/ui/input'
import { Label } from './components/ui/label'


function App() {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      {/* BOX CONTAINER */}
      <div className="w-3/4 h-3/4 bg-gray-200 rounded-lg shadow-xl">
        <Label htmlFor='zipFile' className='block text-center text-2xl p-4'>Upload a zip file</Label>
        <Input id='zipFile' type='file' className='h-full text-center'/>
      </div>
      {/* END BOX CONTAINER */}
    </div>
  )
}


export default App
