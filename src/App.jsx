import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Headphones, Gamepad2, Tv, HardDrive, Zap, House, ShoppingCart, Search, Truck,
  ShieldCheck, Tag, MapPin, ChevronDown, ArrowRight, X, Plus, Minus, MessageCircle, Menu,
} from 'lucide-react'
import { PRODUCTS, CATEGORIES } from './products'
import logo from './assets/logo.png'

const WA = '263773752462'
const IMGS = import.meta.glob('./assets/products/*.webp', { eager: true, import: 'default' })
const img = (id) => IMGS[`./assets/products/${id}.webp`]
const waLink = (text) => `https://wa.me/${WA}${text ? `?text=${encodeURIComponent(text)}` : ''}`
const money = (n) => (n === null ? 'Ask for price' : `$${n}`)

const HERO_CATS = [
  { label: 'Audio', cat: 'Audio', Icon: Headphones },
  { label: 'Gaming', cat: 'Gaming', Icon: Gamepad2 },
  { label: 'TV & Streaming', cat: 'TV & Streaming', Icon: Tv },
  { label: 'Storage', cat: 'Storage', Icon: HardDrive },
  { label: 'Power', cat: 'Power & Chargers', Icon: Zap },
  { label: 'Home', cat: 'Home & Kitchen', Icon: House },
]

export default function App() {
  const [cat, setCat] = useState('All')
  const [term, setTerm] = useState('')
  const [sort, setSort] = useState('d')
  const [cart, setCart] = useState([])
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [visibleCount, setVisibleCount] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 700 ? 8 : 12)
  const [pageSize, setPageSize] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 700 ? 8 : 12)
  const searchRef = useRef(null)

  useEffect(() => {
    const updatePageSize = () => {
      const next = window.innerWidth <= 700 ? 8 : 12
      setPageSize(next)
      setVisibleCount((current) => Math.max(current, next))
    }
    window.addEventListener('resize', updatePageSize)
    return () => window.removeEventListener('resize', updatePageSize)
  }, [])

  useEffect(() => {
    setVisibleCount(pageSize)
  }, [cat, term, sort, pageSize])

  const goShop = (c) => {
    if (c) setCat(c)
    setMenu(false)
    setMobileMenu(false)
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
  }
  const focusSearch = () => {
    goShop()
    setTimeout(() => searchRef.current?.focus(), 450)
  }

  const add = (p, size, price) => {
    const key = `${p.id}-${size || ''}`
    setCart((c) => {
      const f = c.find((x) => x.key === key)
      return f
        ? c.map((x) => (x.key === key ? { ...x, qty: x.qty + 1 } : x))
        : [...c, { key, name: p.name, size, price, qty: 1 }]
    })
    setOpen(true)
  }
  const bump = (key, d) =>
    setCart((c) => c.map((x) => (x.key === key ? { ...x, qty: x.qty + d } : x)).filter((x) => x.qty > 0))
  const count = cart.reduce((s, x) => s + x.qty, 0)
  const total = cart.reduce((s, x) => s + (x.price || 0) * x.qty, 0)
  const orderText = () =>
    `Hi Neplora, I’d like to order:\n` +
    cart.map((x) => `• ${x.qty}× ${x.name}${x.size ? ` (${x.size})` : ''} – ${money(x.price)}`).join('\n') +
    `\nTotal: $${total}\nDelivery location: `

  const list = useMemo(() => {
    const t = term.trim().toLowerCase()
    const l = PRODUCTS.filter(
      (p) => (cat === 'All' || p.cat === cat) && (!t || `${p.name} ${p.cat}`.toLowerCase().includes(t)),
    )
    if (sort === 'lo') l.sort((a, b) => (a.price ?? 1e9) - (b.price ?? 1e9))
    if (sort === 'hi') l.sort((a, b) => (b.price ?? -1) - (a.price ?? -1))
    return l
  }, [cat, term, sort])

  const visibleProducts = list.slice(0, visibleCount)

  return (
    <>
      {/* ───────── HEADER ───────── */}
      <header className="hdr">
        <div className="wrap nav">
          <a href="#top" className="logo"><img src={logo} alt="Neplora Electronics" /></a>
          <nav className="links">
            <a href="#shop" onClick={(e) => { e.preventDefault(); goShop('All') }}>Shop</a>
            <div className="dd" onMouseLeave={() => setMenu(false)}>
              <button onClick={() => setMenu(!menu)} onMouseEnter={() => setMenu(true)}>
                Categories <ChevronDown size={16} />
              </button>
              {menu && (
                <div className="ddm">
                  {CATEGORIES.map((c) => (
                    <button key={c} onClick={() => goShop(c)}>{c}</button>
                  ))}
                </div>
              )}
            </div>
            <a href="#how">How to Order</a>
            <a href="#visit">Visit Us</a>
          </nav>
          <div className="actions">
            <button className="ib" aria-label="Search" onClick={focusSearch}><Search size={22} /></button>
            <button className="ib cartb" aria-label="Cart" onClick={() => setOpen(true)}>
              <ShoppingCart size={22} /><span className="badge">{count}</span>
            </button>
            <button className="ib mobile-menu-toggle" aria-label="Open menu" aria-expanded={mobileMenu} onClick={() => setMobileMenu((v) => !v)}>
              {mobileMenu ? <X size={23} /> : <Menu size={23} />}
            </button>
            <a className="btn wa hide-sm" href={waLink()} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={20} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </header>
      {mobileMenu && (
        <div className="mobile-menu">
          <a href="#shop" onClick={(e) => { e.preventDefault(); goShop('All') }}>Shop all products</a>
          <a href="#how" onClick={() => setMobileMenu(false)}>How to order</a>
          <a href="#visit" onClick={() => setMobileMenu(false)}>Visit us</a>
          <a href={waLink()} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
          <div className="mobile-menu-cats">
            {CATEGORIES.map((c) => <button key={c} onClick={() => goShop(c)}>{c}</button>)}
          </div>
        </div>
      )}

      {/* ───────── HERO ───────── */}
      <section id="top" className="hero">
        <div className="wrap hero-grid">
          <div className="hero-l">
            <span className="loc"><i className="dot" /><MapPin size={16} /> Stall 21 • Galaxy Mall, Harare CBD</span>
            <h1>
              Technology<br />that <em>moves you.
                <svg viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden="true"><path d="M2 10 Q150 -2 298 7" /></svg>
              </em>
            </h1>
            <p className="sub">Gadgets. Entertainment. Everyday essentials.</p>
            <div className="cta">
              <button className="btn blue" onClick={() => goShop('All')}>
                <ShoppingCart size={20} /> Explore Collection <ArrowRight size={18} />
              </button>
              <a className="btn outline" href={waLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={20} color="#1faa59" /> Chat on WhatsApp
              </a>
            </div>
            <div className="trust">
              <div><span><Truck size={22} /></span><b>Fast Delivery<small>Harare & Surrounding</small></b></div>
              <div><span><ShieldCheck size={22} /></span><b>Genuine Products<small>Trusted Brands</small></b></div>
              <div><span><Tag size={22} /></span><b>Honest Prices<small>Great Value</small></b></div>
            </div>
          </div>

          <div className="stage" aria-hidden="true">
            <div className="tv"><div className="screen" /></div>
            <div className="pod back" />
            <div className="pod"><i /></div>
            <img className="p jbl" src={img(9)} alt="" />
            <img className="p ps" src={img(38)} alt="" />
            <img className="p mi" src={img(35)} alt="" />
          </div>
        </div>

        <div className="wrap herocats">
          {HERO_CATS.map(({ label, cat: c, Icon }) => (
            <button key={label} onClick={() => goShop(c)}><Icon size={30} /> {label}</button>
          ))}
        </div>
      </section>

      {/* ───────── SHOP ───────── */}
      <section id="shop" className="sec">
        <div className="wrap">
          <div className="sec-h">
            <div><h2>Shop the catalogue</h2><p>Find your next gadget. Add to cart and order directly on WhatsApp.</p></div>
            <span className="catalogue-count">{PRODUCTS.length} products</span>
          </div>
          <div className="tools">
            <input ref={searchRef} type="search" placeholder="Search products, e.g. JBL, HDMI, controller…" value={term} onChange={(e) => setTerm(e.target.value)} />
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
              <option value="d">Featured</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option>
            </select>
          </div>
          <div className="chips">
            {['All', ...CATEGORIES].map((c) => (
              <button key={c} className={`chip${cat === c ? ' on' : ''}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <div className="results-meta">
            <span>Showing <b>{Math.min(visibleCount, list.length)}</b> of <b>{list.length}</b> products</span>
            {cat !== 'All' && <button onClick={() => setCat('All')}>Clear category</button>}
          </div>
          <div className="grid">
            {visibleProducts.map((p) => <Card key={p.id} p={p} onAdd={add} />)}
            {!list.length && <p className="empty">No products match. Message us on WhatsApp, we may still have it.</p>}
          </div>
          {list.length > visibleCount && (
            <div className="catalogue-actions">
              <button className="btn blue" onClick={() => setVisibleCount((n) => Math.min(n + pageSize, list.length))}>
                Load more products <ArrowRight size={18} />
              </button>
              <button className="view-all" onClick={() => setVisibleCount(list.length)}>
                View all {list.length} products
              </button>
            </div>
          )}
          {list.length > 0 && visibleCount >= list.length && (
            <div className="catalogue-end">
              <span>You've seen all {list.length} products.</span>
              <button onClick={() => { setCat('All'); setTerm(''); setSort('d'); setVisibleCount(pageSize) }}>Back to featured products</button>
            </div>
          )}
        </div>
      </section>

      {/* ───────── HOW TO ORDER ───────── */}
      <section id="how" className="sec tight">
        <div className="wrap">
          <div className="sec-h"><div><h2>How to order</h2><p>Three simple steps. No account needed.</p></div></div>
          <div className="steps">
            {[
              ['Pick your gadget', 'Browse the catalogue and add what you like to your cart.'],
              ['Confirm on WhatsApp', 'Your cart opens in WhatsApp. Share your delivery location and we confirm price and stock.'],
              ['We deliver', 'Neplora Express brings it straight to your doorstep in Harare & surrounding areas.'],
            ].map(([h, t], i) => (
              <div className="step" key={h}><i>{i + 1}</i><h3>{h}</h3><p>{t}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── VISIT ───────── */}
      <section id="visit" className="sec tight">
        <div className="wrap visit">
          <div>
            <h2>Visit Neplora Electronics</h2>
            <p><MapPin size={16} /> Stall 21, Galaxy Mall, Ground Floor</p>
            <p>Corner First Street & Jason Moyo Avenue, Harare CBD</p>
            <p><MessageCircle size={16} /> +263 773 752 462</p>
          </div>
          <div className="cta">
            <a className="btn wa" href={waLink()} target="_blank" rel="noopener noreferrer"><MessageCircle size={20} /> Message us</a>
            <a className="btn ghost" href="https://www.google.com/maps/search/?api=1&query=Galaxy+Mall+Harare+CBD" target="_blank" rel="noopener noreferrer">Get directions</a>
          </div>
        </div>
      </section>

      <footer className="foot">© Neplora Electronics · Harare, Zimbabwe · Prices and availability may change, confirm on WhatsApp.</footer>
      <a className="fab" href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="Order on WhatsApp"><MessageCircle size={20} /> Order</a>

      {/* ───────── CART DRAWER ───────── */}
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <aside className={`drawer${open ? ' on' : ''}`} aria-hidden={!open}>
        <div className="dh"><h3>Your cart ({count})</h3><button className="ib" onClick={() => setOpen(false)} aria-label="Close"><X size={22} /></button></div>
        <div className="dl">
          {!cart.length && <p className="empty">Your cart is empty.</p>}
          {cart.map((x) => (
            <div className="line" key={x.key}>
              <div><b>{x.name}</b>{x.size && <small> · {x.size}</small>}<div className="lp">{money(x.price)}</div></div>
              <div className="qty">
                <button onClick={() => bump(x.key, -1)} aria-label="Less"><Minus size={14} /></button>
                <span>{x.qty}</span>
                <button onClick={() => bump(x.key, 1)} aria-label="More"><Plus size={14} /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="df">
          <div className="tot"><span>Total</span><b>${total}</b></div>
          <a className={`btn wa full${cart.length ? '' : ' off'}`} href={cart.length ? waLink(orderText()) : undefined} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={20} /> Send order on WhatsApp
          </a>
        </div>
      </aside>
    </>
  )
}

function Card({ p, onAdd }) {
  const [sel, setSel] = useState(0)
  const tier = p.tiers ? p.tiers[sel] : null
  const price = tier ? tier[1] : p.price
  return (
    <article className="card">
      <div className="ci"><img loading="lazy" src={img(p.id)} alt={p.name} /></div>
      <div className="cb">
        <span className="tag">{p.cat}</span>
        <h3>{p.name}</h3>
        {p.tiers && (
          <select className="size" value={sel} onChange={(e) => setSel(+e.target.value)} aria-label="Choose size">
            {p.tiers.map((t, i) => <option key={t[0]} value={i}>{t[0]} · ${t[1]}</option>)}
          </select>
        )}
        <div className="price">{price === null ? <small>Ask for price</small> : `$${price}`}</div>
        {price === null ? (
          <a className="btn wa full" href={waLink(`Hi Neplora, what’s the price of: ${p.name}?`)} target="_blank" rel="noopener noreferrer">Ask on WhatsApp</a>
        ) : (
          <button className="btn blue full" onClick={() => onAdd(p, tier && tier[0], price)}><ShoppingCart size={17} /> Add to cart</button>
        )}
      </div>
    </article>
  )
}
