'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import PageHeader from '@/components/ui/PageHeader'
import MenuTabBar, { type MenuTab } from '@/components/menu/MenuTabBar'
import CategoryFilter from '@/components/menu/CategoryFilter'
import DonutCard from '@/components/menu/DonutCard'
import DrinkCard from '@/components/menu/DrinkCard'
import DrinkDetailModal from '@/components/menu/DrinkDetailModal'
import { donuts } from '@/lib/data/donuts'
import { drinks } from '@/lib/data/drinks'
import type { Donut, Drink } from '@/lib/types'

// ============================================================
// GLAZZY — Menu Page
// ============================================================

const DONUT_CATEGORIES: { value: Donut['category'] | 'all'; label: string }[] = [
  { value: 'all',    label: 'Semua' },
  { value: 'classic', label: 'Classic Ring' },
  { value: 'berry',   label: 'Berry Series' },
  { value: 'filled',  label: 'Filled' },
  { value: 'savory',  label: 'Savory' },
]

const DRINK_CATEGORIES: { value: Drink['category'] | 'all'; label: string }[] = [
  { value: 'all',        label: 'Semua' },
  { value: 'coffee',     label: 'Coffee' },
  { value: 'non-coffee', label: 'Non-Coffee' },
  { value: 'frappe',     label: 'Frappe' },
  { value: 'tea',        label: 'Tea' },
]

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 24 } },
}

export default function MenuPage() {
  const prefersReduced = useReducedMotion()
  const [activeTab, setActiveTab] = useState<MenuTab>('donut')
  const [donutCat, setDonutCat] = useState<string>('all')
  const [drinkCat, setDrinkCat] = useState<string>('all')
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null)

  const handleTabChange = useCallback((tab: MenuTab) => {
    setActiveTab(tab)
  }, [])

  const handleViewDrinkDetail = useCallback((drink: Drink) => {
    setSelectedDrink(drink)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedDrink(null)
  }, [])

  const filteredDonuts = useMemo(
    () => donuts.filter((d) => d.isAvailable && (donutCat === 'all' || d.category === donutCat)),
    [donutCat],
  )

  const filteredDrinks = useMemo(
    () => drinks.filter((d) => d.isAvailable && (drinkCat === 'all' || d.category === drinkCat)),
    [drinkCat],
  )

  const donutFilterOptions = DONUT_CATEGORIES.map((cat) => ({
    value: cat.value,
    label: cat.label,
    count: cat.value === 'all'
      ? donuts.filter((d) => d.isAvailable).length
      : donuts.filter((d) => d.isAvailable && d.category === cat.value).length,
  }))

  const drinkFilterOptions = DRINK_CATEGORIES.map((cat) => ({
    value: cat.value,
    label: cat.label,
    count: cat.value === 'all'
      ? drinks.filter((d) => d.isAvailable).length
      : drinks.filter((d) => d.isAvailable && d.category === cat.value).length,
  }))

  return (
    <>
      <PageHeader
        title="Menu GLAZZY"
        subtitle="Fresh setiap pagi — pilih favoritmu."
        eyebrow="Made fresh. Glazed right."
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Tab switcher */}
        <div className="mb-6 flex justify-center">
          <MenuTabBar active={activeTab} onChange={handleTabChange} />
        </div>

        {/* Category filter */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            {activeTab === 'donut' ? (
              <motion.div
                key="donut-filter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <CategoryFilter
                  options={donutFilterOptions}
                  active={donutCat}
                  onChange={setDonutCat}
                />
              </motion.div>
            ) : (
              <motion.div
                key="drink-filter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <CategoryFilter
                  options={drinkFilterOptions}
                  active={drinkCat}
                  onChange={setDrinkCat}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Grid produk */}
        <AnimatePresence mode="wait">
          {activeTab === 'donut' ? (
            <motion.div
              key={`donut-${donutCat}`}
              role="tabpanel"
              id="tabpanel-donut"
              aria-labelledby="tab-donut"
              variants={prefersReduced ? {} : gridVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5"
            >
              {filteredDonuts.map((donut) => (
                <motion.div key={donut.id} variants={prefersReduced ? {} : cardVariants}>
                  <DonutCard donut={donut} />
                </motion.div>
              ))}
              {filteredDonuts.length === 0 && (
                <p className="col-span-full py-16 text-center text-midnight/40">
                  Tidak ada donut di kategori ini.
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={`drink-${drinkCat}`}
              role="tabpanel"
              id="tabpanel-drink"
              aria-labelledby="tab-drink"
              variants={prefersReduced ? {} : gridVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5"
            >
              {filteredDrinks.map((drink) => (
                <motion.div key={drink.id} variants={prefersReduced ? {} : cardVariants}>
                  <DrinkCard drink={drink} onViewDetail={handleViewDrinkDetail} />
                </motion.div>
              ))}
              {filteredDrinks.length === 0 && (
                <p className="col-span-full py-16 text-center text-midnight/40">
                  Tidak ada minuman di kategori ini.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Drink detail modal */}
      <DrinkDetailModal drink={selectedDrink} onClose={handleCloseModal} />
    </>
  )
}
