import { Link } from "react-router-dom";

import { DELIVERY_PRICE, formatMoney } from "../cart";
import { QuantityControl } from "../components/QuantityControl";
import { getProductById } from "../data/catalog";
import type { CartItem } from "../types";

type CartPageProps = {
  items: CartItem[];
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
};

export function CartPage({ items, onQuantityChange, onRemove }: CartPageProps) {
  const rows = items
    .map((item) => {
      const product = getProductById(item.productId);
      return product ? { product, quantity: item.quantity, lineTotal: product.price * item.quantity } : null;
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  const subtotal = rows.reduce((sum, row) => sum + row.lineTotal, 0);
  const delivery = rows.length > 0 ? DELIVERY_PRICE : 0;
  const total = subtotal + delivery;

  if (rows.length === 0) {
    return (
      <div className="panel empty-state">
        <h1>Корзина</h1>
        <p className="muted">Корзина пока пустая.</p>
        <Link className="btn" to="/catalog">
          В каталог
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Корзина</h1>
          <p className="muted">Проверьте состав заказа перед оформлением</p>
        </div>
      </div>

      <div className="checkout-layout">
        <section className="panel cart-panel">
          <div className="cart-table" role="table" aria-label="Состав корзины">
            <div className="cart-table-head" role="row">
              <span>Товар</span>
              <span>Цена</span>
              <span>Количество</span>
              <span>Сумма</span>
              <span />
            </div>
            {rows.map(({ product, quantity, lineTotal }) => (
              <div className="cart-line" role="row" key={product.id}>
                <div>
                  <Link className="product-title" to={`/product/${product.slug}`}>
                    {product.name}
                  </Link>
                  <span className="tiny">{product.sku}</span>
                </div>
                <span>{formatMoney(product.price)}</span>
                <QuantityControl
                  value={quantity}
                  max={product.stockQty}
                  onChange={(value) => onQuantityChange(product.id, value)}
                />
                <strong>{formatMoney(lineTotal)}</strong>
                <button className="btn-ghost compact-button" type="button" onClick={() => onRemove(product.id)}>
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </section>

        <aside className="panel summary-panel">
          <h3>Итог заказа</h3>
          <div className="summary-row">
            <span className="muted">Товары</span>
            <strong>{formatMoney(subtotal)}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Доставка</span>
            <strong>{formatMoney(delivery)}</strong>
          </div>
          <div className="summary-row total-row">
            <span>Итого</span>
            <strong>{formatMoney(total)}</strong>
          </div>
          <div className="actions-inline">
            <Link className="btn" to="/checkout">
              Оформить заказ
            </Link>
            <Link className="btn-ghost" to="/catalog">
              В каталог
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}

