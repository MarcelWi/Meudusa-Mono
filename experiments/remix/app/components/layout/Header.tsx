import React, { useState } from 'react';
import {
  UserIcon,
  HeartIcon,
  CartIcon,
  MenuIcon,
  ChevronDownIcon
} from '~/components/ui/Icons';
// Oder wenn du die Icon-Komponente verwendest:
// import Icon from './Icon';
import {Container} from "~/components/layout/Container";

// NavLink Komponente für bessere Wartbarkeit
const NavLink = ({ href, children, className = "" }) => (
  <a
    href={href}
    className={`hover:text-blue text-custom-sm font-medium text-black flex xl:py-6 ${className}`}
  >
    {children}
  </a>
);

// IconButton Komponente für wiederholte Elemente
const IconButton = ({
                      href,
                      icon,
                      badgeCount = 0,
                      ariaLabel,
                      className = "",
                      onClick
                    }) => (
  <a
    href={href}
    className={`flex items-center justify-center w-8 h-8 ${className}`}
    aria-label={ariaLabel}
    onClick={onClick}
  >
    <span className="relative inline-block">
      {icon}
      {badgeCount > 0 && (
        <span className="flex items-center justify-center font-medium text-2xs absolute -right-2 -top-2.5 bg-red w-4.5 h-4.5 rounded-full text-black">
          {badgeCount}
        </span>
      )}
    </span>
  </a>
);

// Haupt-Header Komponente
export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 w-full z-50 bg-white shadow-sm">
      {/* Top Section */}
      <Container>
        <div className="flex flex-col lg:flex-row gap-5 items-end lg:items-center xl:justify-between py-6">
          <div className="flex flex-col w-full gap-5 xl:w-auto sm:flex-row xl:justify-between sm:items-center sm:gap-10">
            <a className="shrink-0 text-xl font-bold" href="/">
              Loogo
            </a>
          </div>

          <div className="flex w-full lg:w-auto items-center gap-7.5">
            <div className="flex items-center justify-between w-full gap-8 lg:w-auto">
              <div className="items-center gap-5 flex">
                <a className="items-center gap-2.5 hidden xl:flex" href="/signin">
                  <div className="flex items-center justify-center w-9 h-9 border border-black rounded-full">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div className="group">
                    <span className="block uppercase font-medium text-2xs text-black opacity-80">account</span>
                    <p className="font-medium text-custom-sm text-black hover:text-blue-200">Sign In / Register</p>
                  </div>
                </a>

                <div className="flex items-center gap-2.5">
                  <IconButton
                    href="/wishlist"
                    icon={<HeartIcon className="w-5 h-5" />}
                    badgeCount={0}
                    ariaLabel="Wishlist"
                  />
                  <IconButton
                    href="/cart"
                    icon={<CartIcon className="w-5 h-5" />}
                    badgeCount={3}
                    ariaLabel="Shopping cart"
                  />
                </div>
              </div>

              <button
                id="mobile-menu-toggle"
                aria-label="Toggle menu"
                className="xl:hidden w-10 h-10 bg-transparent rounded-lg inline-flex items-center cursor-pointer justify-center hover:bg-gray-200 hover:bg-opacity-20"
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
            <nav className="hidden xl:block">
              <ul className="flex gap-8">
                {['Popular', 'Shop', 'Contact', 'Pages', 'Blogs'].map((item) => (
                  <li key={item} className="group relative">
                    <div className="before:w-0 before:h-[3px] before:bg-blue before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 group-hover:before:w-full"></div>
                    <NavLink href={`/${item.toLowerCase()}`}>
                      {item}
                      {(item === 'Pages' || item === 'Blogs') && (
                        <ChevronDownIcon className="w-4 h-4 ml-1" />
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden xl:block">
              <a className="text-sm text-black flex items-center font-medium hover:text-blue-600" href="/popular?sort=popular">
                Best Selling
                <span className="bg-red text-black font-semibold text-[10px] inline-flex items-center justify-center rounded-full ml-2.5 px-2 h-5 uppercase">
                  SALE
                </span>
              </a>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};