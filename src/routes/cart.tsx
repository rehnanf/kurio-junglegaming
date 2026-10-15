import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { ShoppingCart, Trash2, Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { NftArt } from '@/components/nft/nft-art';
import { NftCard } from '@/components/nft/nft-card';
import {
  useApplyCoupon,
  useCart,
  useRemoveCoupon,
  useRemoveFromCart,
  useUpdateCartItem,
} from '@/hooks/use-cart';
import { useGuestCart } from '@/hooks/use-guest-cart';
import { useNftList } from '@/hooks/use-nfts';
import { useAuth } from '@/hooks/use-auth';
import { formatEthValue } from '@/lib/format';
import { lineTotal } from '@/lib/line-total';
import type { CartItem, CartTotals, Nft } from '@/types';

export const Route = createFileRoute('/cart')({ component: CartPage });

// O carrinho permanece acessível ao visitante; a autenticação é exigida no checkout.
function CartPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const serverCart = useCart();
  const guest = useGuestCart();
  const update = useUpdateCartItem();
  const remove = useRemoveFromCart();
  const applyCoupon = useApplyCoupon();
  const removeCoupon = useRemoveCoupon();
  const nftQuery = useNftList({ pageSize: 48 });
  const [code, setCode] = useState('');

  const cart = isAuthenticated ? serverCart.data : guest.cart;
  const items = cart?.items ?? [];
  const nftMap = new Map((nftQuery.data?.data ?? []).map((nft) => [nft.id, nft]));
  const suggestions = (nftQuery.data?.data ?? [])
    .filter((nft) => !items.some((item) => item.nftId === nft.id))
    .slice(0, 5);

  const handleQuantity = (item: CartItem, nextQuantity: number) => {
    const nft = nftMap.get(item.nftId);
    const max = nft?.edition.total;
    if (nextQuantity < 1 || (max !== undefined && nextQuantity > max)) return;
    if (!isAuthenticated) {
      guest.updateItem(item.nftId, nextQuantity);
      return;
    }
    update.mutate({ nftId: item.nftId, quantity: nextQuantity }, {
      onError: (err) => toast.error(err.message || 'Não foi possível alterar a quantidade.'),
    });
  };

  const handleRemove = (item: CartItem) => {
    if (!isAuthenticated) {
      guest.removeItem(item.nftId);
      toast.success('Item removido.');
      return;
    }
    remove.mutate(item.nftId, {
      onSuccess: () => toast.success('Item removido.'),
      onError: (err) => toast.error(err.message || 'Não foi possível remover o NFT.'),
    });
  };

  const handleCoupon = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!code.trim()) return;
    if (!isAuthenticated) {
      toast.info('Entre na sua conta para aplicar um código promocional.');
      return;
    }
    applyCoupon.mutate(code.trim().toUpperCase(), {
      onSuccess: ({ coupon }) => {
        toast.success(`Cupom ${coupon.code} aplicado.`);
        setCode('');
      },
      onError: (err) => toast.error(err.message || 'Cupom inválido.'),
    });
  };

  if (authLoading || (isAuthenticated && serverCart.isLoading)) {
    return (
      <section className="container kurio-cart-page py-8" aria-label="Carregando carrinho">
        <Skeleton className="mb-8 h-6 w-72" />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_334px] lg:gap-[72px]">
          <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-[88px]" />)}</div>
          <Skeleton className="h-[360px]" />
        </div>
      </section>
    );
  }

  if (!cart || items.length === 0) {
    return (
      <section className="container kurio-cart-page py-12">
        <CartBreadcrumb />
        <div className="mx-auto mt-12 max-w-lg bg-card px-7 py-12 text-center">
          <ShoppingCart className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
          <h1 className="mt-5 text-2xl font-bold">Seu carrinho está vazio</h1>
          <p className="mt-3 text-sm text-muted-foreground">Escolha suas obras favoritas para começar sua coleção.</p>
          <Button asChild className="mt-6"><Link to="/">Explorar catálogo</Link></Button>
        </div>
        <CartSuggestions suggestions={suggestions} />
      </section>
    );
  }

  return (
    <section className="container kurio-cart-page pb-12 pt-7 lg:pt-9">
      <CartBreadcrumb />

      <div className="kurio-cart-layout">
        <div className="min-w-0">
          <div className="kurio-cart-table-wrap hidden lg:block">
            <table className="kurio-cart-table w-full" aria-label="NFTs no carrinho">
              <colgroup>
                <col className="kurio-cart-col-nft" />
                <col className="kurio-cart-col-price" />
                <col className="kurio-cart-col-quantity" />
                <col className="kurio-cart-col-total" />
                <col className="kurio-cart-col-remove" />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">NFTs</th>
                  <th scope="col">Preço</th>
                  <th scope="col">Edições</th>
                  <th scope="col">Total</th>
                  <th scope="col"><span className="sr-only">Remover</span></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <CartTableRow
                    key={item.nftId}
                    item={item}
                    nft={nftMap.get(item.nftId)}
                    disabled={update.isPending || remove.isPending}
                    onQuantity={handleQuantity}
                    onRemove={handleRemove}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 lg:hidden" aria-label="NFTs no carrinho">
            <h1 className="mb-3 text-lg font-bold">Carrinho de NFTs</h1>
            {items.map((item) => (
              <CartMobileRow
                key={item.nftId}
                item={item}
                nft={nftMap.get(item.nftId)}
                disabled={update.isPending || remove.isPending}
                onQuantity={handleQuantity}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>

        <aside aria-label="Resumo do carrinho" className="kurio-cart-summary min-w-0">
          <h2>Resumo da carteira</h2>
          <form className="kurio-cart-coupon" onSubmit={handleCoupon}>
            <label htmlFor="cart-coupon">Código promocional</label>
            <div className="flex min-w-0">
              <input
                id="cart-coupon"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Digite o código promocional…"
                autoComplete="off"
              />
              <button type="submit" disabled={applyCoupon.isPending}>Aplicar</button>
            </div>
          </form>

          {cart.totals.appliedCoupon && (
            <p className="mt-3 flex items-center gap-2 text-xs text-primary">
              Cupom {cart.totals.appliedCoupon.code} aplicado.
              <button
                type="button"
                aria-label="Remover cupom"
                disabled={removeCoupon.isPending}
                onClick={() => removeCoupon.mutate(undefined, {
                  onSuccess: () => toast.success('Cupom removido.'),
                  onError: (err) => toast.error(err.message || 'Não foi possível remover o cupom.'),
                })}
              ><X className="h-4 w-4" /></button>
            </p>
          )}

          <CartTotalsSummary totals={cart.totals} />

          <Button asChild className="kurio-cart-checkout mt-6 w-full" size="lg">
            {isAuthenticated ? (
              <Link to="/checkout">Conectar e finalizar</Link>
            ) : (
              <Link to="/login" search={{ redirect: '/checkout' }}>Conectar e finalizar</Link>
            )}
          </Button>
          <Link to="/" className="mt-3 block text-center text-sm text-primary hover:underline">
            Continuar explorando
          </Link>
          {!isAuthenticated && (
            <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
              Seus NFTs estão salvos como visitante.{' '}
              <Link to="/login" search={{ redirect: '/cart' }} className="text-primary hover:underline">
                Entrar para sincronizar com sua conta
              </Link>
            </p>
          )}
        </aside>
      </div>

      <CartSuggestions suggestions={suggestions} />
    </section>
  );
}

function CartBreadcrumb() {
  return (
    <nav aria-label="Trilha" className="kurio-cart-breadcrumb mb-3 text-sm font-semibold">
      <Link to="/" className="hover:text-primary">Início</Link>
      <span aria-hidden="true">/</span>
      <Link to="/" search={{ sort: 'trending' }} className="hover:text-primary">Mercado</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">Carrinho</span>
    </nav>
  );
}

type CartRowProps = {
  item: CartItem;
  nft?: Nft;
  disabled: boolean;
  onQuantity: (item: CartItem, nextQuantity: number) => void;
  onRemove: (item: CartItem) => void;
};

function CartArtwork({ item, nft }: Pick<CartRowProps, 'item' | 'nft'>) {
  return (
    <Link to="/nft/$id" params={{ id: item.nftId }} className="kurio-cart-artwork" aria-label={`Ver ${nft?.name ?? item.nftId}`}>
      {nft ? <NftArt seed={nft.name} className="h-full w-full" /> : <Skeleton className="h-full w-full" />}
    </Link>
  );
}

function CartItemTitle({ item, nft }: Pick<CartRowProps, 'item' | 'nft'>) {
  return (
    <div className="min-w-0">
      <Link to="/nft/$id" params={{ id: item.nftId }} className="kurio-cart-item-title hover:text-primary">
        {nft?.name ?? item.nftId}
      </Link>
      <p className="kurio-cart-token">ID do token: {nft?.tokenId ?? '—'}</p>
    </div>
  );
}

function CartQuantity({ item, nft, disabled, onQuantity }: Omit<CartRowProps, 'onRemove'>) {
  const max = nft?.edition.total;
  return (
    <div className="kurio-cart-quantity">
      <button
        type="button"
        aria-label="Diminuir quantidade"
        disabled={disabled || item.quantity <= 1}
        onClick={() => onQuantity(item, item.quantity - 1)}
      ><Minus aria-hidden="true" className="h-4 w-4" /></button>
      <span aria-label={`Quantidade: ${item.quantity}`} className="tabular-nums">{item.quantity}</span>
      <button
        type="button"
        aria-label="Aumentar quantidade"
        disabled={disabled || (max !== undefined && item.quantity >= max)}
        onClick={() => onQuantity(item, item.quantity + 1)}
      ><Plus aria-hidden="true" className="h-4 w-4" /></button>
    </div>
  );
}

function CartTableRow(props: CartRowProps) {
  const { item, nft, disabled, onQuantity, onRemove } = props;
  return (
    <tr>
      <td>
        <div className="flex min-w-0 items-center gap-4">
          <CartArtwork item={item} nft={nft} />
          <CartItemTitle item={item} nft={nft} />
        </div>
      </td>
      <td className="kurio-cart-price">{formatEthValue(item.priceSnapshot.amount, 2)} ETH</td>
      <td><CartQuantity item={item} nft={nft} disabled={disabled} onQuantity={onQuantity} /></td>
      <td className="kurio-cart-line-total">{formatEthValue(lineTotal(item.priceSnapshot.amount, item.quantity), 2)} ETH</td>
      <td className="text-right">
        <button type="button" className="kurio-cart-remove" aria-label="Remover do carrinho" disabled={disabled} onClick={() => onRemove(item)}>
          <Trash2 aria-hidden="true" className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
}

function CartMobileRow(props: CartRowProps) {
  const { item, nft, disabled, onQuantity, onRemove } = props;
  return (
    <article className="kurio-cart-mobile-row">
      <div className="flex items-start gap-3">
        <CartArtwork item={item} nft={nft} />
        <div className="min-w-0 flex-1">
          <CartItemTitle item={item} nft={nft} />
          <p className="mt-2 text-xs text-muted-foreground">Preço: {formatEthValue(item.priceSnapshot.amount, 2)} ETH</p>
        </div>
        <button type="button" className="kurio-cart-remove" aria-label="Remover do carrinho" disabled={disabled} onClick={() => onRemove(item)}>
          <Trash2 aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <CartQuantity item={item} nft={nft} disabled={disabled} onQuantity={onQuantity} />
        <span className="kurio-cart-line-total">{formatEthValue(lineTotal(item.priceSnapshot.amount, item.quantity), 2)} ETH</span>
      </div>
    </article>
  );
}

function CartTotalsSummary({ totals }: { totals: CartTotals }) {
  return (
    <dl className="kurio-cart-totals">
      <div><dt>Subtotal</dt><dd>{formatEthValue(totals.subtotal, 2)} ETH</dd></div>
      <div><dt>Desconto do lançamento</dt><dd>(-) {formatEthValue(totals.discount, 2)}</dd></div>
      <div className="kurio-cart-fee">
        <dt>Taxa de rede</dt>
        <dd>{formatEthValue(totals.networkFee, 3)} ETH<span>Taxa estimada</span></dd>
      </div>
      <div className="kurio-cart-grand-total"><dt>Total</dt><dd>{formatEthValue(totals.total, 3)} ETH</dd></div>
    </dl>
  );
}

function CartSuggestions({ suggestions }: { suggestions: Nft[] }) {
  if (suggestions.length === 0) return null;
  return (
    <section className="kurio-cart-suggestions" aria-labelledby="cart-suggestions-heading">
      <h2 id="cart-suggestions-heading">Colecionadores também viram</h2>
      <div className="kurio-cart-suggestions-grid">
        {suggestions.map((nft) => <NftCard key={nft.id} nft={nft} compact />)}
      </div>
    </section>
  );
}
