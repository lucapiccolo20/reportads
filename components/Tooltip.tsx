'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface TooltipProps {
  children: React.ReactNode
  content: string
  className?: string
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [arrowPosition, setArrowPosition] = useState({ left: '50%' })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isVisible || !triggerRef.current || !tooltipRef.current) return

    const updatePosition = () => {
      const triggerRect = triggerRef.current!.getBoundingClientRect()
      const tooltipRect = tooltipRef.current!.getBoundingClientRect()
      
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      let top = triggerRect.bottom + 8
      let left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2)
      
      // Adjust horizontal position if tooltip goes outside viewport
      if (left < 8) {
        left = 8
      } else if (left + tooltipRect.width > viewportWidth - 8) {
        left = viewportWidth - tooltipRect.width - 8
      }
      
      // Calculate arrow position relative to tooltip
      const arrowLeft = triggerRect.left + (triggerRect.width / 2) - left
      const arrowLeftPercent = Math.max(12, Math.min(88, (arrowLeft / tooltipRect.width) * 100))
      
      // Adjust vertical position if tooltip goes outside viewport
      if (top + tooltipRect.height > viewportHeight - 8) {
        top = triggerRect.top - tooltipRect.height - 8
      }
      
      setTooltipPosition({ top, left })
      setArrowPosition({ left: `${arrowLeftPercent}%` })
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition)
    window.addEventListener('resize', updatePosition)
    
    return () => {
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current && 
        !triggerRef.current.contains(event.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isVisible])

  const handleMouseEnter = () => setIsVisible(true)
  const handleMouseLeave = () => setIsVisible(false)
  const handleClick = () => setIsVisible(!isVisible)

  const tooltipElement = isVisible && isMounted ? (
    <div
      ref={tooltipRef}
      className="fixed z-[99999] bg-gray-900 text-white text-sm rounded-lg py-2 px-3 shadow-2xl border border-gray-700 max-w-xs"
      style={{
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
      }}
    >
      <div className="relative">
        {content}
        {/* Arrow */}
        <div
          className="absolute -top-[9px] w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-gray-900"
          style={{
            left: arrowPosition.left,
            transform: 'translateX(-50%)',
          }}
        />
      </div>
    </div>
  ) : null

  return (
    <>
      <div
        ref={triggerRef}
        className={`inline-block ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {children}
      </div>
      {isMounted && document.body && createPortal(tooltipElement, document.body)}
    </>
  )
}

export default Tooltip 