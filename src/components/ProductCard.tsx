import { Link } from "react-router-dom";

import { formatMoney } from "../cart";
import type { Product } from "../types";

type ProductCardProps = {
  product: Product;
  onAdd: (product: Product) => void;
};

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <article className="product-card">
      <Link className="product-image" to={`/product/${product.slug}`} aria-label={product.name}>
        <span>{product.socketType}</span>
      </Link>
      <div className="product-body">
        <span className="tag">{product.category}</span>
        <div>
          <Link className="product-title" to={`/product/${product.slug}`}>
            {product.name}
          </Link>
          <div className="tiny">SKU: {product.sku}</div>
        </div>
        <div className="price-row">
          <span>
            <span className="price">{formatMoney(product.price)}</span>
            {product.oldPrice ? <span className="old-price">{formatMoney(product.oldPrice)}</span> : null}
          </span>
          <span className={`status ${product.stockQty <= 10 ? "warning" : "success"}`}>
            {product.stockQty > 10 ? `В наличии: ${product.stockQty}` : `Осталось: ${product.stockQty}`}
          </span>
        </div>
        <div className="actions-inline">
          <button className="btn" type="button" onClick={() => onAdd(product)}>
            В корзину
          </button>
          <Link className="btn-ghost" to={`/product/${product.slug}`}>
            Подробнее
          </Link>
        </div>
      </div>
    </article>
  );
}

