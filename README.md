# 📊 Report Ads - inMetamorfosi

Sistema di reporting automatico per Facebook Ads integrato con n8n, sviluppato per **inMetamorfosi**.

## 🚀 Caratteristiche

- **Homepage Aziendale**: Presenta i servizi dell'agenzia
- **Report Dinamici**: URL personalizzati per ogni cliente (`/nome-cliente`)
- **API n8n**: Endpoint per ricevere dati automaticamente da workflow
- **Design Responsive**: Ottimizzato per desktop e mobile
- **Logo Intelligente**: SVG che si adatta automaticamente al background
- **Tooltips Avanzati**: Spiegazioni delle metriche con portal rendering

## 🛠️ Stack Tecnologico

- **Framework**: Next.js 14 con App Router
- **Linguaggio**: TypeScript
- **Styling**: Tailwind CSS
- **Icone**: Lucide React
- **Deploy**: Vercel con integrazione GitHub
- **Storage**: File system (JSON files)

## 📁 Struttura Progetto

```
reportads/
├── app/
│   ├── api/reports/route.ts      # API endpoint per n8n
│   ├── [cliente]/page.tsx        # Pagina dinamica clienti
│   ├── layout.tsx                # Layout globale
│   ├── globals.css              # Stili globali
│   └── page.tsx                 # Homepage
├── components/
│   ├── FacebookAdsReport.tsx    # Componente report principale
│   ├── Logo.tsx                 # Logo intelligente
│   └── Tooltip.tsx              # Tooltip con portals
├── public/
│   ├── logo.svg                 # Logo SVG bianco
│   └── favicon.svg              # Favicon
└── package.json
```

## 🔗 URL e Routing

### Homepage
- **URL**: `https://reportads.inmetamorfosi.com/`
- **Descrizione**: Pagina principale con informazioni sull'agenzia

### Report Clienti  
- **URL**: `https://reportads.inmetamorfosi.com/[nome-cliente]`
- **Esempio**: `https://reportads.inmetamorfosi.com/cliente-esempio`
- **Funzione**: Visualizza report personalizzato per il cliente

### API n8n
- **URL**: `https://reportads.inmetamorfosi.com/api/reports`
- **Metodi**: 
  - `POST`: Riceve dati da n8n workflow
  - `GET`: Recupera report esistente

## 🔧 Integrazione n8n

### Configurazione Workflow

Nel tuo workflow n8n, aggiungi un nodo **HTTP Request** con:

```json
{
  "method": "POST",
  "url": "https://reportads.inmetamorfosi.com/api/reports",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "client_name": "Nome Cliente",
    "report_data": {
      "period": "1-7 Novembre 2024",
      "summary": {
        "total_ads": 5,
        "total_impressions": 150000,
        "total_clicks": 3500,
        "total_spend": "1250.00",
        "total_reach": 45000,
        "avg_ctr": "2.33",
        "avg_cpc": "0.36"
      },
      "top_3_ads": [
        {
          "ad_id": "123456789",
          "ad_name": "Campagna Prodotto A",
          "clicks": 1200,
          "ctr": 2.8,
          "cpc": 0.32,
          "spend": 384,
          "impressions": 42857,
          "reach": 15000
        }
      ]
    },
    "client_report": "Analisi AI generata...",
    "agency_report": "Report interno agenzia..."
  }
}
```

### Risposta API

```json
{
  "success": true,
  "message": "Report salvato con successo",
  "client_url": "https://reportads.inmetamorfosi.com/nome-cliente",
  "data": { /* dati completi report */ }
}
```

## 🎨 Personalizzazione

### Logo e Branding

- **Logo**: File SVG bianco in `/public/logo.svg`
- **Favicon**: File SVG in `/public/favicon.svg`  
- **Colori**: Modificabili in `tailwind.config.js`
- **Branding**: "inMetamorfosi" configurato nei componenti

### Adattamento Logo

Il logo è **bianco** di default e si adatta automaticamente:
- **Sfondi chiari**: Diventa nero (`.logo-light-bg`)
- **Sfondi scuri**: Rimane bianco (`.logo-dark-bg`)

### Tooltips

I tooltip utilizzano **React Portals** per garantire:
- ✅ Z-index sempre corretto
- ✅ Posizionamento intelligente
- ✅ Responsive e accessibili
- ✅ Click outside per chiudere

## 🚀 Deploy

### Vercel (Automatico)

1. **Push su GitHub**: Ogni commit su `main` triggera automaticamente il deploy
2. **Build**: Vercel rileva Next.js e configura automaticamente
3. **Deploy**: Live in 2-3 minuti su `https://reportads.inmetamorfosi.com/`

### Configurazione Dominio

Se hai già configurato il dominio personalizzato su Vercel, il deploy sarà automatico. Altrimenti:

1. Vai su Vercel Dashboard
2. Seleziona il progetto `reportads`
3. Settings → Domains
4. Aggiungi `reportads.inmetamorfosi.com`

## 🔍 Testing

### Locale
```bash
npm run dev
# Apri http://localhost:3000
```

### API Testing
```bash
# Test GET
curl "https://reportads.inmetamorfosi.com/api/reports?client=test-cliente"

# Test POST  
curl -X POST https://reportads.inmetamorfosi.com/api/reports \
  -H "Content-Type: application/json" \
  -d '{"client_name":"test-cliente","report_data":{...}}'
```

## 📊 Metriche Supportate

- **Investimento** (€): Spesa totale campagne
- **Click Totali**: Numero click ricevuti
- **Persone Raggiunte**: Reach unico
- **CTR Medio** (%): Click-Through Rate
- **Impressioni**: Visualizzazioni totali
- **CPC Medio** (€): Costo Per Click

## 🔒 Sicurezza

- **HTTPS**: Certificato SSL automatico su Vercel
- **CORS**: Configurato per API cross-origin
- **Input Sanitization**: Nome file sanitizzati
- **Error Handling**: Gestione errori robusta

## 📞 Supporto

Per problemi tecnici o personalizzazioni:
- **Email**: info@inmetamorfosi.com
- **Website**: https://inmetamorfosi.com

---

**© 2024 inMetamorfosi - Sistema Report Ads** 