import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Create from './components/Create';
import Details from './components/Details';
import NotFound from './components/NotFound';
import Card from './components/Card';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/create" element={<PrivateRoute element={<Create />} />} />
      <Route
        path="/hotels/:id"
        element={<PrivateRoute element={<Details />} />}
      />
      <Route path="/" element={<PrivateRoute element={<Card />} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
