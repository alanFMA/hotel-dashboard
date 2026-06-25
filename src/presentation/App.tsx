import { Route, Routes } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { PrivateRoute } from './components/PrivateRoute';
import { CreateHotelPage } from './pages/CreateHotelPage';
import { DashboardPage } from './pages/DashboardPage';
import { HotelDetailsPage } from './pages/HotelDetailsPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/hotels/new"
          element={
            <PrivateRoute>
              <CreateHotelPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/hotels/:id"
          element={
            <PrivateRoute>
              <HotelDetailsPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
