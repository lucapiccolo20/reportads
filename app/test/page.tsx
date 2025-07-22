'use client'

import React, { useState } from 'react'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function TestPage() {
  const [apiTestResult, setApiTestResult] = useState<string | null>(null)
  const [apiTestLoading, setApiTestLoading] = useState(false)

  const testData = {
    client_name: "Cliente Test",
    report_data: {
      period: "1-7 Dicembre 2024",
      summary: {
        total_ads: 3,
        total_impressions: 125000,
        total_clicks: 2800,
        total_spend: "950.00",
        total_reach: 35000,
        avg_ctr: "2.24",
        avg_cpc: "0.34"
      },
      top_3_ads: [
        {
          ad_id: "123456789",
          ad_name: "Test Campagna A",
          clicks: 1200,
          ctr: 2.8,
          cpc: 0.32,
          spend: 384,
          impressions: 42857,
          reach: 15000
        },
        {
          ad_id: "987654321", 
          ad_name: "Test Campagna B",
          clicks: 800,
          ctr: 2.1,
          cpc: 0.35,
          spend: 280,
          impressions: 38095,
          reach: 12000
        },
        {
          ad_id: "456789123",
          ad_name: "Test Campagna C", 
          clicks: 800,
          ctr: 1.9,
          cpc: 0.36,
          spend: 286,
          impressions: 42105,
          reach: 8000
        }
      ]
    },
    client_report: "Analisi del periodo: Le campagne hanno performato molto bene con un CTR medio del 2.24%, superiore alla media del settore. La campagna A ha ottenuto i risultati migliori con un CTR del 2.8%. Si consiglia di aumentare il budget sulla campagna A e ottimizzare le creatività delle campagne B e C.",
    agency_report: "Report interno: Cliente test con performance solide. Budget utilizzato efficacemente con ROAS positivo. Considerare scaling campagna A."
  }

  const testAPI = async () => {
    setApiTestLoading(true)
    setApiTestResult(null)
    
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setApiTestResult(`✅ API Test SUCCESS: Report salvato - ${result.client_url}`)
      } else {
        setApiTestResult(`❌ API Test FAILED: ${result.error}`)
      }
    } catch (error) {
      setApiTestResult(`❌ API Test ERROR: ${error}`)
    } finally {
      setApiTestLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🧪 Pagina Test - Report Ads
          </h1>
          
          {/* Test Components */}
          <div className="space-y-6">
            
            {/* Test 1: Homepage */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Test 1: Homepage
              </h2>
              <p className="text-gray-600 mb-3">Homepage caricata correttamente</p>
              <a 
                href="/" 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Vai alla Homepage
              </a>
            </div>

            {/* Test 2: Logo Component */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Test 2: Logo Component
              </h2>
              <p className="text-gray-600 mb-3">Test del componente Logo (se presente)</p>
              <div className="bg-gray-100 p-4 rounded">
                <p className="text-sm text-gray-600">
                  Se vedi il logo inMetamorfosi nella homepage, il componente funziona.
                </p>
              </div>
            </div>

            {/* Test 3: API */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                Test 3: API Reports
              </h2>
              <p className="text-gray-600 mb-3">Test API endpoint per n8n</p>
              
              <button
                onClick={testAPI}
                disabled={apiTestLoading}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:bg-gray-400 mb-3"
              >
                {apiTestLoading ? 'Testing...' : 'Test API POST'}
              </button>
              
              {apiTestResult && (
                <div className="bg-gray-100 p-4 rounded mt-3">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">{apiTestResult}</pre>
                </div>
              )}
            </div>

            {/* Test 4: Report Cliente */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                Test 4: Pagina Report Cliente
              </h2>
              <p className="text-gray-600 mb-3">Test pagina dinamica report (dopo aver creato il test data)</p>
              
              <a 
                href="/cliente-test" 
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
              >
                Vai al Report Test
              </a>
            </div>

            {/* Test Data Preview */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">📊 Dati Test Mock</h2>
              <div className="bg-gray-100 p-4 rounded">
                <pre className="text-xs text-gray-700 overflow-x-auto">
                  {JSON.stringify(testData, null, 2)}
                </pre>
              </div>
            </div>

            {/* Navigation */}
            <div className="border rounded-lg p-6 bg-blue-50">
              <h2 className="text-xl font-semibold mb-4">🧭 Navigazione</h2>
              <div className="space-y-2">
                <p><strong>Homepage:</strong> <a href="/" className="text-blue-600 hover:underline">http://localhost:3000/</a></p>
                <p><strong>Test Page:</strong> <a href="/test" className="text-blue-600 hover:underline">http://localhost:3000/test</a></p>
                <p><strong>API Test:</strong> <code>POST /api/reports</code></p>
                <p><strong>Report Test:</strong> <a href="/cliente-test" className="text-blue-600 hover:underline">http://localhost:3000/cliente-test</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 