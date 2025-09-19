// components/layout/Header.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  UserIcon,
  HeartIcon,
  CartIcon,
  MenuIcon,
  ChevronDownIcon
} from '~/components/ui/Icons';
import { Container } from "~/components/layout/Container";
import { useCartStore } from "~/stores/cartStore";
import { useCartSheet } from "~/context/CartSheetContext";
import { useAuthStore } from "~/stores/authStore";
import { Link } from "react-router";

// ✅ Verbesserte NavLink Komponente mit React Router
const NavLink = ({ to, children, className = "" }: {
  to: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Link
    to={to}
    className={`hover:text-blue text-custom-sm font-medium text-black flex xl:py-6 transition-colors ${className}`}
  >
    {children}
  </Link>
);

// ✅ Verbesserte IconButton Komponente
const IconButton = ({
                      href,
                      to,
                      icon,
                      badgeCount = 0,
                      ariaLabel,
                      className = "",
                      onClick
                    }: {
  href?: string;
  to?: string;
  icon: React.ReactNode;
  badgeCount?: number;
  ariaLabel: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const classes = `flex items-center justify-center w-8 h-8 transition-colors hover:bg-gray-100 rounded ${className}`;

  const content = (
    <span className="relative inline-block">
      {icon}
      {badgeCount > 0 && (
        <span className="flex items-center justify-center font-medium text-2xs absolute -right-2 -top-2.5 bg-red w-4.5 h-4.5 rounded-full text-black animate-pulse">
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      )}
    </span>
  );

  if (onClick) {
    return (
      <button
        className={classes}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {content}
      </button>
    );
  }

  if (to) {
    return (
      <Link
        to={to}
        className={classes}
        aria-label={ariaLabel}
      >
        {content}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={classes}
      aria-label={ariaLabel}
    >
      {content}
    </a>
  );
};

// ✅ Cart Button Komponente
const CartButton = () => {
  const { getItemCount } = useCartStore();
  const { openCart } = useCartSheet();

  const itemCount = getItemCount();

  return (
    <IconButton
      icon={<CartIcon className="w-5 h-5" />}
      badgeCount={itemCount}
      ariaLabel={`Warenkorb öffnen ${itemCount > 0 ? `(${itemCount} Artikel)` : ''}`}
      onClick={(e) => {
        e.preventDefault();
        openCart();
      }}
    />
  );
};

// ✅ Wishlist Button Komponente (mit Zustand vorbereitet)
const WishlistButton = () => {
  // TODO: Wishlist Store implementieren
  const wishlistCount = 0; // Placeholder

  return (
    <IconButton
      to="/wishlist"
      icon={<HeartIcon className="w-5 h-5" />}
      badgeCount={wishlistCount}
      ariaLabel={`Wunschliste ${wishlistCount > 0 ? `(${wishlistCount} Artikel)` : ''}`}
    />
  );
};

// ✅ Account Section Komponente mit vollständiger Auth-Integration
const AccountSection = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  // ✅ Authenticated User Dropdown
  if (isAuthenticated && user) {
    const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="items-center gap-2.5 hidden xl:flex hover:bg-gray-50 rounded-lg p-2 transition-colors"
          aria-expanded={showDropdown}
          aria-haspopup="true"
        >
          <div className="flex items-center justify-center w-9 h-9 bg-blue-600 text-white rounded-full font-medium text-sm">
            {initials}
          </div>
          <div className="group text-left">
            <span className="block uppercase font-medium text-2xs text-black opacity-80">
              Willkommen
            </span>
            <p className="font-medium text-custom-sm text-black hover:text-blue-200">
              {user.first_name} {user.last_name}
            </p>
          </div>
          <ChevronDownIcon className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {/* ✅ User Dropdown Menu */}
        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link
                to="/account"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                <span className="mr-3">👤</span>
                Mein Konto
              </Link>

              <Link
                to="/account/orders"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                <span className="mr-3">📦</span>
                Meine Bestellungen
              </Link>

              <Link
                to="/account/addresses"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                <span className="mr-3">📍</span>
                Adressen
              </Link>

              <Link
                to="/account/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                <span className="mr-3">⚙️</span>
                Einstellungen
              </Link>
            </div>

            <div className="border-t border-gray-100 py-1">
              <button
                onClick={() => {
                  logout();
                  setShowDropdown(false);
                }}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <span className="mr-3">🚪</span>
                Abmelden
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ✅ Login/Register Links for unauthenticated users
  return (
    <Link to="/auth/login" className="items-center gap-2.5 hidden xl:flex hover:bg-gray-50 rounded-lg p-2 transition-colors">
      <div className="flex items-center justify-center w-9 h-9 border border-black rounded-full">
        <UserIcon className="w-5 h-5" />
      </div>
      <div className="group">
        <span className="block uppercase font-medium text-2xs text-black opacity-80">account</span>
        <p className="font-medium text-custom-sm text-black hover:text-blue-200">Sign In / Register</p>
      </div>
    </Link>
  );
};

// ✅ Mobile Account Section
const MobileAccountSection = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  if (isAuthenticated && user) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-medium">
            {user.first_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="space-y-1">
          <Link
            to="/account"
            className="block py-2 px-4 hover:bg-gray-50 rounded transition-colors text-sm"
          >
            👤 Mein Konto
          </Link>
          <Link
            to="/account/orders"
            className="block py-2 px-4 hover:bg-gray-50 rounded transition-colors text-sm"
          >
            📦 Meine Bestellungen
          </Link>
          <Link
            to="/account/addresses"
            className="block py-2 px-4 hover:bg-gray-50 rounded transition-colors text-sm"
          >
            📍 Adressen
          </Link>
          <button
            onClick={logout}
            className="block w-full text-left py-2 px-4 text-red-600 hover:bg-red-50 rounded transition-colors text-sm"
          >
            🚪 Abmelden
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Link
        to="/auth/login"
        className="block py-2 px-4 bg-blue-600 text-white text-center rounded font-medium hover:bg-blue-700 transition-colors"
      >
        Anmelden
      </Link>
      <Link
        to="/auth/register"
        className="block py-2 px-4 border border-blue-600 text-blue-600 text-center rounded font-medium hover:bg-blue-50 transition-colors"
      >
        Registrieren
      </Link>
    </div>
  );
};

// ✅ Navigation Items
const navigationItems = [
  { label: 'Popular', to: '/popular' },
  { label: 'Shop', to: '/store/products', hasDropdown: false },
  { label: 'Contact', to: '/contact' },
  { label: 'Pages', to: '/pages', hasDropdown: true },
  { label: 'Blogs', to: '/blogs', hasDropdown: true },
];

// ✅ Haupt-Header Komponente
export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // ✅ Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMobileMenuOpen]);

  // ✅ Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) { // xl breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="sticky top-0 w-full z-50 bg-white text-black shadow-sm">
      {/* Top Section */}
      <Container>
        <div className="flex flex-col lg:flex-row gap-5 items-end lg:items-center xl:justify-between py-6">
          <div className="flex flex-col w-full gap-5 xl:w-auto sm:flex-row xl:justify-between sm:items-center sm:gap-10">
            <Link to="/" className="shrink-0 text-xl font-bold hover:text-blue-600 transition-colors">
              Loogo
            </Link>
          </div>

          <div className="flex w-full lg:w-auto items-center gap-7.5">
            <div className="flex items-center justify-between w-full gap-8 lg:w-auto">
              <div className="items-center gap-5 flex">
                {/* ✅ Account Section mit vollständiger Auth */}
                <AccountSection />

                {/* ✅ Actions mit integrierten Stores */}
                <div className="flex items-center gap-2.5">
                  <WishlistButton />
                  <CartButton />
                </div>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                id="mobile-menu-toggle"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
                className="xl:hidden w-10 h-10 bg-transparent rounded-lg inline-flex items-center cursor-pointer justify-center hover:bg-gray-200 hover:bg-opacity-20 transition-colors"
                onClick={toggleMobileMenu}
              >
                <MenuIcon className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      </Container>

      {/* Navigation Section */}
      <div className="xl:border-y border-b border-black">
        <Container>
          <div className="flex items-center justify-between py-3">
            {/* ✅ Desktop Navigation */}
            <nav className="hidden xl:block">
              <ul className="flex gap-8">
                {navigationItems.map((item) => (
                  <li key={item.label} className="group relative">
                    <div className="before:w-0 before:h-[3px] before:bg-blue before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 group-hover:before:w-full"></div>
                    <NavLink to={item.to}>
                      {item.label}
                      {item.hasDropdown && (
                        <ChevronDownIcon className="w-4 h-4 ml-1" />
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* ✅ Best Selling Link */}
            <div className="hidden xl:block">
              <Link
                to="/popular?sort=popular"
                className="text-sm text-black flex items-center font-medium hover:text-blue-600 transition-colors"
              >
                Best Selling
                <span className="bg-red text-black font-semibold text-[10px] inline-flex items-center justify-center rounded-full ml-2.5 px-2 h-5 uppercase">
                  SALE
                </span>
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* ✅ Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 xl:hidden z-40"
            onClick={closeMobileMenu}
          />

          {/* Mobile Menu Content */}
          <div className="xl:hidden bg-white border-t border-gray-200 shadow-lg relative z-50">
            <Container>
              <nav className="py-4">
                {/* Navigation Links */}
                <ul className="space-y-2 mb-6">
                  {navigationItems.map((item) => (
                    <li key={item.label}>
                      <NavLink
                        to={item.to}
                        className="block py-3 px-4 hover:bg-gray-50 rounded transition-colors"
                      >
                        <span className="flex items-center justify-between">
                          {item.label}
                          {item.hasDropdown && (
                            <ChevronDownIcon className="w-4 h-4" />
                          )}
                        </span>
                      </NavLink>
                    </li>
                  ))}
                  <li>
                    <Link
                      to="/popular?sort=popular"
                      className="block py-3 px-4 hover:bg-gray-50 rounded transition-colors text-sm font-medium"
                      onClick={closeMobileMenu}
                    >
                      <span className="flex items-center">
                        Best Selling
                        <span className="bg-red text-black font-semibold text-[10px] inline-flex items-center justify-center rounded-full ml-2 px-2 h-5 uppercase">
                          SALE
                        </span>
                      </span>
                    </Link>
                  </li>
                </ul>

                {/* Mobile Account & Actions */}
                <div className="pt-4 border-t border-gray-200">
                  <MobileAccountSection />

                  {/* Mobile Cart & Wishlist */}
                  <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        document.querySelector('[aria-label*="Wunschliste"]')?.click();
                        closeMobileMenu();
                      }}
                      className="flex flex-col items-center gap-1 text-gray-600"
                    >
                      <WishlistButton />
                      <span className="text-xs">Wunschliste</span>
                    </button>

                    <button
                      onClick={() => {
                        useCartSheet.getState().openCart();
                        closeMobileMenu();
                      }}
                      className="flex flex-col items-center gap-1 text-gray-600"
                    >
                      <CartButton />
                      <span className="text-xs">Warenkorb</span>
                    </button>
                  </div>
                </div>
              </nav>
            </Container>
          </div>
        </>
      )}
    </header>
  );
};
