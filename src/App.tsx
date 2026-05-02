import { Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import Work from './Work';
import ServiceAreas from './ServiceAreas';
import CityPage from './CityPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="work" element={<Work />} />
        <Route path="service-areas" element={<ServiceAreas />} />
        <Route path="service-areas/:slug" element={<CityPage />} />
      </Route>
    </Routes>
  );
}
