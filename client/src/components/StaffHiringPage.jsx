import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StaffCard from './StaffCard';
import { useTranslation } from 'react-i18next';

const StaffHiringPage = () => {
  const { t } = useTranslation();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const BASE_URL = 'http://localhost:3000/api/staff';

  useEffect(() => {
    axios.get(BASE_URL)
      .then(res => setStaffList(res.data))
      .catch(err => {
        console.error('Error fetching staff:', err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleHire = async (staffId) => {
    try {
      await axios.post(`${BASE_URL}/hire`, {
        staffId,
        userId: 'dummyUserId',
        date: new Date(),
        language: 'en'
      });
      
      // Refetch the entire list to ensure sync
      const res = await axios.get(BASE_URL);
      setStaffList(res.data);
      
      alert(t('staffHiring.hiredSuccess'));
    } catch (err) {
      console.error(err.response || err);
      alert(t('staffHiring.hiredFailed'));
    }
  };

  const handleRelease = async (staffId) => {
    try {
      await axios.post(`${BASE_URL}/release/${staffId}`);
      
      // Refetch the entire list to ensure sync
      const res = await axios.get(BASE_URL);
      setStaffList(res.data);
      
      alert(t('staffHiring.releasedSuccess'));
    } catch (err) {
      console.error(err.response || err);
      alert(t('staffHiring.releasedFailed'));
    }
  };

  if (loading) return <p className="text-center mt-10">{t('staffHiring.loading')}</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{t('staffHiring.noStaff')}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
        {t('staffHiring.title')}
      </h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {staffList.map(staff => (
          <StaffCard
            key={staff._id}
            staff={staff}
            onHire={handleHire}
            onRelease={handleRelease}
          />
        ))}
      </div>
    </div>
  );
};

export default StaffHiringPage;



















