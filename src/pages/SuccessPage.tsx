import { Link, useParams } from "react-router-dom";

import { formatMoney, loadLastOrder } from "../cart";

export function SuccessPage() {
  const { orderNumber } = useParams();
  const order = loadLastOrder();
  const isCurrentOrder = order?.orderNumber === orderNumber;

  if (!order || !isCurrentOrder) {
    return (
      <div className="panel empty-state">
        <h1>Заказ {orderNumber}</h1>
        <p className="muted">Данные подтверждения не найдены в этом браузере.</p>
        <Link className="btn" to="/catalog">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="success-banner">
        <span className="status success">Заказ успешно создан</span>
        <h1>Заказ {order.orderNumber}</h1>
        <p className="muted">
          Статус: <strong>{order.status}</strong>. Менеджер свяжется с клиентом для подтверждения деталей доставки.
        </p>
      </section>

      <div className="order-layout">
        <section className="panel">
          <h3>Состав заказа</h3>
          {order.items.map(({ product, quantity, lineTotal }) => (
            <div className="cart-row" key={product.id}>
              <span className="muted">
                {product.name} x{quantity}
              </span>
              <strong>{formatMoney(lineTotal)}</strong>
            </div>
          ))}
          <div className="summary-row total-row">
            <span>Итого</span>
            <strong>{formatMoney(order.total)}</strong>
          </div>
        </section>

        <section className="panel">
          <h3>Контакты и доставка</h3>
          <ul className="detail-list">
            <li>
              <span>Покупатель</span>
              <strong>{order.form.customerName}</strong>
            </li>
            <li>
              <span>Телефон</span>
              <strong>{order.form.customerPhone}</strong>
            </li>
            <li>
              <span>Email</span>
              <strong>{order.form.customerEmail}</strong>
            </li>
            <li>
              <span>Адрес</span>
              <strong>
                {order.form.deliveryCity}, {order.form.deliveryAddress}
              </strong>
            </li>
            <li>
              <span>Доставка</span>
              <strong>{order.form.deliveryMethod === "courier" ? "Курьер" : "Самовывоз"}</strong>
            </li>
          </ul>
        </section>
      </div>

      <div className="actions-inline success-actions">
        <Link className="btn" to="/catalog">
          Вернуться в каталог
        </Link>
        <Link className="btn-ghost" to="/product/led-a60-7w-e27-3000k">
          Посмотреть похожие товары
        </Link>
      </div>
    </>
  );
}

