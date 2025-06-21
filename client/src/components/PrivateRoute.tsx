import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user); // ✅ fixed hook and typo

  return currentUser ? <Outlet /> : <Navigate to="/signin" />; // ✅ fixed path and closing tag
}
