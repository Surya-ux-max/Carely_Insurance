import React, { Suspense } from 'react'
import { Link } from 'react-router-dom'
import { FaHeartbeat, FaBolt, FaShieldAlt, FaChartLine, FaArrowRight, FaCheck, FaUsers, FaRupeeSign } from 'react-icons/fa'
import CityScene3D from '../components/CityScene3D'
import PhoneModel3D from '../components/PhoneModel3D'
import { useTranslation } from 'react-i18next'


const Loader = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
  </div>
)

const HomePage: React.FC = () => {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[78vh]">

            {/* Left — Copy */}
            <div className="relative z-10 pb-16">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-red-50 border border-red-100 rounded-full mb-10">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-600 text-sm font-semibold tracking-wide">{t('hero_badge')}</span>
              </div>

              <h1 className="text-[3.6rem] md:text-[4.5rem] lg:text-[5rem] font-black text-gray-950 leading-[1.05] tracking-tight mb-7">
                {t('hero_title_1')}<br />
                {t('hero_title_2')} <span className="text-red-600">{t('hero_title_3')}</span><br />
                <span className="text-red-600">{t('hero_title_4')}</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-500 leading-relaxed mb-10 max-w-md font-light">
                {t('hero_desc')}
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white text-base font-bold px-8 py-4 rounded-2xl shadow-lg shadow-red-200 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <FaChartLine className="text-red-200" />
                  {t('hero_btn_dashboard')}
                  <FaArrowRight className="text-sm" />
                </Link>
                <Link
                  to="/worker"
                  className="inline-flex items-center gap-2.5 bg-white hover:bg-red-50 text-red-600 text-base font-bold px-8 py-4 rounded-2xl border-2 border-red-200 hover:border-red-400 transition-all duration-200 hover:-translate-y-0.5"
                >
                  {t('hero_btn_worker')}
                </Link>
              </div>

              <div className="flex flex-wrap gap-7">
                {[t('hero_check_1'), t('hero_check_2'), t('hero_check_3')].map((text, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaCheck className="text-red-600 text-[9px]" />
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — 3D City */}
            <div className="relative h-[520px] lg:h-[620px]">
              <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3.5 py-1.5 bg-white/90 backdrop-blur border border-red-100 rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[11px] font-semibold text-red-600 tracking-wide">{t('hero_live_badge')}</span>
              </div>
              <Suspense fallback={<Loader />}>
                <CityScene3D />
              </Suspense>
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-5 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                  <span className="w-2.5 h-2.5 bg-red-600 rounded-full" /> {t('hero_legend_worker')}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                  <span className="w-5 h-px bg-red-400 block" /> {t('hero_legend_link')}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                  <span className="w-2.5 h-2.5 bg-red-200 rounded-sm block" /> {t('hero_legend_zone')}
                </div>
              </div>
            </div>
          </div>
        </div>


      </section>

      {/* ════════════════════════════════
          STATS
      ════════════════════════════════ */}
      <section className="bg-red-600 py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              { icon: FaUsers,     value: '100K+', label: t('stats_workers') },
              { icon: FaRupeeSign, value: '₹5Cr+', label: t('stats_claims')  },
              { icon: FaShieldAlt, value: '99.9%', label: t('stats_uptime')   },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <s.icon className="text-red-300 text-xl mb-1" />
                <p className="text-5xl font-black text-white tracking-tight">{s.value}</p>
                <p className="text-red-200 text-sm font-medium tracking-wide uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FEATURES
      ════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-red-600 text-xs font-bold uppercase tracking-[0.2em] mb-3">{t('features_eyebrow')}</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">{t('features_title').split('\n').map((line, i) => <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>)}</h2>
            <p className="text-gray-400 mt-5 max-w-lg mx-auto text-lg font-light">{t('features_desc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: FaBolt,      title: t('feat_1_title'), desc: t('feat_1_desc'),       bg: 'bg-red-50',    ic: 'text-red-600'    },
              { icon: FaChartLine, title: t('feat_2_title'), desc: t('feat_2_desc'),   bg: 'bg-orange-50', ic: 'text-orange-500' },
              { icon: FaHeartbeat, title: t('feat_3_title'), desc: t('feat_3_desc'),    bg: 'bg-rose-50',   ic: 'text-rose-500'   },
              { icon: FaShieldAlt, title: t('feat_4_title'), desc: t('feat_4_desc'), bg: 'bg-red-50',    ic: 'text-red-700'    },
            ].map((f, i) => (
              <div key={i} className="group bg-white border border-gray-100 rounded-3xl p-7 hover:border-red-200 hover:shadow-xl hover:shadow-red-50 hover:-translate-y-2 transition-all duration-300">
                <div className={`w-13 h-13 w-12 h-12 ${f.bg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className={`${f.ic} text-xl`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════ */}
      <section className="py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-red-600 text-xs font-bold uppercase tracking-[0.2em] mb-3">{t('how_eyebrow')}</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">{t('how_title')}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — Steps */}
            <div className="space-y-6">
              {[
                {
                  step: '01',
                  title: t('step_1_title'),
                  desc: t('step_1_desc'),
                  detail: t('step_1_detail'),
                },
                {
                  step: '02',
                  title: t('step_2_title'),
                  desc: t('step_2_desc'),
                  detail: t('step_2_detail'),
                },
                {
                  step: '03',
                  title: t('step_3_title'),
                  desc: t('step_3_desc'),
                  detail: t('step_3_detail'),
                },
              ].map((item, i) => (
                <div key={i} className={`flex gap-5 p-6 rounded-2xl transition-all duration-300 ${i === 2 ? 'bg-red-600 text-white shadow-xl shadow-red-200' : 'bg-white border border-gray-100 hover:border-red-100 hover:shadow-md'}`}>
                  <div className={`text-4xl font-black leading-none flex-shrink-0 ${i === 2 ? 'text-red-300' : 'text-red-100'}`}>
                    {item.step}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold mb-1.5 tracking-tight ${i === 2 ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                    <p className={`text-sm leading-relaxed mb-2 ${i === 2 ? 'text-red-100' : 'text-gray-400'}`}>{item.desc}</p>
                    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${i === 2 ? 'bg-white/20 text-white' : 'bg-red-50 text-red-600'}`}>
                      {item.detail}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — 3D Phone */}
            <div className="relative">
              <div className="relative h-[520px] bg-gradient-to-br from-gray-50 via-red-50/30 to-white rounded-3xl border border-red-100 shadow-2xl shadow-red-100 overflow-hidden">
                {/* glow blob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
                <Suspense fallback={<Loader />}>
                  <PhoneModel3D />
                </Suspense>
                {/* LIVE badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-red-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
                </div>
                {/* bottom label */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur border border-red-100 rounded-full px-4 py-1.5 shadow-sm">
                  <p className="text-xs font-semibold text-gray-600">₹450 payout · Rain disruption · Chennai South</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          CTA
      ════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-red-600 rounded-[2rem] p-14 md:p-20 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-72 h-72 bg-red-500 rounded-full -translate-y-1/2 translate-x-1/3 opacity-25 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-red-800 rounded-full translate-y-1/2 -translate-x-1/3 opacity-20 pointer-events-none" />
            <div className="relative z-10">
              <FaHeartbeat className="text-red-300 text-4xl mx-auto mb-7" />
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-5 leading-tight">
                {t('cta_title').split('\n').map((line, i) => <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>)}
              </h2>
              <p className="text-red-200 mb-10 text-lg font-light max-w-sm mx-auto">
                {t('cta_desc')}
              </p>
              <Link to="/worker" className="btn-white text-base px-10 py-4 rounded-2xl shadow-xl">
                {t('cta_btn')} <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default HomePage
