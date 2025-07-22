'use client'

import React from 'react'
import FacebookAdsReport from '../../components/FacebookAdsReport'

export default function ClientePage({ params }: { params: { cliente: string } }) {
  return <FacebookAdsReport clientName={params.cliente} />
} 