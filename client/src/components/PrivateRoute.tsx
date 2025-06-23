import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
  const { currentUser } = useSelector((state: any) => state.user); // TODO: Replace 'any' with your RootState type for better type safety

  return currentUser ? <Outlet /> : <Navigate to="/signin" />; // ✅ fixed path and closing tag
}
