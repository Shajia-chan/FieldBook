import React from 'react';
import { useTranslation } from 'react-i18next';

const StaffCard = ({ staff, onHire, onRelease }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center hover:scale-105 transition-transform">
      <h3 className="text-xl font-semibold text-gray-800 mb-1">{staff.name}</h3>
      <p className="text-gray-600 mb-1">{t('staffHiring.role')}: {staff.role}</p>
      <p className="text-gray-600 mb-1">{t('staffHiring.location')}: {staff.location}</p>
      <p className="text-gray-600 mb-3">{t('staffHiring.availability')}: {staff.available ? t('staffHiring.available') : t('staffHiring.notAvailable')}</p>

      {staff.available ? (
        <button
          onClick={() => onHire(staff._id)}
          className="px-4 py-2 rounded-full font-semibold text-white bg-green-600 hover:bg-green-700"
        >
          {t('staffHiring.hireButton')}
        </button>
      ) : (
        <button
          onClick={() => onRelease(staff._id)}
          className="px-4 py-2 rounded-full font-semibold text-white bg-red-600 hover:bg-red-700"
        >
          {t('staffHiring.releaseButton')}
        </button>
      )}
    </div>
  );
};

export default StaffCard;
















