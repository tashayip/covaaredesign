interface CassetteTapeProps {
  labelText: string
  visible: boolean
}

export function CassetteTape({ labelText, visible }: CassetteTapeProps) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        bottom: -38, right: -48, zIndex: 20,
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'rotate(-8deg) translateY(0) scale(1)'
          : 'rotate(22deg) translateY(-80px) translateX(30px) scale(0.75)',
        transition: 'opacity 0.45s ease, transform 0.58s cubic-bezier(0.34,1.56,0.64,1)',
        transformOrigin: 'bottom right',
        filter:
          'drop-shadow(0 2px 2px rgba(0,0,0,0.55)) drop-shadow(0 8px 18px rgba(0,0,0,0.42))',
      }}
      aria-hidden="true"
    >
      <div className="tc-cassette">
        <div className="tc-flap" />
        <div className="tc-brand-row">
          <span style={{ fontFamily:'Space Grotesk Variable,sans-serif', fontSize:10.5, fontWeight:700, letterSpacing:2.5, color:'rgba(255,255,255,0.85)' }}>SONY</span>
          <span style={{ fontFamily:'Space Grotesk Variable,sans-serif', fontSize:10, fontWeight:300, color:'rgba(255,255,255,0.45)' }}>90</span>
        </div>
        <div style={{ position:'absolute', top:51, left:0, right:0, textAlign:'center', fontFamily:'Newsreader,serif', fontSize:6, fontStyle:'italic', color:'rgba(255,255,255,0.20)' }}>
          Rich Colours &amp; Clear Sound
        </div>
        <div className="tc-label">
          <span>{labelText || 'Lesson recording'}</span>
        </div>
        <div className="tc-window">
          <div className="tc-reel" />
          <span className="tc-hmp">HMP</span>
          <div className="tc-reel tc-reel-sm" />
        </div>
        <div className="tc-bottom">
          <span className="tc-hi8">Hi8</span>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:'Space Grotesk Variable,sans-serif', fontSize:5.5, fontWeight:600, letterSpacing:0.8, color:'rgba(255,255,255,0.38)', lineHeight:1.4 }}>
              PAL <strong style={{ color:'#C8202C', fontWeight:800 }}>Hi8</strong>
            </div>
            <div style={{ fontFamily:'Space Grotesk Variable,sans-serif', fontSize:5, fontWeight:400, letterSpacing:0.5, color:'rgba(255,255,255,0.22)' }}>video Hi8</div>
          </div>
        </div>
        <div className="tc-cuts tc-cut-l" />
        <div className="tc-cuts tc-cut-r" />
        <div className="tc-ribs" />
      </div>
    </div>
  )
}
