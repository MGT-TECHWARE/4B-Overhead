import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';

// Lazy-load every route that's not the home page so the initial bundle
// doesn't ship the /work gallery glob (71 image URLs) or the city page
// templates. Each route fetches its own chunk on first navigation.
const Work = lazy(() => import('./Work'));
const ServiceAreas = lazy(() => import('./ServiceAreas'));
const CityPage = lazy(() => import('./CityPage'));

function RouteFallback() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center">
      <div
        className="w-8 h-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin"
        aria-label="Loading"
      />
    </section>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="work"
          element={
            <Suspense fallback={<RouteFallback />}>
              <Work />
            </Suspense>
          }
        />
        <Route
          path="service-areas"
          element={
            <Suspense fallback={<RouteFallback />}>
              <ServiceAreas />
            </Suspense>
          }
        />
        <Route
          path="service-areas/:slug"
          element={
            <Suspense fallback={<RouteFallback />}>
              <CityPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
