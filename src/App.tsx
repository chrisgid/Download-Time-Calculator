import viteLogo from '/vite.svg'
import './App.css'
import DownloadCalculator from './download-calculator';

function App() {

  return (
    <>
      <div>
          <img src={viteLogo} className="logo" alt="Vite logo" />
      </div>
      <h1>Calculate Download Time</h1>
      <DownloadCalculator />
    </>
  )
}

export default App;
