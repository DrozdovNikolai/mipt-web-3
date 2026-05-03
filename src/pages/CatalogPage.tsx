import { useMemo, useState } from "react";

import { ProductCard } from "../components/ProductCard";
import { categories, products, sockets, temperatures } from "../data/catalog";
import type { Product } from "../types";

type CatalogPageProps = {
  onAddToCart: (product: Product) => void;
};

type SortValue = "price_asc" | "price_desc" | "name_asc" | "name_desc";

export function CatalogPage({ onAddToCart }: CatalogPageProps) {
  const [category, setCategory] = useState("all");
  const [socket, setSocket] = useState("all");
  const [temperature, setTemperature] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortValue>("price_asc");

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const result = products.filter((product) => {
      const matchesCategory = category === "all" || product.categorySlug === category;
      const matchesSocket = socket === "all" || product.socketType === socket;
      const matchesTemperature = temperature === "all" || product.colorTemperature === temperature;
      const matchesStock = !inStockOnly || product.stockQty > 0;
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.sku.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSocket && matchesTemperature && matchesStock && matchesSearch;
    });

    return result.sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "name_desc") return b.name.localeCompare(a.name, "ru");
      return a.name.localeCompare(b.name, "ru");
    });
  }, [category, socket, temperature, inStockOnly, search, sort]);

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Каталог лампочек</h1>
          <p className="muted">20 позиций завода LampFactory</p>
        </div>
        <div className="actions-inline">
          <span className="tag">Найдено: {filteredProducts.length}</span>
          <label className="field compact-field">
            <span>Сортировка</span>
            <select className="select" value={sort} onChange={(event) => setSort(event.target.value as SortValue)}>
              <option value="price_asc">Сначала дешевле</option>
              <option value="price_desc">Сначала дороже</option>
              <option value="name_asc">Название А-Я</option>
              <option value="name_desc">Название Я-А</option>
            </select>
          </label>
        </div>
      </div>

      <div className="layout catalog-layout">
        <aside className="panel filters-panel">
          <h3>Фильтры</h3>
          <label className="field">
            <span>Поиск</span>
            <input
              className="input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="SKU или название"
            />
          </label>

          <label className="field">
            <span>Категория</span>
            <select className="select" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">Все категории</option>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Цоколь</span>
            <select className="select" value={socket} onChange={(event) => setSocket(event.target.value)}>
              <option value="all">Любой</option>
              {sockets.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Температура</span>
            <select
              className="select"
              value={temperature}
              onChange={(event) => setTemperature(event.target.value)}
            >
              <option value="all">Любая</option>
              {temperatures.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(event) => setInStockOnly(event.target.checked)}
            />
            <span>Только в наличии</span>
          </label>
        </aside>

        <section className="products-grid" aria-label="Товары">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAddToCart} />
          ))}
        </section>
      </div>
    </>
  );
}

