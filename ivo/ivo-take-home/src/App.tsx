import './App.css'
import Editor from './Editor';
// Import the JSON data
import inputData from './input.json';

function App() {
  return (
    <Editor input={{
      type: 'block',
      title: 'container',
      children: inputData,
      clauseLevel: 0,
      clauseNumbering: 1,
    }} />
  )
}

export default App
