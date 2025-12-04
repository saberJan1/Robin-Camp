
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { CreateMovie } from './pages/CreateMovie';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateMovie />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
