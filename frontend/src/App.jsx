import { useState } from 'react';
import { ModeHeader } from './components/ModeHeader';
import { CustomerView } from './components/CustomerView';
import { AdminView } from './components/AdminView';
import './styles/App.css';

function App() {
  const [mode, setMode] = useState('customer');

  return (
    <div className="app">
      <ModeHeader mode={mode} onModeChange={setMode} />
      <main className="app__main">
        {mode === 'customer' ? <CustomerView /> : <AdminView />}
      </main>
    </div>
  );
}

export default App;
