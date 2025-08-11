// AuthProtect.jsx
import { Navigate } from 'react-router-dom';
import { UserData } from '@/context/UserContext';

const AuthProtect = ({ children }) => {
  const { isAuth } = UserData();
  return isAuth ? children : <Navigate to="/login" />;
};

export default AuthProtect;
