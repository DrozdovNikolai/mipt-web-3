# LampFactory Storefront

Пользовательская часть интернет-магазина на React + React Router DOM.

Реализованные страницы:

- `/catalog` — каталог с поиском, фильтрами и сортировкой.
- `/product/:slug` — карточка товара.
- `/cart` — корзина с изменением количества и удалением товаров.
- `/checkout` — оформление заказа.
- `/checkout/success/:orderNumber` — подтверждение заказа.

Backend на этом этапе не подключается. Данные товаров берутся из локального mock-файла `src/data/catalog-seed.json`, корзина и последний созданный заказ сохраняются в `localStorage`.

## Запуск

```bash
npm install
npm run dev
```

Если Node установлен в Windows и не виден из WSL как `node`, можно запускать так:

```bash
PATH="/mnt/c/Program Files/nodejs:$PATH" npm run dev
```

Production-сборка:

```bash
npm run build
```

