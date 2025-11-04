"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store-context"

export function InitTestData() {
  const { departments, categories, products, addDepartment, addCategory, addProduct } = useStore()

  useEffect(() => {
    // Only initialize if empty
    if (departments.length === 0 && categories.length === 0 && products.length === 0) {
      // Add test departments
      addDepartment({ name: "Smartphones", slug: "smartphones" })
      addDepartment({ name: "Laptops", slug: "laptops" })
      addDepartment({ name: "Acessórios", slug: "acessorios" })

      // Add test categories
      addCategory({ name: "Orçamento", slug: "orcamento" })
      addCategory({ name: "Intermediário", slug: "intermediario" })
      addCategory({ name: "Premium", slug: "premium" })

      const allDepts = [
        { id: "dept-1", name: "Smartphones", slug: "smartphones" },
        { id: "dept-2", name: "Laptops", slug: "laptops" },
        { id: "dept-3", name: "Acessórios", slug: "acessorios" },
      ]

      const allCats = [
        { id: "cat-1", name: "Orçamento", slug: "orcamento" },
        { id: "cat-2", name: "Intermediário", slug: "intermediario" },
        { id: "cat-3", name: "Premium", slug: "premium" },
      ]

      const testProducts = [
        {
          name: "REDMI 14C 128GB 8GB",
          description: "128GB de armazenamento interno 4GB de memória RAM 6,88 polegadas de tela 50 MP câmera traseira",
          price: 899.99,
          image: "/redmi-14c-smartphone.jpg",
          departmentId: allDepts[0].id,
          categoryId: allCats[0].id,
          installments: 10,
          installmentPrice: 89.99,
        },
        {
          name: "iPhone 15 Pro",
          description: "Chip A17 Pro Tela Super Retina XDR 6.1 polegadas câmera de 48MP",
          price: 4299.99,
          image: "/iphone-15-pro.png",
          departmentId: allDepts[0].id,
          categoryId: allCats[2].id,
          installments: 12,
          installmentPrice: 358.33,
        },
        {
          name: "Samsung Galaxy S24",
          description: "Tela AMOLED 6.2 polegadas Processador Snapdragon 8 Gen 3 câmera 50MP",
          price: 3999.99,
          image: "/samsung-galaxy-s24.png",
          departmentId: allDepts[0].id,
          categoryId: allCats[1].id,
          installments: 12,
          installmentPrice: 333.33,
        },
        {
          name: "MacBook Air M3",
          description: "Processador M3 16GB RAM 512GB SSD tela 13.6 polegadas",
          price: 7999.99,
          image: "/macbook-air-m3.jpg",
          departmentId: allDepts[1].id,
          categoryId: allCats[2].id,
          installments: 12,
          installmentPrice: 666.67,
        },
        {
          name: "Laptop Dell XPS 13",
          description: "Intel Core i7 16GB RAM 512GB SSD tela FHD 13.3 polegadas",
          price: 5999.99,
          image: "/dell-xps-13-laptop.png",
          departmentId: allDepts[1].id,
          categoryId: allCats[1].id,
          installments: 12,
          installmentPrice: 499.99,
        },
        {
          name: "Fone AirPods Pro 2",
          description: "Cancelamento ativo de ruído autonomia até 6 horas carregamento USB-C",
          price: 1299.99,
          image: "/airpods-pro-2.png",
          departmentId: allDepts[2].id,
          categoryId: allCats[1].id,
          installments: 12,
          installmentPrice: 108.33,
        },
        {
          name: "Carregador Rápido 65W",
          description: "Carregador USB-C 65W compatível com smartphones e laptops",
          price: 149.99,
          image: "/charger-65w.jpg",
          departmentId: allDepts[2].id,
          categoryId: allCats[0].id,
          installments: 3,
          installmentPrice: 49.99,
        },
        {
          name: "Cabo USB-C Trançado",
          description: "Cabo USB-C de 2 metros com revestimento trançado resistente",
          price: 49.99,
          image: "/usb-c-cable.jpg",
          departmentId: allDepts[2].id,
          categoryId: allCats[0].id,
          installments: 1,
          installmentPrice: 49.99,
        },
      ]

      testProducts.forEach((product) => {
        addProduct(product)
      })
    }
  }, [addDepartment, addCategory, addProduct, departments.length, categories.length, products.length])

  return null
}
