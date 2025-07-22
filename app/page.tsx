import React from 'react'
import { BarChart, Users, TrendingUp, Mail } from 'lucide-react'
import Logo from '../components/Logo'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center">
            <a href="https://inmetamorfosi.com">
              <Logo lightBackground={true} className="h-16 w-auto" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">📊 Report Ads</h1>
          <p className="text-xl mb-8 opacity-90">
            Piattaforma di reporting personalizzata per i nostri clienti
          </p>
          <p className="text-lg opacity-75">
            Monitora le performance delle tue campagne Facebook Ads in tempo reale
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <BarChart className="w-12 h-12 text-facebook-blue mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Report Automatici</h3>
            <p className="text-gray-600">
              Report generati automaticamente ogni settimana con le metriche più importanti
            </p>
          </div>
          
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-success-green mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Analisi Avanzate</h3>
            <p className="text-gray-600">
              Insights dettagliati elaborati con intelligenza artificiale per ottimizzare le performance
            </p>
          </div>
          
          <div className="text-center">
            <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Personalizzazione</h3>
            <p className="text-gray-600">
              Ogni report è personalizzato per le specifiche esigenze del cliente
            </p>
          </div>
        </div>
      </div>

      {/* Access Info */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Come Accedere al Tuo Report</h2>
          <div className="bg-blue-50 rounded-xl p-8 mb-8">
            <p className="text-lg text-gray-700 mb-4">
              Se sei un nostro cliente, accedi al tuo report personalizzato utilizzando il link che hai ricevuto via email.
            </p>
            <p className="text-sm text-gray-600">
              Il formato del link è: <code className="bg-white px-2 py-1 rounded">reportads.inmetamorfosi.com/nome-cliente</code>
            </p>
          </div>
          
          <div className="space-y-4">
            <a 
              href="mailto:info@inmetamorfosi.com"
              className="cta-button"
            >
              <Mail className="w-5 h-5" />
              Contattaci per Maggiori Informazioni
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-semibold mb-4">inMetamorfosi</h3>
          <p className="text-gray-400 mb-4">
            Agenzia specializzata in Facebook Ads e Digital Marketing
          </p>
          <div className="space-y-2">
            <p className="text-gray-400">
              <a href="https://inmetamorfosi.com" className="hover:text-white transition-colors">
                inmetamorfosi.com
              </a>
            </p>
            <p className="text-gray-400">
              <a href="mailto:info@inmetamorfosi.com" className="hover:text-white transition-colors">
                info@inmetamorfosi.com
              </a>
            </p>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} inMetamorfosi - Tutti i diritti riservati
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 