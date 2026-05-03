import { FormEvent, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { createOrderNumber, DELIVERY_PRICE, formatMoney, saveLastOrder } from "../cart";
import { getProductById } from "../data/catalog";
import type { CartItem, CheckoutForm } from "../types";

type CheckoutPageProps = {
  items: CartItem[];
  onClearCart: () => void;
};

const initialForm: CheckoutForm = {
  customerName: "Иван Петров",
  customerPhone: "+7 999 123-45-67",
  customerEmail: "ivan.petrov@example.com",
  deliveryCity: "Москва",
  deliveryAddress: "ул. Академика Королева, д. 12, кв. 45",
  deliveryMethod: "courier",
  paymentMethod: "card_online",
  customerComment: "Позвоните за час до доставки.",
  personalDataAccepted: true,
};

export function CheckoutPage({ items, onClearCart }: CheckoutPageProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState<CheckoutForm>(initialForm);

  const rows = useMemo(
    () =>
      items
        .map((item) => {
          const product = getProductById(item.productId);
          return product ? { product, quantity: item.quantity, lineTotal: product.price * item.quantity } : null;
        })
        .filter((row): row is NonNullable<typeof row> => Boolean(row)),
    [items],
  );

  if (rows.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const subtotal = rows.reduce((sum, row) => sum + row.lineTotal, 0);
  const delivery = form.deliveryMethod === "pickup" ? 0 : DELIVERY_PRICE;
  const total = subtotal + delivery;

  const updateField = <T extends keyof CheckoutForm>(field: T, value: CheckoutForm[T]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.personalDataAccepted) return;

    const orderNumber = createOrderNumber();
    saveLastOrder({
      orderNumber,
      createdAt: new Date().toISOString(),
      form,
      items: rows,
      subtotal,
      delivery,
      total,
      status: "new",
    });
    onClearCart();
    navigate(`/checkout/success/${orderNumber}`);
  };

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Оформление заказа</h1>
          <p className="muted">Контакты, доставка, оплата и состав заказа</p>
        </div>
        <span className="tag">Шаг 2 из 2</span>
      </div>

      <form className="checkout-layout" onSubmit={submitOrder}>
        <section className="panel">
          <div className="form-grid">
            <label className="field">
              <span>Имя</span>
              <input
                className="input"
                required
                value={form.customerName}
                onChange={(event) => updateField("customerName", event.target.value)}
              />
            </label>
            <label className="field">
              <span>Телефон</span>
              <input
                className="input"
                required
                value={form.customerPhone}
                onChange={(event) => updateField("customerPhone", event.target.value)}
              />
            </label>
            <label className="field full">
              <span>Email</span>
              <input
                className="input"
                required
                type="email"
                value={form.customerEmail}
                onChange={(event) => updateField("customerEmail", event.target.value)}
              />
            </label>
            <label className="field">
              <span>Город</span>
              <input
                className="input"
                required
                value={form.deliveryCity}
                onChange={(event) => updateField("deliveryCity", event.target.value)}
              />
            </label>
            <label className="field">
              <span>Способ доставки</span>
              <select
                className="select"
                value={form.deliveryMethod}
                onChange={(event) =>
                  updateField("deliveryMethod", event.target.value as CheckoutForm["deliveryMethod"])
                }
              >
                <option value="courier">Курьер</option>
                <option value="pickup">Самовывоз</option>
              </select>
            </label>
            <label className="field full">
              <span>Адрес доставки</span>
              <input
                className="input"
                required
                value={form.deliveryAddress}
                onChange={(event) => updateField("deliveryAddress", event.target.value)}
              />
            </label>
            <label className="field">
              <span>Способ оплаты</span>
              <select
                className="select"
                value={form.paymentMethod}
                onChange={(event) =>
                  updateField("paymentMethod", event.target.value as CheckoutForm["paymentMethod"])
                }
              >
                <option value="card_online">Оплата картой онлайн</option>
                <option value="cash_on_delivery">Наличными при получении</option>
              </select>
            </label>
            <label className="field checkbox-field">
              <span>Согласие</span>
              <span className="checkbox-row input-like">
                <input
                  type="checkbox"
                  checked={form.personalDataAccepted}
                  onChange={(event) => updateField("personalDataAccepted", event.target.checked)}
                />
                <span>Согласен на обработку данных</span>
              </span>
            </label>
            <label className="field full">
              <span>Комментарий</span>
              <textarea
                className="textarea"
                value={form.customerComment}
                onChange={(event) => updateField("customerComment", event.target.value)}
              />
            </label>
          </div>
        </section>

        <aside className="panel summary-panel">
          <h3>Ваш заказ</h3>
          {rows.map(({ product, quantity, lineTotal }) => (
            <div className="cart-row" key={product.id}>
              <span className="muted">
                {product.name} x{quantity}
              </span>
              <strong>{formatMoney(lineTotal)}</strong>
            </div>
          ))}
          <hr />
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
            <button className="btn" type="submit" disabled={!form.personalDataAccepted}>
              Подтвердить заказ
            </button>
            <Link className="btn-ghost" to="/cart">
              Вернуться в корзину
            </Link>
          </div>
        </aside>
      </form>
    </>
  );
}

