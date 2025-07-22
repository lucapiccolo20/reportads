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

// Memory storage per i report (fallback)
const reportStorage = new Map<string, any>()

// Directories
const REPORTS_DIR = path.join(process.cwd(), 'data', 'reports')

// Sanitizza il nome del cliente per uso come filename
function sanitizeClientName(name: string): string {
  return name.toLowerCase()
    .normalize('NFD') // Decompone i caratteri accentati
    .replace(/[\u0300-\u036f]/g, '') // Rimuove gli accenti
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Assicura che la directory reports esista
function ensureReportsDir() {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true })
  }
}

// Legge report da file o memory storage
function getReportData(clientName: string) {
  const sanitizedName = sanitizeClientName(clientName)
  
  // Prova prima da file system
  try {
    const filePath = path.join(REPORTS_DIR, `${sanitizedName}.json`)
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(fileContent)
    }
  } catch (error) {
    console.log('File non trovato, provo memory storage:', error)
  }
  
  // Fallback a memory storage
  return reportStorage.get(sanitizedName)
}

// Salva report (sia su file che memory storage)
function saveReportData(clientName: string, data: any) {
  const sanitizedName = sanitizeClientName(clientName)
  
  // Salva in memory storage
  reportStorage.set(sanitizedName, data)
  
  // Prova a salvare su file system (se possibile)
  try {
    ensureReportsDir()
    const filePath = path.join(REPORTS_DIR, `${sanitizedName}.json`)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    console.log(`Report salvato su file: ${filePath}`)
  } catch (error) {
    console.log('Impossibile salvare su file, uso memory storage:', error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const client = searchParams.get('client')

    if (!client) {
      return NextResponse.json(
        { error: 'Parametro client mancante' },
        { status: 400 }
      )
    }

    const reportData = getReportData(client)

    if (!reportData) {
      return NextResponse.json(
        { error: 'Report non trovato' },
        { status: 404 }
      )
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error('Errore nel recupero del report:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

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

    // Salva i dati
    saveReportData(body.client_name, fullReportData)

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
    const client = searchParams.get('client')

    if (!client) {
      return NextResponse.json(
        { error: 'Parametro client mancante' },
        { status: 400 }
      )
    }

    const sanitizedName = sanitizeClientName(client)
    
    // Rimuovi da memory storage
    const existed = reportStorage.delete(sanitizedName)
    
    // Rimuovi file se esiste
    try {
      const filePath = path.join(REPORTS_DIR, `${sanitizedName}.json`)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (error) {
      console.log('Errore nella rimozione del file:', error)
    }

    if (!existed) {
      return NextResponse.json(
        { error: 'Report non trovato' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Report eliminato con successo'
    })
  } catch (error) {
    console.error('Errore nell\'eliminazione del report:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
} 