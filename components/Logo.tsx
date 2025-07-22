'use client'

import React from 'react'

interface LogoProps {
  className?: string
  alt?: string
  lightBackground?: boolean
}

const Logo: React.FC<LogoProps> = ({ 
  className = "h-8 w-auto", 
  alt = "inMetamorfosi Logo",
  lightBackground = true 
}) => {
  const logoClass = lightBackground ? 'logo-light-bg' : 'logo-dark-bg'
  
  return (
    <img 
      src="/logo.svg" 
      alt={alt} 
      className={`${className} ${logoClass} transition-all duration-300`}
    />
  )
}

export default Logo 