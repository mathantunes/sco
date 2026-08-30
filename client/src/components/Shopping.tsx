import { useState } from 'react'
import type { Menu } from 'contracts/menu'
import type { OpenOrder } from 'contracts/order'
import { useSession } from '../providers/useSession'
import { Category } from './Category'
import { CategoryPopover } from './CategoryPopover'
import { OpenOrder as OpenOrderPanel } from './OpenOrder'
import { Header } from './Header'

type ShoppingProps = {
    deviceId: string
    menu: Menu[]
    order: OpenOrder
}

export function Shopping({ deviceId, menu, order }: ShoppingProps) {
    const { isLoading, addItem, resetSession } = useSession()
    const categories = menu.flatMap((section) => section.categories.map((category) => ({
        ...category,
        key: `${section.id}-${category.id}`,
    })))
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(-1)
    const [isCategoryOpen, setIsCategoryOpen] = useState(false)
    const selectedCategory = categories[selectedCategoryIndex]

    function closeCategoryPopover() {
        setIsCategoryOpen(false)
        setSelectedCategoryIndex(-1)
    }

    async function handleAddProduct(productId: string) {
        await addItem(productId)
        closeCategoryPopover()
    }

    return (
        <main className="min-h-svh bg-paper px-5 py-4 text-ink sm:px-8 lg:px-12">
            <Header deviceId={deviceId} onReset={resetSession} />

            <section className="mt-10">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-coral">Today’s shelf</p>
            </section>

            <section>
                <div className="mx-auto grid min-h-[calc(100svh-14rem)] max-w-7xl items-stretch gap-8 py-8 md:grid-cols-[minmax(10rem,12rem)_minmax(0,1fr)] lg:gap-10">
                    <nav aria-label="Menu categories" className="flex max-h-fit min-w-0 flex-col gap-2 rounded-xl border border-line bg-white/30 p-3 lg:border-0 lg:bg-transparent lg:p-0 lg:pr-6">
                        {categories.map((category) => (
                            <Category
                                key={category.key}
                                name={category.name}
                                isSelected={selectedCategory?.key === category.key}
                                onSelect={() => {
                                    setSelectedCategoryIndex(categories.findIndex((item) => item.key === category.key))
                                    setIsCategoryOpen(true)
                                }}
                            />
                        ))}
                    </nav>

                    <OpenOrderPanel order={order} />
                </div>
            </section>

            {isCategoryOpen && selectedCategory && (
                <CategoryPopover
                    category={selectedCategory}
                    isLoading={isLoading}
                    onAddProduct={(productId) => void handleAddProduct(productId)}
                    onClose={closeCategoryPopover}
                />
            )}

        </main>
    )
}
