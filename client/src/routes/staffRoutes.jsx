import React from 'react';
import { Route } from 'react-router-dom';
import StaffHiringPage from '../components/StaffHiringPage';

const StaffRoutes = () => (
  <>
    <Route path="/staff-hiring" element={<StaffHiringPage />} />
  </>
);

export default StaffRoutes;
