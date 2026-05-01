import { Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import Work from './Work';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="work" element={<Work />} />
      </Route>
    </Routes>
  );
}
