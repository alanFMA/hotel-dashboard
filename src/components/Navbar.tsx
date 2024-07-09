import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthGoogleContext } from '../context/authGoogle';

const Navbar: React.FC = () => {
  const authContext = useContext(AuthGoogleContext);
  const navigate = useNavigate();

  if (!authContext) {
    throw new Error(
      'AuthGoogleContext must be used within an AuthGoogleProvider',
    );
  }

  const { signOut, user } = authContext;

  const handleSignOut = () => {
    signOut(() => navigate('/login'));
  };

  return (
    <nav className="navbar">
      <h1>Dashboard</h1>
      <div className="links">
        <Link
          to="/"
          style={{
            color: 'rgb(77, 77, 77)',
          }}
        >
          Hotéis
        </Link>
        <Link
          to="/create"
          style={{
            color: 'white',
            backgroundColor: 'rgb(77, 77, 77)',
            borderRadius: '8px',
          }}
        >
          Cadastro
        </Link>
        {user && (
          <button
            onClick={handleSignOut}
            style={{
              color: 'white',
              backgroundColor: 'red',
              borderRadius: '8px',
              marginLeft: '10px',
              padding: '8px 16px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
