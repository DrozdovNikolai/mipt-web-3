import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  cartCount: number;
};

export function Layout({ children, cartCount }: LayoutProps) {
  return (
    <div className="app-shell">
      <div className="frame">
        <header className="topbar">
          <NavLink className="brand" to="/catalog" aria-label="LampFactory Store">
            <span className="brand-mark" aria-hidden="true" />
            <span>LampFactory Store</span>
          </NavLink>
          <nav className="nav-row" aria-label="Основная навигация">
            <NavLink className="pill" to="/catalog">
              Каталог
            </NavLink>
            <NavLink className="icon-pill" to="/cart">
              Корзина <strong>{cartCount}</strong>
            </NavLink>
          </nav>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}

