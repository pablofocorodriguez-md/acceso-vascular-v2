import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Adulto from './pages/Adulto';
import Pediatrico from './pages/Pediatrico';
import Oncologia from './pages/Oncologia';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/adulto" element={<Adulto />} />
        <Route path="/pediatrico" element={<Pediatrico />} />
        <Route path="/oncologia" element={<Oncologia />} />
      </Routes>
    </BrowserRouter>
  );
}