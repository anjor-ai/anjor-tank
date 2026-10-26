import { LinkArrow } from './ui'
const moments=[
 {img:'kart-night',cap:'Speed and focus',alt:'Karting on a track'},
 {img:'waterfall',cap:'The long way round',alt:'Waterfall and outdoor journey'},
 {img:'stage-unreal',cap:'The energy of a crowd',alt:'Live music stage'}
]
export function BeyondTeaser(){
 return <div className="nx-life"><div className="nx-life__copy"><h2 className="h-2">Away from the roadmap, <span className="em">still curious.</span></h2><p className="lead">Karting, music, travel and the occasional detour. I care about how things work, and about experiencing them for myself.</p><LinkArrow to="/beyond">The person outside product</LinkArrow></div><div className="nx-life__frame">{moments.map(m=><a href="/beyond" key={m.img}><img src={'/img/adventure/'+m.img+'.webp'} alt={m.alt} loading="lazy" decoding="async"/><span>{m.cap}</span></a>)}</div></div>
}
