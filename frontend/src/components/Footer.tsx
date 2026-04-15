import React from 'react'
import { FaHeartbeat, FaTwitter, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

const Footer: React.FC = () => {
  const { t } = useTranslation()
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center">
                <FaHeartbeat className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-white">Carely</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer_desc')}
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors">
                <FaTwitter size={14} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors">
                <FaLinkedin size={14} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors">
                <FaGithub size={14} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{t('footer_product')}</h4>
            <ul className="space-y-2.5">
              {['Features', 'Pricing', 'Security', 'API'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 text-sm hover:text-red-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{t('footer_company')}</h4>
            <ul className="space-y-2.5">
              {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 text-sm hover:text-red-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{t('footer_contact')}</h4>
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <FaEnvelope size={12} className="text-red-400" />
              <span>suryapr.exe14@gmail.com</span>
            </div>
            <div className="mt-4 p-3 bg-red-600 bg-opacity-10 border border-red-600 border-opacity-20 rounded-xl">
              <p className="text-red-400 text-xs font-medium">{t('footer_hackathon')}</p>
              <p className="text-gray-400 text-xs mt-0.5">{t('footer_college')}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">{t('footer_rights')}</p>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <span>{t('footer_made')}</span>
            <FaHeartbeat className="text-red-500 mx-1" size={12} />
            <span>{t('footer_by')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
