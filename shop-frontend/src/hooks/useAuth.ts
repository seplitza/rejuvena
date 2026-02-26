import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { initAuth, selectAuthLoading, selectIsAuthenticated, selectUser } from '@/store/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);

  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
  };
};
