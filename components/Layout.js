import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image'
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState, useRef} from 'react';
import { ToastContainer } from 'react-toastify';
//import { Menu } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from '../utils/Store';
//import { ResponsiveImage } from 'react-responsive-image';
//import DropdownLink from './DropdownLink';
import { useRouter } from 'next/router';
import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon';
import '@fortawesome/fontawesome-free/css/all.css';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { Bars3Icon } from '@heroicons/react/24/solid';
//import { XIcon } from '@heroicons/react/24/solid';



 export default function Layout({ title, children, homepage }) {
  //const [showNavLinks, setShowNavLinks] = useState(false);
  const { status, data: session } = useSession();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };

  const [query, setQuery] = useState('');

  const router = useRouter();
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownBlur = (event) => {
    if (!dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const handleUserDropdownBlur = (event) => {
    if (!userDropdownRef.current.contains(event.target)) {
      setIsUserDropdownOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
        setIsUserDropdownOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  return (
    <>
      <Head>
        <title>{title ? title + ' - Amazona' : 'Amazona'}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between ">
      <header className="header">
       <nav className="flex flex-col sm:flex-row h-20 items-center px-4 justify-start shadow-md">
       <div className="flex sm:w-1/5 items-center justify-start sm:justify-start sm:items-start">
         <Link href="/" className="logo">
         <img
          src="https://res.cloudinary.com/dxxzqmxu5/image/upload/v1691256496/Bazaar.png"
          alt="Logo"
          className="w-100 sm:w-auto ml-0 "
          />
         </Link>
        <div className="flex sm:hidden items-center mt-4 ">
          <Link href="/cart" className="mr-2">
           Cart
           {cartItemsCount > 0 && (
          <span className="ml-1 rounded-full bg-yellow-400 px-2 py-1 text-xs font-bold text-black">
            {cartItemsCount}
          </span>
          )}
         </Link>
      
      {status === 'loading' ? (
        'Loading'
      ) : session?.user ? (
        <div className=" relative ">
          <button onClick={toggleUserDropdown} className="dropdown-link text-blue-600">
            {session.user.name}
          </button>
           {isUserDropdownOpen && (
            <div 
             ref={userDropdownRef}
             className="absolute top-8 right-0 bg-white shadow-md py-2 px-10 z-10"
             >
              <Link href="/Profile" className="dropdown-link text-blue-600 hover:underline block mb-2">
                Profile
              </Link>
              
              <Link href="/order-history" className="dropdown-link text-blue-600 hover:underline">
                 OrderHistory
              </Link>
              {session.user.isAdmin && (
              <Link href="/admin/dashboard" className="dropdown-link text-blue-600 hover:underline block mb-2 ">
                AdminDashboard
              </Link>
              )}
              <Link href="#" 
               className="dropdown-link text-blue-600 hover:underline block mb-2 "
               onClick={logoutClickHandler}
               >
                Logout
              </Link>
            </div>
          )}
        </div>
      ) : (
        <Link href="/login" className="p-2">
          Login
        </Link>
      )}
       
      <Bars3Icon className="dropdown-link h-6 w-6 cursor-pointer ml-1 " 
          onClick={toggleDropdown}
        />
     {isDropdownOpen && (
    <div 
     ref={dropdownRef}
     className="absolute top-8 right-0 bg-white shadow-md py-2 px-4 z-10" 
     onBlur={handleDropdownBlur}
     >
    <Link href="/" className="dropdown-link text-blue-600 hover:underline block mb-2">
      Home
    </Link>
    <Link href="/search" className="dropdown-link text-blue-600 hover:underline block mb-2">
      Products
    </Link>
    <Link href="/about" className="dropdown-link text-blue-600 hover:underline block mb-2">
      About
    </Link>
    <Link
      href="/contact"
      className={`dropdown-link text-blue-600 hover:underline blcok mb-2 ${
        homepage ? 'mr-40' : ''
          } block`}
            >
          Contact
         </Link>
        </div>
     )}
      </div>    
      </div>
  <div className="flex sm:w-1/2 items-center justify-center">
    <form
      className="search flex flex-grow items-center justify-center" // Add flex wrapper 
      onSubmit={submitHandler}
    >
      <input
        type="text"
        placeholder="Search products..."
        className="border-gray-300 border rounded pl-5 pr-18"
      />
      <button className="btn p-2 border rounded" type="submit"> 
          <SearchIcon className="h-5 w-5" /> 
      </button>
    </form> 
  </div>
  
  <div className="hidden sm:flex w-1/4 items-center justify-end">

   <Link href="/cart" className="mr-4">
      Cart
      {cartItemsCount > 0 && (
        <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
          {cartItemsCount}
        </span>
      )}
    </Link>
   {/*<div className="flex items-center gap-[1vw] justify-center">*/}

     {status === 'loading' ? (
        'Loading'
      ) : session?.user ? (
        <div className=" relative">
          <button onClick={toggleUserDropdown} className="dropdown-link text-blue-600">
            {session.user.name}
          </button>
           {isUserDropdownOpen && (
            <div 
             ref={userDropdownRef}
             className="absolute top-8 right-0 bg-white shadow-md  py-2 px-4 z-10"
             onBlur={handleUserDropdownBlur}
             >
              <Link href="/" className="dropdown-link text-blue-600 hover:underline block mb-2">
                Home
              </Link>
              <Link href="/search" className="dropdown-link text-blue-600 hover:underline block mb-2">
                Products
              </Link>
              <Link href="/about" className="dropdown-link text-blue-600 hover:underline block mb-2 ">
                About
              </Link>
              <Link href="/about" className="dropdown-link text-blue-600 hover:underline block mb-2 ">
                About
              </Link>
            </div>
          )}
        </div>
      ) : (
        <Link href="/login" className="p-2">
          Login
        </Link>
      )}
      </div>
      </nav>
    <div className="nav-links hidden lg:flex flex-col lg:flex-row gap-4 lg:gap-8 items-center justify-center">
          <Link href="/" className="text-white hover:underline mx-4">
            Home
          </Link>
          <Link href="/search" className="text-white hover:underline mx-4">
            Products
          </Link>
          <Link href="/about" className="text-white hover:underline mx-4">
            About
          </Link>
          {/* Use a ternary operator to adjust the margin-right of the contact link based on the homepage prop */}
          <Link
            href="/contact"
            className={`text-white hover:underline mx-4 ${
              homepage ? 'mr-40' : ''
            }`}
          >
            Contact
          </Link>
        </div>
    </header>
 <main className="container m-auto mt-4 px-4">{children}</main>
  <footer className="footer flex h-10 justify-center items-center shadow-inner">
      <p>Copyright © 2022 Amazona</p>
  </footer>
      </div>
    </>
  );
}
