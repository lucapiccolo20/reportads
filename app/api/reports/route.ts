import { NextRequest, NextResponse } from 'next/server'

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

// Memory storage per i report (funziona su Vercel)
const reportStorage = new Map<string, any>()

// Sanitizza il nome del cliente per il filename
function sanitizeClientName(clientName: string): string {
  return clientName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Rimuovi caratteri speciali
    .replace(/[\s_-]+/g, '-') // Sostituisci spazi con trattini
    .replace(/^-+|-+$/g, '') // Rimuovi trattini all'inizio e alla fine
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

    const sanitizedName = sanitizeClientName(clientName)
    const report = reportStorage.get(sanitizedName)

    if (!report) {
      return NextResponse.json(
        { error: 'Report non trovato' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: report
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

    const sanitizedName = sanitizeClientName(body.client_name)
    
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

    // Salva in memory storage
    reportStorage.set(sanitizedName, fullReportData)

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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientName = searchParams.get('client_name')
    
    if (!clientName) {
      return NextResponse.json(
        { error: 'Nome cliente richiesto' },
        { status: 400 }
      )
    }

    const sanitizedName = sanitizeClientName(clientName)

    if (!reportStorage.has(sanitizedName)) {
      return NextResponse.json(
        { error: 'Report non trovato' },
        { status: 404 }
      )
    }

    reportStorage.delete(sanitizedName)

    return NextResponse.json({
      success: true,
      message: 'Report eliminato con successo'
    })
  } catch (error) {
    console.error('Errore nella eliminazione del report:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
} 