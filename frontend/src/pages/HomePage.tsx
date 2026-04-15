import React, { Suspense, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  FaHeartbeat, FaBolt, FaShieldAlt, FaChartLine, FaArrowRight,
  FaCheck, FaUsers, FaRupeeSign, FaStar, FaPlay
} from 'react-icons/fa'
import CityScene3D from '../components/CityScene3D'
import PhoneModel3D from '../components/PhoneModel3D'
import { useTranslation } from 'react-i18next'

const Loader = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
  </div>
)

/* ── Scroll reveal hook ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ── Reusable reveal wrapper ── */
const Reveal = ({ children, className = '', dir = 'up', delay = 0 }: {
  children: React.ReactNode; className?: string; dir?: 'up'|'left'|'right'; delay?: number
}) => {
  const ref = useReveal()
  const cls = dir === 'left' ? 'reveal-left' : dir === 'right' ? 'reveal-right' : 'reveal'
  const delayClass = delay ? `delay-${delay}` : ''
  return <div ref={ref} className={`${cls} ${delayClass} ${className}`}>{children}</div>
}

const HomePage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ════════════════════════════════════════
          HERO — full viewport, split layout
      ════════════════════════════════════════ */}
      <section className="relative bg-white overflow-hidden min-h-screen flex items-center">

        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[700px] h-[700px] bg-red-50 rounded-full opacity-70 animate-blob" />
          <div className="absolute top-1/2 -left-24 w-[400px] h-[400px] bg-red-50 rounded-full opacity-40 animate-blob" style={{ animationDelay: '2s' }} />
          <div className="absolute -bottom-20 right-1/4 w-[300px] h-[300px] bg-orange-50 rounded-full opacity-50 animate-blob" style={{ animationDelay: '4s' }} />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(#dc2626 1px,transparent 1px),linear-gradient(90deg,#dc2626 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div className="animate-reveal-left">

              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-red-50 border border-red-100 rounded-full mb-8">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-600 text-sm font-semibold tracking-wide">{t('hero_badge')}</span>
              </div>

              <h1 className="font-black text-gray-950 leading-[1.05] tracking-tight mb-6"
                  style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}>
                {t('hero_title_1')}<br />
                {t('hero_title_2')} <span className="text-shimmer">{t('hero_title_3')}</span><br />
                <span className="text-red-600">{t('hero_title_4')}</span>
              </h1>

              <p className="text-gray-500 leading-relaxed mb-10 max-w-md font-light"
                 style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)' }}>
                {t('hero_desc')}
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/worker"
                  className="inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-red-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-300 text-base">
                  {t('hero_btn_worker')} <FaArrowRight className="text-sm" />
                </Link>
                <Link to="/admin"
                  className="inline-flex items-center gap-2.5 bg-white hover:bg-red-50 text-red-600 font-bold px-8 py-4 rounded-2xl border-2 border-red-200 hover:border-red-400 transition-all duration-200 hover:-translate-y-1 text-base">
                  <FaChartLine className="text-sm" /> {t('hero_btn_dashboard')}
                </Link>
              </div>

              <div className="flex flex-wrap gap-5 mb-10">
                {[t('hero_check_1'), t('hero_check_2'), t('hero_check_3')].map((text, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaCheck className="text-red-600 text-[9px]" />
                    </div>
                    {text}
                  </div>
                ))}
              </div>

              {/* Social proof */}
              <div className="inline-flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-3.5 shadow-lg">
                <div className="flex -space-x-2">
                  {['bg-red-400','bg-orange-400','bg-rose-500'].map((c,i) => (
                    <div key={i} className={`w-8 h-8 ${c} rounded-full border-2 border-white flex items-center justify-center`}>
                      <span className="text-white text-[10px] font-black">{['S','R','T'][i]}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 mb-0.5">
                    {[...Array(5)].map((_,i) => <FaStar key={i} className="text-yellow-400 text-[10px]" />)}
                  </div>
                  <p className="text-gray-600 text-xs font-semibold">{t('social_proof')}</p>
                </div>
              </div>
            </div>

            {/* Right — 3D City */}
            <div className="animate-reveal-right relative h-[560px] lg:h-[680px]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-50" />
              </div>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3.5 py-1.5 bg-white/90 backdrop-blur border border-red-100 rounded-full shadow-sm whitespace-nowrap">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[11px] font-semibold text-red-600 tracking-wide">{t('hero_live_badge')}</span>
              </div>
              <Suspense fallback={<Loader />}><CityScene3D /></Suspense>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-5 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-gray-100 shadow-sm whitespace-nowrap">
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

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce">
          <div className="w-5 h-8 border-2 border-gray-300 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-red-500 rounded-full animate-[float_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          MARQUEE TICKER
      ════════════════════════════════════════ */}
      <section className="bg-red-600 py-5 overflow-hidden">
        <div className="flex animate-[ticker_25s_linear_infinite] whitespace-nowrap">
          {[...Array(2)].map((_, ri) => (
            <div key={ri} className="flex items-center flex-shrink-0">
              {[
                { label: t('stats_workers'),    value: '100K+'   },
                { label: t('stats_claims'),     value: '₹5Cr+'   },
                { label: t('stats_uptime'),     value: '99.9%'   },
                { label: t('stats_avg_payout'), value: '2.4 min' },
                { label: t('stats_zones'),      value: '24'      },
                { label: t('stats_fraud'),      value: '2.1%'    },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-8 px-10 border-r border-red-500">
                  <div className="text-center">
                    <p className="text-white text-2xl font-black tracking-tight">{s.value}</p>
                    <p className="text-red-200 text-[11px] font-semibold uppercase tracking-widest">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURES — staggered card reveal
      ════════════════════════════════════════ */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <Reveal className="text-center mb-20">
            <p className="text-red-600 text-xs font-bold uppercase tracking-[0.2em] mb-3">{t('features_eyebrow')}</p>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              {t('features_title').split('\n').map((line, i) => (
                <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>
              ))}
            </h2>
            <p className="text-gray-400 mt-5 max-w-lg mx-auto text-base font-light">{t('features_desc')}</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: FaBolt,      title: t('feat_1_title'), desc: t('feat_1_desc'), bg: 'bg-red-50',    ic: 'text-red-600',    accent: 'group-hover:bg-red-600'    },
              { icon: FaChartLine, title: t('feat_2_title'), desc: t('feat_2_desc'), bg: 'bg-orange-50', ic: 'text-orange-500', accent: 'group-hover:bg-orange-500' },
              { icon: FaHeartbeat, title: t('feat_3_title'), desc: t('feat_3_desc'), bg: 'bg-rose-50',   ic: 'text-rose-500',   accent: 'group-hover:bg-rose-500'   },
              { icon: FaShieldAlt, title: t('feat_4_title'), desc: t('feat_4_desc'), bg: 'bg-red-50',    ic: 'text-red-700',    accent: 'group-hover:bg-red-700'    },
            ].map((f, i) => (
              <Reveal key={i} delay={(i * 100) as 100|200|300|400}>
                <div className="group bg-white border border-gray-100 rounded-3xl p-7 hover:border-transparent hover:shadow-2xl hover:shadow-red-100 hover:-translate-y-3 transition-all duration-500 flex flex-col h-full cursor-default">
                  <div className={`w-12 h-12 ${f.bg} ${f.accent} rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300 flex-shrink-0`}>
                    <f.icon className={`${f.ic} group-hover:text-white text-xl transition-colors duration-300`} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 tracking-tight">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS — alternating slide-in
      ════════════════════════════════════════ */}
      <section className="py-32 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <Reveal className="text-center mb-20">
            <p className="text-red-600 text-xs font-bold uppercase tracking-[0.2em] mb-3">{t('how_eyebrow')}</p>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">{t('how_title')}</h2>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Steps — slide from left */}
            <Reveal dir="left" className="space-y-5">
              {[
                { step: '01', title: t('step_1_title'), desc: t('step_1_desc'), detail: t('step_1_detail') },
                { step: '02', title: t('step_2_title'), desc: t('step_2_desc'), detail: t('step_2_detail') },
                { step: '03', title: t('step_3_title'), desc: t('step_3_desc'), detail: t('step_3_detail') },
              ].map((item, i) => (
                <div key={i} className={`flex gap-5 p-6 rounded-2xl transition-all duration-300 ${
                  i === 2
                    ? 'bg-red-600 shadow-xl shadow-red-200'
                    : 'bg-white border border-gray-100 hover:border-red-100 hover:shadow-lg'
                }`}>
                  <div className={`text-5xl font-black leading-none flex-shrink-0 ${i === 2 ? 'text-red-300' : 'text-red-100'}`}>
                    {item.step}
                  </div>
                  <div className="min-w-0">
                    <h3 className={`text-base font-bold mb-1.5 ${i === 2 ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                    <p className={`text-sm leading-relaxed mb-3 break-words ${i === 2 ? 'text-red-100' : 'text-gray-400'}`}>{item.desc}</p>
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${i === 2 ? 'bg-white/20 text-white' : 'bg-red-50 text-red-600'}`}>
                      {item.detail}
                    </span>
                  </div>
                </div>
              ))}
            </Reveal>

            {/* Phone — slide from right */}
            <Reveal dir="right">
              <div className="relative h-[540px] bg-gradient-to-br from-gray-50 via-red-50/30 to-white rounded-3xl border border-red-100 shadow-2xl shadow-red-100 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
                <Suspense fallback={<Loader />}><PhoneModel3D /></Suspense>
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-red-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur border border-red-100 rounded-full px-4 py-1.5 shadow-sm whitespace-nowrap">
                  <p className="text-xs font-semibold text-gray-600">₹450 payout · Rain disruption · Chennai South</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PLANS — scale-in on scroll
      ════════════════════════════════════════ */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <Reveal className="text-center mb-16">
            <p className="text-red-600 text-xs font-bold uppercase tracking-[0.2em] mb-3">{t('pricing_eyebrow')}</p>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
              {t('pricing_title').split(' ').slice(0,-2).join(' ')} <span className="text-red-600">{t('pricing_title').split(' ').slice(-2).join(' ')}</span>
            </h2>
            <p className="text-gray-400 mt-4 text-base font-light">{t('pricing_sub')}</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'DAILY',   price: '₹5',   period: '/day',   payout: '₹200',  popular: false, delay: 0   },
              { name: 'WEEKLY',  price: '₹25',  period: '/week',  payout: '₹500',  popular: true,  delay: 100 },
              { name: 'MONTHLY', price: '₹120', period: '/month', payout: '₹2000', popular: false, delay: 200 },
            ].map((plan, i) => (
              <Reveal key={i} delay={(plan.delay) as 0|100|200}>
                <div className={`relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-3 h-full ${
                  plan.popular
                    ? 'bg-red-600 shadow-2xl shadow-red-300'
                    : 'bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-red-100 hover:border-red-100'
                }`}>
                  {plan.popular && (
                    <div className="absolute top-0 inset-x-0 flex justify-center">
                      <div className="bg-white text-red-600 text-xs font-black px-5 py-1.5 rounded-b-xl shadow-sm">
                          {t('wp_most_popular')}
                        </div>
                    </div>
                  )}
                  <div className="p-8 pt-10 flex flex-col h-full">
                    <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${plan.popular ? 'text-red-200' : 'text-gray-400'}`}>{plan.name}</p>
                    <div className="flex items-end gap-1 mb-4">
                      <span className={`text-5xl font-black tracking-tight ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                      <span className={`text-sm mb-2 ${plan.popular ? 'text-red-200' : 'text-gray-400'}`}>{plan.period}</span>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-8 ${plan.popular ? 'bg-white/20 text-white' : 'bg-red-50 text-red-600'}`}>
                      <FaRupeeSign className="text-[10px]" /> {t('pricing_payout_label')} {plan.payout} {t('pricing_payout_suffix')}
                    </div>
                    <div className="mt-auto">
                      <Link to="/worker"
                        className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                          plan.popular
                            ? 'bg-white text-red-600 hover:bg-red-50 shadow-lg'
                            : 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-100'
                        }`}>
                        {t('pricing_get_started')} <FaArrowRight className="text-xs" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TRUST STRIP
      ════════════════════════════════════════ */}
      <Reveal>
        <section className="py-12 bg-gray-50 border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-10">
              {[
                { icon: FaBolt,      text: t('trust_instant')   },
                { icon: FaShieldAlt, text: t('trust_no_hidden') },
                { icon: FaHeartbeat, text: t('trust_ai')        },
                { icon: FaUsers,     text: t('trust_workers')   },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-gray-500 text-sm font-medium">
                  <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="text-red-600 text-sm" />
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ════════════════════════════════════════
          CTA — dramatic full-width
      ════════════════════════════════════════ */}
      <section className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="relative rounded-[2.5rem] overflow-hidden bg-red-600 p-16 md:p-24 text-center">

              {/* Animated background rings */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-white/15 rounded-full" />
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-500 rounded-full opacity-40" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-red-800 rounded-full opacity-30" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 border border-white/25 rounded-full mb-8">
                  <FaPlay className="text-white text-[10px]" />
                  <span className="text-white text-xs font-bold tracking-widest uppercase">{t('cta_badge')}</span>
                </div>

                <h2 className="font-black text-white tracking-tight mb-5 leading-tight"
                    style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
                  {t('cta_title').split('\n').map((line, i) => (
                    <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>
                  ))}
                </h2>

                <p className="text-red-100 mb-10 text-lg font-light max-w-md mx-auto">
                  {t('cta_desc')}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link to="/worker"
                    className="inline-flex items-center gap-2.5 bg-white text-red-600 hover:bg-red-50 font-bold text-base px-10 py-4 rounded-2xl shadow-xl transition-all hover:-translate-y-1">
                    {t('cta_btn')} <FaArrowRight />
                  </Link>
                  <Link to="/admin"
                    className="inline-flex items-center gap-2.5 bg-transparent border-2 border-white/40 hover:border-white text-white font-bold text-base px-8 py-4 rounded-2xl transition-all hover:-translate-y-1">
                    {t('hero_btn_dashboard')}
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  )
}

export default HomePage
