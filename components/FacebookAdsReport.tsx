'use client'

import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Users, 
  MousePointer, 
  Eye, 
  Euro,
  Info,
  Calendar,
  BarChart3
} from 'lucide-react'
import Logo from './Logo'
import Tooltip from './Tooltip'

interface ReportData {
  client_name: string
  generated_at: string
  period: string
  summary: {
    total_ads: number
    total_impressions: number
    total_clicks: number
    total_spend: string
    total_reach: number
    avg_ctr: string
    avg_cpc: string
  }
  top_3_ads: Array<{
    ad_id: string
    ad_name: string
    clicks: number
    ctr: number
    cpc: number
    spend: number
    impressions: number
    reach: number
  }>
  client_report?: string
  agency_report?: string
}

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  tooltip: string
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, tooltip }) => (
  <div className={`metric-card border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <Tooltip content={tooltip}>
            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
          </Tooltip>
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="text-3xl opacity-20">
        {icon}
      </div>
    </div>
  </div>
)

interface FacebookAdsReportProps {
  clientName: string
}

const FacebookAdsReport: React.FC<FacebookAdsReportProps> = ({ clientName }) => {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const config = {
    agencyName: "inMetamorfosi",
    agencyWebsite: "https://inmetamorfosi.com"
  }

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/reports?client=${encodeURIComponent(clientName)}`)
        const result = await response.json()
        
        if (!response.ok) {
          throw new Error(result.error || 'Errore nel caricamento del report')
        }
        
        setReportData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto')
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [clientName])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-facebook-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento report...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h2 className="font-bold mb-2">❌ Report Non Trovato</h2>
            <p>{error}</p>
          </div>
          <p className="text-gray-600 mb-4">
            Verifica che il link sia corretto o contatta l'agenzia per assistenza.
          </p>
          <a 
            href={`mailto:info@${config.agencyName.toLowerCase()}.com`}
            className="cta-button"
          >
            Contatta {config.agencyName}
          </a>
        </div>
      </div>
    )
  }

  if (!reportData || !reportData.summary || !reportData.top_3_ads) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Nessun dato disponibile</p>
          <p className="text-sm text-gray-500">Il report per questo cliente non è ancora stato generato.</p>
        </div>
      </div>
    )
  }

  const tooltips = {
    investimento: "L'importo totale speso per tutte le campagne pubblicitarie nel periodo di riferimento.",
    clickTotali: "Il numero totale di click ricevuti su tutti gli annunci delle tue campagne.",
    personeRaggiunte: "Il numero di persone uniche che hanno visto almeno uno dei tuoi annunci.",
    ctrMedio: "Click-Through Rate: la percentuale di persone che hanno cliccato sul tuo annuncio dopo averlo visto. Un CTR più alto indica annunci più coinvolgenti.",
    impressioni: "Il numero totale di volte che i tuoi annunci sono stati mostrati agli utenti.",
    cpcMedio: "Costo Per Click: l'importo medio che paghi per ogni click sui tuoi annunci."
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex-1"></div>
          <a href={config.agencyWebsite} className="flex items-center justify-center">
            <Logo lightBackground={true} className="h-16 w-auto" />
          </a>
          <div className="flex-1 text-right">
            <p className="font-semibold text-gray-800">{reportData.client_name}</p>
            <p className="text-sm text-gray-600">Report Facebook Ads</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Header */}
        <div className="bg-gradient-to-r from-facebook-blue to-blue-600 text-white rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">📊 Report Performance</h1>
              <p className="text-blue-100 text-lg">{reportData.client_name}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-blue-100 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Periodo: {reportData.period}</span>
              </div>
              <div className="text-blue-100 text-sm">
                Generato il {reportData.generated_at}
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Investimento"
            value={`€${reportData.summary?.total_spend || '0.00'}`}
            icon={<Euro className="w-8 h-8" />}
            color="border-l-green-500"
            tooltip={tooltips.investimento}
          />
          <MetricCard
            title="Click Totali"
            value={(reportData.summary?.total_clicks || 0).toLocaleString()}
            icon={<MousePointer className="w-8 h-8" />}
            color="border-l-blue-500"
            tooltip={tooltips.clickTotali}
          />
          <MetricCard
            title="Persone Raggiunte"
            value={(reportData.summary?.total_reach || 0).toLocaleString()}
            icon={<Users className="w-8 h-8" />}
            color="border-l-purple-500"
            tooltip={tooltips.personeRaggiunte}
          />
          <MetricCard
            title="CTR Medio"
            value={`${reportData.summary?.avg_ctr || '0.00'}%`}
            icon={<TrendingUp className="w-8 h-8" />}
            color="border-l-success-green"
            tooltip={tooltips.ctrMedio}
          />
          <MetricCard
            title="Impressioni"
            value={(reportData.summary?.total_impressions || 0).toLocaleString()}
            icon={<Eye className="w-8 h-8" />}
            color="border-l-orange-500"
            tooltip={tooltips.impressioni}
          />
          <MetricCard
            title="CPC Medio"
            value={`€${reportData.summary?.avg_cpc || '0.00'}`}
            icon={<Euro className="w-8 h-8" />}
            color="border-l-red-500"
            tooltip={tooltips.cpcMedio}
          />
        </div>

        {/* Top 3 Ads */}
        <div className="section-card mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-facebook-blue" />
            <h2 className="text-2xl font-bold text-gray-900">🏆 Top 3 Annunci Performanti</h2>
          </div>
          
          <div className="grid gap-6">
            {(reportData.top_3_ads || []).map((ad, index) => (
              <div key={ad.ad_id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-facebook-blue text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <h3 className="font-semibold text-gray-900">{ad.ad_name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">ID: {ad.ad_id}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-medium text-gray-600">Spesa</p>
                    <p className="font-bold text-green-600">€{ad.spend}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-600">Click</p>
                    <p className="font-bold text-blue-600">{ad.clicks}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-600">Reach</p>
                    <p className="font-bold text-purple-600">{ad.reach.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-600">CTR</p>
                    <p className="font-bold text-success-green">{ad.ctr}%</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-600">Impressioni</p>
                    <p className="font-bold text-orange-600">{ad.impressions.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-600">CPC</p>
                    <p className="font-bold text-red-600">€{ad.cpc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis */}
        {reportData.client_report && (
          <div className="section-card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🤖 Analisi AI Personalizzata</h2>
            <div className="prose max-w-none">
              <div className="bg-blue-50 border-l-4 border-facebook-blue p-6 rounded-r-lg">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {reportData.client_report}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-lg font-semibold mb-2">{config.agencyName}</h3>
          <p className="text-gray-400 mb-4">
            Report generato automaticamente dal sistema di monitoraggio {config.agencyName}
          </p>
          <p className="text-sm text-gray-500">
            Per domande sul report, contatta il tuo account manager di riferimento
          </p>
        </div>
      </footer>
    </div>
  )
}

export default FacebookAdsReport 