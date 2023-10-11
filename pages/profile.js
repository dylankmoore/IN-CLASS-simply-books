import React from 'react';
import { useAuth } from '../utils/context/authContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <>
      <h1>{user.displayName}</h1>
      <h2>{user.email}</h2>
    </>
  );
}
