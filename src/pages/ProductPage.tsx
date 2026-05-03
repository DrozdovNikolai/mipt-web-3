import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";

import { QuantityControl } from "../components/QuantityControl";
import { formatMoney } from "../cart";
import { getProductBySlug, products } from "../data/catalog";
import type { Product } from "../types";

type ProductPageProps = {
  onAddToCart: (product: Product, quantity: number) => void;
};

export function ProductPage({ onAddToCart }: ProductPageProps) {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  const [quantity, setQuantity] = useState(1);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((item) => item.id !== product.id && item.categorySlug === product.categorySlug)
      .slice(0, 3);
  }, [product]);

  if (!product) {
    return (
      <div className="panel empty-state">
        <h1>Товар не найден</h1>
        <Link className="btn" to="/catalog">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="breadcrumbs">
        <Link to="/catalog">Каталог</Link>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="product-layout">
        <div className="gallery">
          <div className="gallery-image">
            <span>{product.socketType}</span>
          </div>
          <div className="gallery-strip">
            <div className="mini-image" />
            <div className="mini-image" />
            <div className="mini-image" />
          </div>
        </div>

        <section className="panel product-panel">
          <div className="inline-row">
            <span className="tag">{product.category}</span>
            <span className={`status ${product.stockQty <= 10 ? "warning" : "success"}`}>
              В наличии: {product.stockQty}
            </span>
          </div>
          <h1>{product.name}</h1>
          <p className="muted">SKU: {product.sku}</p>
          <div className="price-row">
            <span>
              <span className="price">{formatMoney(product.price)}</span>
              {product.oldPrice ? <span className="old-price">{formatMoney(product.oldPrice)}</span> : null}
            </span>
            <span className="tag">{product.colorTemperature}</span>
          </div>
          <p className="muted">{product.description}</p>

          <ul className="detail-list">
            <li>
              <span>Мощность</span>
              <strong>{product.powerWatts}W</strong>
            </li>
            <li>
              <span>Цоколь</span>
              <strong>{product.socketType}</strong>
            </li>
            <li>
              <span>Температура</span>
              <strong>{product.colorTemperature}</strong>
            </li>
            <li>
              <span>Световой поток</span>
              <strong>{product.luminousFlux} lm</strong>
            </li>
            <li>
              <span>Ресурс</span>
              <strong>{product.lifetimeHours.toLocaleString("ru-RU")} часов</strong>
            </li>
            <li>
              <span>Диммирование</span>
              <strong>{product.isDimmable ? "Да" : "Нет"}</strong>
            </li>
          </ul>

          <div className="buy-row">
            <QuantityControl value={quantity} max={product.stockQty} onChange={setQuantity} />
            <button className="btn" type="button" onClick={() => onAddToCart(product, quantity)}>
              Добавить в корзину
            </button>
            <Link className="btn-ghost" to="/catalog">
              Назад в каталог
            </Link>
          </div>
        </section>
      </div>

      <section className="related-grid" aria-label="Похожие товары">
        {relatedProducts.map((item) => (
          <article className="panel related-card" key={item.id}>
            <span className="tag">Похожие товары</span>
            <h3>{item.name}</h3>
            <p className="muted">{formatMoney(item.price)}</p>
            <Link className="btn-ghost" to={`/product/${item.slug}`}>
              Открыть
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}

