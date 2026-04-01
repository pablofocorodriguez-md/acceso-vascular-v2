import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Adulto from './pages/Adulto';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/adulto" element={<Adulto />} />
      </Routes>
    </BrowserRouter>
  );
}
