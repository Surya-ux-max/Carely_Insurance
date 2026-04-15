import React from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'

const LANGUAGES = [
  { code: 'en', label: 'English',  native: 'English',  flag: '🇬🇧' },
  { code: 'ta', label: 'Tamil',    native: 'தமிழ்',    flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi',    native: 'हिंदी',    flag: '🇮🇳' },
]

interface Props {
  onClose: () => void
}

const LanguagePickerModal: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation()
  const [selected, setSelected] = React.useState(i18n.language || 'en')

  const handleContinue = () => {
    i18n.changeLanguage(selected)
    localStorage.setItem('carely_lang', selected)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 animate-fade-in">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200">
            <span className="text-white text-2xl font-black">C</span>
          </div>
        </div>

        <h2 className="text-2xl font-black text-gray-900 text-center tracking-tight mb-1">
          {t('lang_title')}
        </h2>
        <p className="text-gray-400 text-sm text-center mb-7">{t('lang_subtitle')}</p>

        <div className="space-y-3 mb-7">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => setSelected(lang.code)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-200 ${
                selected === lang.code
                  ? 'border-red-600 bg-red-50'
                  : 'border-gray-100 hover:border-red-200 hover:bg-red-50/50'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="text-left">
                <p className={`font-bold text-sm ${selected === lang.code ? 'text-red-600' : 'text-gray-900'}`}>
                  {lang.native}
                </p>
                <p className="text-gray-400 text-xs">{lang.label}</p>
              </div>
              {selected === lang.code && (
                <div className="ml-auto w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-red-200"
        >
          {t('lang_continue')} →
        </button>
      </div>
    </div>
  )
}

export default LanguagePickerModal
