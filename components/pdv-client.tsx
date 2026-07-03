"use client"

import { useMemo, useState, useEffect } from "react"
import Image from "next/image"
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  Banknote,
  QrCode,
  X,
  CheckCircle2,
  FileText,
  Save,
} from "lucide-react"

import { produtos as produtosPadrao } from "@/data/produtos"
import { clientes as clientesPadrao } from "@/data/clientes"
import type { Produto, FormaPagamento, ItemCarrinho } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { toast } from "sonner"

const formasPagamento: { value: FormaPagamento; label: string; icon: typeof CreditCard }[] = [
  { value: "Dinheiro", label: "Dinheiro", icon: Banknote },
  { value: "PIX", label: "Pix", icon: QrCode },
  { value: "Cartão de Crédito", label: "Crédito", icon: CreditCard },
  { value: "Cartão de Débito", label: "Débito", icon: CreditCard },
]

export function PdvClient() {
  const [busca, setBusca] = useState("")
  const [categoria, setCategoria] = useState("todas")
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([])
  const [clienteId, setClienteId] = useState<string>("avulso")
  const [pagamento, setPagamento] = useState<FormaPagamento>("PIX")
  const [desconto, setDesconto] = useState(0)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [sucessoOpen, setSucessoOpen] = useState(false)
  const [notaOpen, setNotaOpen] = useState(false)
  
  // Estado para dados do backend
  const [produtos, setProdutos] = useState<Produto[]>(produtosPadrao)
  const [clientes, setClientes] = useState(clientesPadrao)
  const [carregando, setCarregando] = useState(true)
  const [finalizando, setFinalizando] = useState(false)
  
  // Estado para dados da venda finalizada
  const [vendaFinalizada, setVendaFinalizada] = useState<any>(null)

  // Fetch de produtos do backend
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch("/api/pdv/products")
        if (response.ok) {
          const data = await response.json()
          setProdutos(data)
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error)
        // Usa dados padrão em caso de erro
      } finally {
        setCarregando(false)
      }
    }

    fetchProdutos()
  }, [])

  // Fetch de clientes do backend
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch("/api/pdv/clients")
        if (response.ok) {
          const data = await response.json()
          setClientes(data)
        }
      } catch (error) {
        console.error("Erro ao buscar clientes:", error)
        // Usa dados padrão em caso de erro
      }
    }

    fetchClientes()
  }, [])

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      const matchBusca =
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.codigo.toLowerCase().includes(busca.toLowerCase())
      const matchCat = categoria === "todas" || p.categoria === categoria
      return matchBusca && matchCat
    })
  }, [busca, categoria, produtos])

  const categorias = useMemo(() => {
    return Array.from(new Set(produtos.map((p) => p.categoria)))
  }, [produtos])

  const subtotal = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0)
  const total = Math.max(0, subtotal - desconto)
  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0)

  function adicionar(produto: Produto) {
    if (produto.estoque <= 0) {
      toast.error("Produto sem estoque")
      return
    }
    setCarrinho((prev) => {
      const existente = prev.find((i) => i.id === produto.id)
      if (existente) {
        if (existente.quantidade >= produto.estoque) {
          toast.error("Quantidade máxima em estoque atingida")
          return prev
        }
        return prev.map((i) =>
          i.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i,
        )
      }
      return [...prev, { ...produto, quantidade: 1 }]
    })
  }

  function alterarQtd(produtoId: string, delta: number) {
    setCarrinho((prev) =>
      prev
        .map((i) => {
          if (i.id !== produtoId) return i
          const novaQtd = i.quantidade + delta
          if (novaQtd > i.estoque) {
            toast.error("Quantidade máxima em estoque atingida")
            return i
          }
          return { ...i, quantidade: novaQtd }
        })
        .filter((i) => i.quantidade > 0),
    )
  }

  function remover(produtoId: string) {
    setCarrinho((prev) => prev.filter((i) => i.id !== produtoId))
  }

  async function finalizar() {
    setFinalizando(true)
    try {
      const response = await fetch("/api/pdv/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clienteId,
          itens: carrinho,
          subtotal,
          desconto,
          total,
          formaPagamento: pagamento,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Erro ao finalizar venda")
        return
      }

      const result = await response.json()
      toast.success("Venda registrada com sucesso!")
      setCheckoutOpen(false)
      setVendaFinalizada(result)
      setNotaOpen(true)
    } catch (error) {
      console.error("Erro ao finalizar venda:", error)
      toast.error("Erro ao conectar com o servidor")
    } finally {
      setFinalizando(false)
    }
  }

  function novaVenda() {
    setCarrinho([])
    setClienteId("avulso")
    setPagamento("PIX")
    setDesconto(0)
    setSucessoOpen(false)
  }

  async function emitirNota() {
    setFinalizando(true)
    try {
      const response = await fetch("/api/pdv/emit-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clienteId,
          itens: carrinho,
          subtotal,
          desconto,
          total,
          formaPagamento: pagamento,
          clienteNome: clientes.find((c) => c.id === clienteId)?.nome || "Consumidor final",
          clienteEmail: clientes.find((c) => c.id === clienteId)?.email,
          clienteCPFCNPJ: clientes.find((c) => c.id === clienteId)?.cpf_cnpj || "00000000000000",
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Erro ao emitir nota fiscal")
        return
      }

      const result = await response.json()
      toast.success("Nota fiscal emitida com sucesso!")
      setNotaOpen(false)
      novaVenda()
    } catch (error) {
      console.error("Erro ao emitir nota fiscal:", error)
      toast.error("Erro ao conectar com o servidor")
    } finally {
      setFinalizando(false)
    }
  }

  function salvarPlanta() {
    // Salvar a venda como planta (sem nota)
    toast.success("Venda salva como planta!")
    setNotaOpen(false)
    novaVenda()
  }

  return (
    <div className="grid flex-1 gap-4 lg:grid-cols-[1fr_380px]">
      {/* Produtos */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <InputGroup className="sm:max-w-xs">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Buscar produto ou código..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </InputGroup>
          <ToggleGroup
            type="single"
            value={categoria}
            onValueChange={(v) => v && setCategoria(v as string)}
            className="flex-wrap"
          >
            <ToggleGroupItem value="todas">Todas</ToggleGroupItem>
            {categorias.map((c) => (
              <ToggleGroupItem key={c} value={c}>
                {c}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <ScrollArea className="h-[calc(100vh-15rem)]">
          {produtosFiltrados.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Search />
                </EmptyMedia>
                <EmptyTitle>Nenhum produto encontrado</EmptyTitle>
                <EmptyDescription>Tente ajustar a busca ou a categoria.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid grid-cols-2 gap-3 pr-3 md:grid-cols-3 xl:grid-cols-4">
              {produtosFiltrados.map((produto) => (
                <button
                  key={produto.id}
                  type="button"
                  onClick={() => adicionar(produto)}
                  className="group text-left"
                  disabled={produto.estoque <= 0}
                >
                  <Card className="overflow-hidden p-0 transition-colors group-hover:border-primary group-disabled:opacity-50">
                    <div className="relative aspect-square bg-muted">
                      <Image
                        src={produto.imagem || "/placeholder.svg"}
                        alt={produto.nome}
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                      {produto.estoque <= produto.estoqueMinimo && (
                        <Badge
                          variant={produto.estoque <= 0 ? "destructive" : "secondary"}
                          className="absolute left-2 top-2"
                        >
                          {produto.estoque <= 0 ? "Esgotado" : "Estoque baixo"}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="flex flex-col gap-1 p-3">
                      <p className="line-clamp-2 text-sm font-medium leading-snug">{produto.nome}</p>
                      <p className="text-xs text-muted-foreground">{produto.codigo}</p>
                      <p className="mt-1 font-semibold text-primary">{formatCurrency(produto.preco)}</p>
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Carrinho */}
      <Card className="flex flex-col">
        <CardContent className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="size-5 text-primary" />
            <h2 className="font-semibold">Carrinho</h2>
            {totalItens > 0 && <Badge variant="secondary">{totalItens}</Badge>}
          </div>

          <Select value={clienteId} onValueChange={setClienteId}>
            <SelectTrigger>
              <SelectValue placeholder="Cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="avulso">Cliente avulso</SelectItem>
                {clientes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nome}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Separator />

          <ScrollArea className="h-[calc(100vh-30rem)] flex-1">
            {carrinho.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 py-12 text-center text-sm text-muted-foreground">
                <ShoppingCart className="size-8 opacity-40" />
                <p>Carrinho vazio</p>
                <p className="text-xs">Clique em um produto para adicionar.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pr-3">
                {carrinho.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.imagem || "/placeholder.svg"}
                        alt={item.nome}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-1 text-sm font-medium">{item.nome}</p>
                        <button
                          type="button"
                          onClick={() => remover(item.id)}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                          aria-label="Remover item"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="outline"
                            className="size-7"
                            onClick={() => alterarQtd(item.id, -1)}
                          >
                            <Minus />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantidade}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="size-7"
                            onClick={() => alterarQtd(item.id, 1)}
                          >
                            <Plus />
                          </Button>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatCurrency(item.preco * item.quantidade)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <Separator />

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Desconto</span>
              <InputGroup className="w-28">
                <InputGroupAddon>R$</InputGroupAddon>
                <InputGroupInput
                  type="number"
                  min={0}
                  value={desconto || ""}
                  onChange={(e) => setDesconto(Math.max(0, Number(e.target.value)))}
                  className="text-right"
                />
              </InputGroup>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>

          <Button
            size="lg"
            disabled={carrinho.length === 0 || finalizando}
            onClick={() => setCheckoutOpen(true)}
          >
            <CreditCard data-icon="inline-start" />
            {finalizando ? "Processando..." : "Finalizar venda"}
          </Button>
        </CardContent>
      </Card>

      {/* Checkout dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Forma de pagamento</DialogTitle>
            <DialogDescription>
              Selecione como o cliente irá pagar {formatCurrency(total)}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            {formasPagamento.map((fp) => (
              <button
                key={fp.value}
                type="button"
                onClick={() => setPagamento(fp.value)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors",
                  pagamento === fp.value
                    ? "border-primary bg-accent text-accent-foreground"
                    : "hover:bg-muted",
                )}
              >
                <fp.icon className="size-6" />
                <span className="text-sm font-medium">{fp.label}</span>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutOpen(false)} disabled={finalizando}>
              Cancelar
            </Button>
            <Button onClick={finalizar} disabled={finalizando}>
              {finalizando ? "Processando..." : "Confirmar pagamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sucesso dialog */}
      <Dialog open={notaOpen} onOpenChange={setNotaOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent text-primary">
              <CheckCircle2 className="size-8" />
            </div>
            <DialogTitle className="text-center">Venda concluída!</DialogTitle>
            <DialogDescription className="text-center">
              Pagamento de {formatCurrency(total)} via {pagamento} registrado com sucesso.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={salvarPlanta} className="h-auto flex-col gap-2 py-4">
              <Save className="size-6" />
              <span className="text-xs text-center">Salvar planta</span>
            </Button>
            <Button onClick={emitirNota} className="h-auto flex-col gap-2 py-4">
              <FileText className="size-6" />
              <span className="text-xs text-center">Emitir nota</span>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" className="w-full" onClick={novaVenda}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
