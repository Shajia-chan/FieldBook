import React from 'react';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next'; // <-- for multi-language

const Homepage = () => {
  const { t } = useTranslation(); // <-- t function to translate keys

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900">
                {t('hero.titlePrefix')}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  {t('hero.titleHighlight')}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                {t('hero.subtitle')}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/fields" 
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-semibold text-lg hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
              >
                {t('hero.browseFields')}
              </Link>
              <Link 
                to="/register" 
                className="px-8 py-4 bg-white text-green-700 border-2 border-green-600 rounded-full font-semibold text-lg hover:bg-green-50 transform hover:scale-105 transition-all"
              >
                {t('hero.getStarted')}
              </Link>
              <Link
                to="/staff-hiring"
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-semibold text-lg hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
              >
                {t('hero.hire')}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-green-600">50+</div>
                <div className="text-sm text-gray-600">{t('stats.fieldsAvailable')}</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-green-600">1000+</div>
                <div className="text-sm text-gray-600">{t('stats.happyPlayers')}</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-green-600">24/7</div>
                <div className="text-sm text-gray-600">{t('stats.bookingSupport')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('features.title')}</h2>
            <p className="text-xl text-gray-600">{t('features.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-4xl">⚽</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('features.premiumFields.title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('features.premiumFields.desc')}</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-4xl">📱</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('features.easyBooking.title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('features.easyBooking.desc')}</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-4xl">💳</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('features.flexiblePricing.title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('features.flexiblePricing.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('howItWorks.title')}</h2>
            <p className="text-xl text-gray-600">{t('howItWorks.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t('howItWorks.step1.title')}</h3>
              <p className="text-gray-600">{t('howItWorks.step1.desc')}</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t('howItWorks.step2.title')}</h3>
              <p className="text-gray-600">{t('howItWorks.step2.desc')}</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t('howItWorks.step3.title')}</h3>
              <p className="text-gray-600">{t('howItWorks.step3.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('cta.title')}</h2>
          <p className="text-xl text-green-50 mb-8">{t('cta.subtitle')}</p>
          <Link 
            to="/register" 
            className="inline-block px-10 py-4 bg-white text-green-700 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all shadow-xl"
          >
            {t('cta.button')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Homepage;

