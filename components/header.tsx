"use client";

import { Search, ShoppingCart, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useStore } from "@/lib/store-context";

export function Header() {
  const [isDepartmentsOpen, setIsDepartmentsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { departments, categories, products, cart } = useStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDepartmentsOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  return (
    <header className="bg-black border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/images/design-mode/Logo-light.png"
              alt="Dominus Tech Logo"
              width={80}
              height={80}
              className="hover:opacity-80 transition-opacity"
            />
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDepartmentsOpen(!isDepartmentsOpen)}
              className="flex items-center gap-2 text-white hover:text-primary transition-colors"
            >
              <span className="text-sm font-medium mx-1 px-1">
                DEPARTAMENTOS
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isDepartmentsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDepartmentsOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                {departments.length > 0 ? (
                  departments.map((dept) => (
                    <Link
                      key={dept.id}
                      href={`/departamento/${dept.slug}`}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-primary transition-colors"
                      onClick={() => setIsDepartmentsOpen(false)}
                    >
                      {dept.name}
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500 text-sm">
                    Nenhum departamento cadastrado
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-xl mx-8 relative" ref={searchRef}>
            <div className="relative">
              <Input
                type="text"
                placeholder="Pesquise seu produto"
                className="w-full bg-white text-black pl-4 pr-10 py-2 rounded-lg"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg py-2 z-50">
                {searchResults.slice(0, 5).map((product) => (
                  <Link
                    key={product.id}
                    href={`/produto/${product.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm"
                    onClick={() => setShowSearchResults(false)}
                  >
                    {product.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center">
            <Link
              href="/carrinho"
              className="flex flex-col items-center text-white hover:text-primary transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5 mb-1" />
              <span className="text-xs">Carrinho</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 pb-3 overflow-x-auto">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categoria/${category.slug}`}
              className="text-white hover:text-primary transition-colors text-sm font-medium whitespace-nowrap"
            >
              {category.name.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
