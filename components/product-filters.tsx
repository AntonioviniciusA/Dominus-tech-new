"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/lib/store-context"
import { ChevronDown } from "lucide-react"

interface ProductFiltersProps {
  onFiltersChange: (filters: {
    minPrice: number
    maxPrice: number
    departments: string[]
    categories: string[]
  }) => void
}

export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const { departments, categories } = useStore()
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(10000)
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    departments: true,
    categories: true,
  })

  useEffect(() => {
    onFiltersChange({
      minPrice,
      maxPrice,
      departments: selectedDepartments,
      categories: selectedCategories,
    })
  }, [minPrice, maxPrice, selectedDepartments, selectedCategories, onFiltersChange])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const toggleDepartment = (deptId: string) => {
    setSelectedDepartments((prev) => (prev.includes(deptId) ? prev.filter((d) => d !== deptId) : [...prev, deptId]))
  }

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) => (prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]))
  }

  const clearFilters = () => {
    setMinPrice(0)
    setMaxPrice(10000)
    setSelectedDepartments([])
    setSelectedCategories([])
  }

  const hasActiveFilters =
    selectedDepartments.length > 0 || selectedCategories.length > 0 || minPrice > 0 || maxPrice < 10000

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-gray-900">Filtros</h3>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-green-600 text-sm hover:underline font-medium">
            Limpar
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Faixa de Preço */}
        <div>
          <button
            onClick={() => toggleSection("price")}
            className="w-full flex items-center justify-between mb-3 hover:text-green-600 transition-colors"
          >
            <h4 className="font-semibold text-gray-900">Faixa de Preço</h4>
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.price ? "rotate-180" : ""}`} />
          </button>
          {expandedSections.price && (
            <div className="space-y-3 ml-2">
              <input
                type="range"
                min="0"
                max="10000"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full accent-green-600"
              />
              <input
                type="range"
                min="0"
                max="10000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-green-600"
              />
              <div className="flex justify-between text-sm text-gray-700 bg-gray-50 p-2 rounded">
                <span>R$ {minPrice.toLocaleString("pt-BR")}</span>
                <span>R$ {maxPrice.toLocaleString("pt-BR")}</span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Departamentos */}
        {departments.length > 0 && (
          <>
            <div>
              <button
                onClick={() => toggleSection("departments")}
                className="w-full flex items-center justify-between mb-3 hover:text-green-600 transition-colors"
              >
                <h4 className="font-semibold text-gray-900">Departamentos</h4>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expandedSections.departments ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSections.departments && (
                <div className="space-y-2 ml-2">
                  {departments.map((dept) => (
                    <label key={dept.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedDepartments.includes(dept.id)}
                        onChange={() => toggleDepartment(dept.id)}
                        className="accent-green-600 w-4 h-4"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">{dept.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200"></div>
          </>
        )}

        {/* Categorias */}
        {categories.length > 0 && (
          <div>
            <button
              onClick={() => toggleSection("categories")}
              className="w-full flex items-center justify-between mb-3 hover:text-green-600 transition-colors"
            >
              <h4 className="font-semibold text-gray-900">Categorias</h4>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${expandedSections.categories ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSections.categories && (
              <div className="space-y-2 ml-2">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                      className="accent-green-600 w-4 h-4"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{cat.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
