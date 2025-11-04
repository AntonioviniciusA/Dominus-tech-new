"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Department {
  id: string
  name: string
  slug: string
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  departmentId: string
  categoryId: string
  installments?: number
  installmentPrice?: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Analytics {
  productId: string
  productName: string
  clicks: number
  lastClicked: string
}

interface StoreContextType {
  departments: Department[]
  categories: Category[]
  products: Product[]
  cart: CartItem[]
  analytics: Analytics[]
  cookiesAccepted: boolean
  addDepartment: (department: Omit<Department, "id">) => void
  addCategory: (category: Omit<Category, "id">) => void
  addProduct: (product: Omit<Product, "id">) => void
  updateDepartment: (id: string, department: Partial<Department>) => void
  updateCategory: (id: string, category: Partial<Category>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteDepartment: (id: string) => void
  deleteCategory: (id: string) => void
  deleteProduct: (id: string) => void
  getProductsByDepartment: (departmentId: string) => Product[]
  getProductsByCategory: (categoryId: string) => Product[]
  addCart: (product: Product, quantity: number) => void
  removeCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  trackProductClick: (product: Product) => void
  getAnalytics: () => Analytics[]
  setCookiesAccepted: (accepted: boolean) => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [departments, setDepartments] = useState<Department[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [analytics, setAnalytics] = useState<Analytics[]>([])
  const [cookiesAccepted, setCookiesAcceptedState] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const storedDepartments = localStorage.getItem("departments")
    const storedCategories = localStorage.getItem("categories")
    const storedProducts = localStorage.getItem("products")
    const storedCart = localStorage.getItem("cart")
    const storedAnalytics = localStorage.getItem("analytics")
    const storedCookiesAccepted = localStorage.getItem("cookiesAccepted")

    if (storedDepartments) setDepartments(JSON.parse(storedDepartments))
    if (storedCategories) setCategories(JSON.parse(storedCategories))
    if (storedProducts) setProducts(JSON.parse(storedProducts))
    if (storedCart) setCart(JSON.parse(storedCart))
    if (storedAnalytics) setAnalytics(JSON.parse(storedAnalytics))
    if (storedCookiesAccepted) setCookiesAcceptedState(JSON.parse(storedCookiesAccepted))

    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("departments", JSON.stringify(departments))
    }
  }, [departments, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("categories", JSON.stringify(categories))
    }
  }, [categories, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("products", JSON.stringify(products))
    }
  }, [products, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("analytics", JSON.stringify(analytics))
    }
  }, [analytics, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cookiesAccepted", JSON.stringify(cookiesAccepted))
    }
  }, [cookiesAccepted, isLoaded])

  const addDepartment = (department: Omit<Department, "id">) => {
    const newDepartment = { ...department, id: Date.now().toString() }
    setDepartments([...departments, newDepartment])
  }

  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory = { ...category, id: Date.now().toString() }
    setCategories([...categories, newCategory])
  }

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = { ...product, id: Date.now().toString() }
    setProducts([...products, newProduct])
  }

  const addCart = (product: Product, quantity: number) => {
    const existingItem = cart.find((item) => item.product.id === product.id)
    if (existingItem) {
      updateCartQuantity(product.id, existingItem.quantity + quantity)
    } else {
      setCart([...cart, { product, quantity }])
    }
  }

  const removeCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId))
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeCart(productId)
    } else {
      setCart(cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
    }
  }

  const clearCart = () => {
    setCart([])
  }

  const trackProductClick = (product: Product) => {
    setAnalytics((prev) => {
      const existing = prev.find((a) => a.productId === product.id)
      if (existing) {
        return prev.map((a) =>
          a.productId === product.id ? { ...a, clicks: a.clicks + 1, lastClicked: new Date().toISOString() } : a,
        )
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            productName: product.name,
            clicks: 1,
            lastClicked: new Date().toISOString(),
          },
        ]
      }
    })
  }

  const getAnalytics = () => {
    return analytics
  }

  const setCookiesAccepted = (accepted: boolean) => {
    setCookiesAcceptedState(accepted)
  }

  const updateDepartment = (id: string, department: Partial<Department>) => {
    setDepartments(departments.map((d) => (d.id === id ? { ...d, ...department } : d)))
  }

  const updateCategory = (id: string, category: Partial<Category>) => {
    setCategories(categories.map((c) => (c.id === id ? { ...c, ...category } : c)))
  }

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, ...product } : p)))
  }

  const deleteDepartment = (id: string) => {
    setDepartments(departments.filter((d) => d.id !== id))
  }

  const deleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id))
  }

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const getProductsByDepartment = (departmentId: string) => {
    return products.filter((p) => p.departmentId === departmentId)
  }

  const getProductsByCategory = (categoryId: string) => {
    return products.filter((p) => p.categoryId === categoryId)
  }

  return (
    <StoreContext.Provider
      value={{
        departments,
        categories,
        products,
        cart,
        analytics,
        cookiesAccepted,
        addDepartment,
        addCategory,
        addProduct,
        addCart,
        removeCart,
        updateCartQuantity,
        clearCart,
        trackProductClick,
        getAnalytics,
        setCookiesAccepted,
        updateDepartment,
        updateCategory,
        updateProduct,
        deleteDepartment,
        deleteCategory,
        deleteProduct,
        getProductsByDepartment,
        getProductsByCategory,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
