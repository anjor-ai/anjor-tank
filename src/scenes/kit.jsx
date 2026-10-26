import { Icon } from '../components/icons'
import { Type } from './engine'

/* Parts shared by every scene: the thread on the left (messages, agent steps, composer), small tiles, avatars and pills.
   They render their final state. The Director plays them in. */

export const Tile = ({ tone = 'sky', icon = 'agent', size = 24 }) => (
  <span className={`tile tile--${tone}`} style={{ '--s': `${size}px` }} aria-hidden="true"><Icon name={icon} size={Math.round(size * 0.56)} /></span>
)

export const Avatar = ({ ini = 'PM', tone = 'person' }) => <span className={`av av--${tone}`} aria-hidden="true">{ini}</span>

export const Pill = ({ tone = 'grey', children, k, icon }) => (
  <span className={`pl pl--${tone}`} data-k={k}>{icon && <Icon name={icon} size={11} />}{children}</span>
)

/** A stack of states that share one place. Without script only the last shows; with script the Director fades between them. */
export const Swap = ({ k, items }) => (
  <span className="sw">{items.map(([id, tone, text, icon]) => <Pill key={id} tone={tone} k={`${k}-${id}`} icon={icon}>{text}</Pill>)}</span>
)

/** The left column: who you are talking to, the conversation, and the composer. */
export function Thread({ agent, children, composer, k = 'tcol' }) {
  return (
    <aside className="thr" aria-label={`Conversation with the ${agent.name}`}>
      <header className="thr__h">
        <Tile tone={agent.tone || 'sky'} icon={agent.icon} size={26} />
        <span className="thr__who"><b>{agent.name}</b><small>{agent.sub}</small></span>
      </header>
      <div className="thr__view" tabIndex={0} role="log" aria-label="Conversation">
        <div className="thr__col" data-k={k}>{children}</div>
      </div>
      {composer}
    </aside>
  )
}

/** One message. `you` is a person; `ag` is the agent (no bubble, like a terminal log). */
export function Msg({ who = 'ag', name, ini, tone, icon, k, children }) {
  return (
    <div className={`msg msg--${who}`} data-k={k}>
      <p className="msg__h">
        {who === 'you' ? <Avatar ini={ini} tone={tone} /> : <Tile tone={tone || 'sky'} icon={icon || 'agent'} size={18} />}
        <b>{name}</b>
      </p>
      <div className="msg__b">{children}</div>
    </div>
  )
}

/** Agent steps: a verb and the thing it touched. Each runs as a spinner, then a tick. */
export function Steps({ k, items }) {
  return (
    <ul className="stp" aria-label="What the agent did">
      {items.map(([verb, what], i) => (
        <li key={i} className="stp__i" data-k={`${k}-${i}`}>
          <span className="stp__s" aria-hidden="true">
            <i className="stp__spin" data-k={`${k}-sp${i}`} />
            <Icon name="check" size={11} className="stp__ok" data-k={`${k}-ok${i}`} />
          </span>
          <span className="stp__v">{verb}</span>
          <code className="stp__w">{what}</code>
        </li>
      ))}
    </ul>
  )
}

/** The input at the foot of the thread. `texts` are the lines that will be typed, one after another. */
export function Composer({ agent, placeholder, texts = [], ctx, k = 'comp' }) {
  return (
    <div className="comp" data-k={k}>
      <div className="comp__in">
        <span className="comp__ph" data-k={`${k}-ph`}>{placeholder}</span>
        {texts.map((t, i) => <span key={i} className="comp__ty" data-k={`${k}-ty${i}`} aria-hidden="true"><Type k={`${k}-type${i}`} text={t} /></span>)}
      </div>
      <div className="comp__row">
        <span className="comp__chip"><Icon name="spark" size={12} />{agent}</span>
        {ctx && <span className="comp__ctx" data-k={`${k}-ctx`} aria-hidden="true"><Icon name="pin" size={11} />{ctx}</span>}
        <button type="button" className="comp__send" data-k={`${k}-send`} aria-label="Send" tabIndex={-1}><Icon name="send" size={14} /></button>
      </div>
    </div>
  )
}

/** A source or evidence chip. */
export const Src = ({ children, tone }) => <span className={`src${tone ? ` src--${tone}` : ''}`}><Icon name="doc" size={11} />{children}</span>
