import MasonryBoard from './components/MasonryBoard'
import { CardProvider } from './store/CardStore'
import './App.css'

function App() {
  return (
    <CardProvider>
      <MasonryBoard />
    </CardProvider>
  )
}

export default App
