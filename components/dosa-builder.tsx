'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Check, Plus, Utensils, Coffee, Leaf, ShoppingBag, ArrowRight, RotateCcw, X, Info } from 'lucide-react'

type DosaBase = {
  id: string
  name: string
  price: number
  desc: string
}

type SideItem = {
  id: string
  name: string
  price: number
}

type DrinkItem = {
  id: string
  name: string
  price: number
}

const DOSA_BASES: DosaBase[] = [
  { id: 'b1', name: 'Butter Masala Dosa', price: 209, desc: 'Golden crisp dosa stuffed with spiced potato bhaji & fresh butter' },
  { id: 'b2', name: 'Ghee Roast Masala Dosa', price: 274, desc: 'Roasted with pure desi ghee on seasoned cast iron tawa' },
  { id: 'b3', name: 'Mysore Masala Dosa', price: 213, desc: 'Lined with authentic red chili-garlic paste & spiced potatoes' },
  { id: 'b4', name: 'Cheese Masala Dosa', price: 293, desc: 'Loaded with rich melted cheese & aromatic potato filling' },
  { id: 'b5', name: 'Podi Seeragam Set Dosa', price: 221, desc: 'Soft fluffy set dosas sprinkled with aromatic gun powder podi' },
]

const CHUTNEYS = [
  { id: 'c1', name: 'Fresh Coconut Chutney' },
  { id: 'c2', name: 'Spicy Tomato-Garlic Chutney' },
  { id: 'c3', name: 'Mint-Coriander Chutney' },
  { id: 'c4', name: 'Signature Vegetable Sambhar' },
]

const SIDES: SideItem[] = [
  { id: 's0', name: 'No Side (Classic Plate)', price: 0 },
  { id: 's1', name: 'Button Idli Fry (6 pcs)', price: 163 },
  { id: 's2', name: 'Crispy Medu Vada (2 pcs)', price: 166 },
  { id: 's3', name: 'Ghee Veggie Rawa Upma', price: 199 },
]

const DRINKS: DrinkItem[] = [
  { id: 'd0', name: 'No Beverage', price: 0 },
  { id: 'd1', name: 'Davidoff Cold Coffee', price: 190 },
  { id: 'd2', name: 'Swadeshi Buttermilk', price: 99 },
  { id: 'd3', name: 'Sangam Lassi', price: 149 },
  { id: 'd4', name: 'Lemon Iced Tea', price: 149 },
]

export function DosaBuilder() {
  const [selectedBase, setSelectedBase] = useState<DosaBase>(DOSA_BASES[0])
  const [selectedChutneys, setSelectedChutneys] = useState<string[]>(['c1', 'c2', 'c4'])
  const [selectedSide, setSelectedSide] = useState<SideItem>(SIDES[0])
  const [selectedDrink, setSelectedDrink] = useState<DrinkItem>(DRINKS[1])
  const [addedCombo, setAddedCombo] = useState(false)

  const toggleChutney = (id: string) => {
    setSelectedChutneys(prev => 
      prev.includes(id) 
        ? prev.filter(c => c !== id) 
        : [...prev, id]
    )
  }

  const resetSelection = () => {
    setSelectedBase(DOSA_BASES[0])
    setSelectedChutneys(['c1', 'c2', 'c4'])
    setSelectedSide(SIDES[0])
    setSelectedDrink(DRINKS[0])
  }

  const totalPrice = selectedBase.price + selectedSide.price + selectedDrink.price

  const handleAddComboToCart = () => {
    try {
      const stored = localStorage.getItem('meenu-dosa-cart')
      const cart = stored ? JSON.parse(stored) : {}
      const comboId = `dosas-0` // Map to primary dish in cart
      cart[comboId] = (cart[comboId] || 0) + 1
      localStorage.setItem('meenu-dosa-cart', JSON.stringify(cart))
      setAddedCombo(true)
      setTimeout(() => setAddedCombo(false), 2500)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-amber-500/30 bg-card p-6 shadow-2xl transition-all sm:p-10">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 size-80 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative z-10">
        {/* Clarification Banner for Single Items vs Combos */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-3.5 px-4 text-xs">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <Info size={16} className="shrink-0 text-amber-500" />
            <span>
              <strong>Note:</strong> You can order <strong>single items</strong> (just a Dosa, Idli or Coffee) as well as custom combos!
            </span>
          </div>
          <Link
            href="/menu"
            className="inline-flex shrink-0 items-center gap-1 font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            Order Single Items Ala-Carte <ArrowRight size={14} />
          </Link>
        </div>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Sparkles size={14} className="animate-spin" /> Custom Combo Creator
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">
              Craft Your Perfect South Indian Meal Plate
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Customize your Dosa, chutneys, side treats & drinks — or order individual items anytime!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Combo Price</p>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">₹{totalPrice}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddComboToCart}
                className="inline-flex items-center gap-2 rounded-xl gold-gradient-bg px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-105 active:scale-95"
              >
                {addedCombo ? (
                  <>
                    <Check size={18} /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Add Combo to Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Step 1: Dosa Base */}
          <div className="rounded-2xl border bg-background/80 p-5 backdrop-blur-sm">
            <h3 className="flex items-center gap-2 text-base font-black text-amber-600 dark:text-amber-400">
              <span className="grid size-6 place-items-center rounded-full bg-amber-500 text-xs font-bold text-white">1</span>
              Choose Dosa Base
            </h3>
            <div className="mt-4 flex flex-col gap-2.5">
              {DOSA_BASES.map(b => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBase(b)}
                  className={`flex flex-col text-left rounded-xl border p-3 transition ${
                    selectedBase.id === b.id
                      ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30'
                      : 'hover:bg-muted/50 border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm flex items-center gap-1.5">
                      {b.name} <Leaf size={14} className="text-emerald-500 inline" />
                    </span>
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400">₹{b.price}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{b.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Chutneys & Sambhar */}
          <div className="rounded-2xl border bg-background/80 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-base font-black text-amber-600 dark:text-amber-400">
                <span className="grid size-6 place-items-center rounded-full bg-amber-500 text-xs font-bold text-white">2</span>
                Chutneys & Accompaniments
              </h3>
              {selectedChutneys.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedChutneys([])}
                  className="text-[11px] font-bold text-red-500 hover:underline flex items-center gap-1"
                >
                  <X size={12} /> Clear Chutneys
                </button>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Tap to add or remove chutneys:</p>

            <div className="mt-4 flex flex-col gap-2.5">
              {CHUTNEYS.map(c => {
                const isSelected = selectedChutneys.includes(c.id)
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleChutney(c.id)}
                    className={`flex items-center justify-between rounded-xl border p-3 transition ${
                      isSelected
                        ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : 'border-border opacity-50 hover:opacity-90'
                    }`}
                  >
                    <span className="text-sm font-semibold flex items-center gap-2">
                      <Utensils size={14} /> {c.name}
                    </span>
                    <span className={`grid size-6 place-items-center rounded-full ${isSelected ? 'bg-emerald-500 text-white' : 'border'}`}>
                      {isSelected ? <Check size={12} /> : <Plus size={12} />}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Side Dish Selection with Remove option */}
            <div className="mt-6 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Add Side Starter
                </h4>
                {selectedSide.price > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedSide(SIDES[0])}
                    className="text-[11px] font-bold text-red-500 hover:underline flex items-center gap-1"
                  >
                    <X size={12} /> Remove Side
                  </button>
                )}
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2">
                {SIDES.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSide(s)}
                    className={`rounded-xl border p-2 text-left text-xs transition ${
                      selectedSide.id === s.id
                        ? 'border-amber-500 bg-amber-500/10 font-bold'
                        : 'hover:bg-muted border-border'
                    }`}
                  >
                    <p className="truncate">{s.name}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{s.price > 0 ? `+₹${s.price}` : 'Free'}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Beverage & Live Summary */}
          <div className="rounded-2xl border bg-background/80 p-5 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-base font-black text-amber-600 dark:text-amber-400">
                  <span className="grid size-6 place-items-center rounded-full bg-amber-500 text-xs font-bold text-white">3</span>
                  Chilled Beverage
                </h3>
                {selectedDrink.price > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedDrink(DRINKS[0])}
                    className="text-[11px] font-bold text-red-500 hover:underline flex items-center gap-1"
                  >
                    <X size={12} /> Remove Drink
                  </button>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {DRINKS.map(d => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDrink(d)}
                    className={`flex items-center justify-between rounded-xl border p-2.5 transition text-xs ${
                      selectedDrink.id === d.id
                        ? 'border-amber-500 bg-amber-500/10 font-bold'
                        : 'hover:bg-muted border-border'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Coffee size={14} className="text-amber-500" /> {d.name}
                    </span>
                    <span className="font-bold text-muted-foreground">{d.price > 0 ? `+₹${d.price}` : 'None'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Meal Card Summary with Reset option */}
            <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
              <div className="flex items-center justify-between text-xs font-bold border-b border-amber-500/20 pb-2">
                <span className="text-amber-600 dark:text-amber-400">Meal Plate Summary</span>
                <button
                  type="button"
                  onClick={resetSelection}
                  className="text-red-500 hover:underline flex items-center gap-1 text-[11px]"
                  title="Reset combo plate"
                >
                  <RotateCcw size={12} /> Reset Combo
                </button>
              </div>

              <ul className="mt-2.5 flex flex-col gap-1 text-xs text-muted-foreground">
                <li className="font-semibold text-foreground flex items-center justify-between">
                  <span>• {selectedBase.name}</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">₹{selectedBase.price}</span>
                </li>

                {selectedSide.price > 0 ? (
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      • Side: {selectedSide.name}
                      <button type="button" onClick={() => setSelectedSide(SIDES[0])} className="text-red-500 hover:opacity-80">
                        <X size={12} />
                      </button>
                    </span>
                    <span className="font-bold">+₹{selectedSide.price}</span>
                  </li>
                ) : (
                  <li className="text-[11px] italic opacity-60">• Side: None</li>
                )}

                {selectedDrink.price > 0 ? (
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      • Drink: {selectedDrink.name}
                      <button type="button" onClick={() => setSelectedDrink(DRINKS[0])} className="text-red-500 hover:opacity-80">
                        <X size={12} />
                      </button>
                    </span>
                    <span className="font-bold">+₹{selectedDrink.price}</span>
                  </li>
                ) : (
                  <li className="text-[11px] italic opacity-60">• Drink: None</li>
                )}

                <li className="flex items-center justify-between pt-1">
                  <span>• Accompaniments ({selectedChutneys.length})</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Included Free</span>
                </li>
              </ul>

              <div className="mt-3 flex items-center justify-between border-t border-amber-500/20 pt-2 text-sm font-black">
                <span>Total:</span>
                <span className="text-amber-600 dark:text-amber-400">₹{totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Ala-Carte Order Footer Strip */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4 text-xs font-semibold">
          <p className="text-muted-foreground">
            💡 Prefer ordering individual single items? You can order single Dosas, Idlis, Coffee & Sweets anytime.
          </p>
          <Link
            href="/menu"
            className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 font-extrabold text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white transition shrink-0"
          >
            Browse Full Ala-Carte Menu →
          </Link>
        </div>
      </div>
    </section>
  )
}
