  <body className={inter.className}>
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <filter id="oil-paint">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
          <feGaussianBlur stdDeviation="0.5" />
          <feColorMatrix type="saturate" values="1.4" />
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
      </defs>
    </svg>
    {children}
  </body> 