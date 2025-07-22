import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Interfacce per i dati del report
interface ReportData {
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
  all_ads: Array<any>
  client_report?: string
  agency_report?: string
}

interface RequestPayload {
  client_name: string
  report_data: ReportData
  client_report: string
  agency_report: string
}

// Directory per salvare i report
const REPORTS_DIR = path.join(process.cwd(), 'data', 'reports')

// Assicurati che la directory esista
function ensureReportsDir() {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true })
  }
}

// Sanitizza il nome del cliente per il filename
function sanitizeClientName(clientName: string): string {
  return clientName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// GET: Recupera un report specifico
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientName = searchParams.get('client')
    
    if (!clientName) {
      return NextResponse.json(
        { error: 'Parametro client mancante' },
        { status: 400 }
      )
    }

    ensureReportsDir()
    const sanitizedName = sanitizeClientName(clientName)
    const filePath = path.join(REPORTS_DIR, `${sanitizedName}.json`)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Report non trovato' },
        { status: 404 }
      )
    }

    const reportData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    
    return NextResponse.json({
      success: true,
      data: reportData
    })
  } catch (error) {
    console.error('Errore nel recupero del report:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

// POST: Salva un nuovo report (chiamato da n8n)
export async function POST(request: NextRequest) {
  try {
    const body: RequestPayload = await request.json()
    
    if (!body.client_name || !body.report_data) {
      return NextResponse.json(
        { error: 'Dati mancanti: client_name e report_data sono richiesti' },
        { status: 400 }
      )
    }

    ensureReportsDir()
    const sanitizedName = sanitizeClientName(body.client_name)
    const filePath = path.join(REPORTS_DIR, `${sanitizedName}.json`)

    // Prepara i dati completi del report
    const fullReportData = {
      client_name: body.client_name,
      last_updated: new Date().toISOString(),
      generated_at: new Date().toLocaleDateString('it-IT', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      ...body.report_data,
      client_report: body.client_report,
      agency_report: body.agency_report
    }

    // Salva il report
    fs.writeFileSync(filePath, JSON.stringify(fullReportData, null, 2))

    return NextResponse.json({
      success: true,
      message: 'Report salvato con successo',
      client_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://reportads.inmetamorfosi.com'}/${sanitizedName}`,
      data: fullReportData
    })
  } catch (error) {
    console.error('Errore nel salvataggio del report:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
} 