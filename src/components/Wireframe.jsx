/** Decorative, code-native study of connected surfaces. */
export function Wireframe({ className = '' }) {
  return <svg className={`atelier-wireframe ${className}`} viewBox="0 0 180 120" fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth=".65">
      {[0, 1, 2, 3, 4].map(i => <path key={i} d={`M20 ${50+i*8} 90 ${14+i*8} 160 ${50+i*8} 90 ${86+i*8}Z`}/>)}
      {[0, 1, 2, 3, 4, 5].map(i => <g key={i}><path d={`M${20+i*14} ${50-i*7.2}v32M${90+i*14} ${14+i*7.2}v32`}/><path d={`M${20+i*14} ${50+i*7.2}v32M${90+i*14} ${86-i*7.2}v32`}/></g>)}
    </g><circle cx="90" cy="62" r="4" fill="currentColor"/>
  </svg>
}

export function AsciiSignal() {
  return <pre className="atelier-ascii" aria-hidden="true">{`       . : + : .
    . : + # + : .
 . : + # @ # + : .
    . : + # + : .
       . : + : .`}</pre>
}
