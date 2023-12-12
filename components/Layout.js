import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState, useRef} from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon';
import '@fortawesome/fontawesome-free/css/all.css';
import { BsCart4 } from 'react-icons/bs';
import { Bars3Icon } from '@heroicons/react/24/solid';
import { BsX } from 'react-icons/bs';

export default function Layout({ title, children}) {
  const { data: session } = useSession();
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
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const Menu = [{label: 'Home', href: '/'},
  {label: 'Categories', href: '/search'},
  {label: 'About', href: '/about'},
  {label: 'Contact', href: '/contact'}
  ];
     const userMenu = [
    {label: 'Profile', href: '/profile'},
    ...(session && session.user && session.user.isAdmin ? [{label: 'AdminDashboard', 
    href: '/admin/dashboard'}] : []),
    {label: 'Logout', href: '#', onClick: logoutClickHandler} 
    ];
   const menuRef = useRef();
   const bars3IconRef = useRef();
   const userMenuRef = useRef();
   const userRef = useRef();
   
   useEffect(() => {
    const handleClick = (e) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        bars3IconRef.current && !bars3IconRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
  
      if (
        userMenuRef.current && !userMenuRef.current.contains(e.target) &&
        userRef.current && !userRef.current.contains(e.target)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => {
    document.removeEventListener('click', handleClick);
    }
    }, []);
   
  return (
    <>
      <Head>
        <title>{title ? title + ' - Bazaar' : 'Bazaar'}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex  min-h-screen flex-col justify-between">
      <header className="header">
       <nav className="flex flex-col md:flex-row h-24 shadow-md">
       <div className="flex">
         <Link href="/" className="logo">
         <img
          className="hidden md:flex items-left px-4 py-4" 
          src="https://res.cloudinary.com/dxxzqmxu5/image/upload/v1693992337/Bazaar.png"
          alt="Logo"
          width={230}
          height={210}
         />
         </Link>
                
       <div className="flex md:hidden">
         <div className="relative">
          <Bars3Icon 
            ref={bars3IconRef}
            onClick={()=>setOpen(!open)}
            className={`h-6 w-6 cursor-pointer ml-3 mt-6 ${open ? 'hidden' : ''}`}
           /> 
           <BsX
            ref={bars3IconRef}
            onClick={()=>setOpen(!open)}
            className={`h-7 w-7 cursor-pointer ml-3 mt-6 ${open ? '' : 'hidden'}`}
           /> 
            {
              open&&( 
              <div style={{ position: 'relative', zIndex: 9999 }}>
              <div 
              ref={menuRef}
              className="bg-gray-50 p-7 shadow-lg absolute top-1">             
              <ul>
                 {Menu.map((item) => (
                  <li 
                  onClick={()=>setOpen(false)}
                  className="p-0.5 cursor-pointer rounded hover:bg-gray-200"
                  key={item.label}>
                  <a href={item.href}>
                    {item.label} 
                  </a>
                </li>               
                 ))}                
              </ul>
           </div>  
           </div>
            )}       
          </div> 
         <Link href="/" className="logo">
         <img
          className="mt-1.5 ml-2" 
          src="https://res.cloudinary.com/dxxzqmxu5/image/upload/v1693992337/Bazaar.png"
          alt="Logo"
          width={150}
          height={125}
         />
         </Link>
       </div>  
      <div className="flex md:hidden items-center flex-1 justify-end py-2.5"> 
      {session?.user ? (
        <div className="relative">
        <button 
           ref={userRef}
           onClick={(e) => {
            e.stopPropagation();
            setUserMenuOpen(!userMenuOpen); 
          }}
           className="cursor-pointer mt-1 
           flex items-center justify-center bg-white rounded-full w-7 h-7"
          >
          {session.user.name.charAt(0).toUpperCase()}
        </button>
           {
              userMenuOpen&&( 
              <div style={{ position: 'relative', zIndex: 9999 }}>
              <div 
              ref={userMenuRef}
              className="bg-gray-50 p-7 right-0 shadow-lg absolute top-1">
              
              <ul>
                 {userMenu.map((item) => (
                  <li 
                  onClick={()=> { setUserMenuOpen(false)
                  if (item.onClick) item.onClick();}}
                  className="p-1 cursor-pointer rounded hover:bg-gray-200"
                  key={item.label}>
                  <a href={item.href}>
                    {item.label} 
                  </a>
                </li>
                
                 ))}
                
               </ul>

           </div>  
           </div>
            )} 
       </div>
    ) : (
    <Link href="/login">Login/Register</Link>
    )}
   <div>
      <Link href="/cart">
        <BsCart4
          style={{color: 'white', fontSize: '33px', marginRight: '10px', marginLeft: '10px'}} 
          />   
         {cartItemsCount > 0 && (
         <span className="item-count mr-1.5">
          {cartItemsCount}
          </span>
          )}
          </Link>
        </div>
   </div>
  </div>
   
   <div className="flex md:w-1/2 flex-1">
    <form
      className="search flex flex-grow items-center justify-center" 
      onSubmit={submitHandler}
    >
      <input
        onChange={(e) => setQuery(e.target.value)}
        type="text"
        placeholder="Search products..."
        className="border-gray-300 justify-center border rounded pl-3"
      />
      <button className="btn p-2 border rounded" type="submit"> 
          <SearchIcon /> 
      </button>
    </form> 
   </div> 
  <div className="hidden md:flex items-right justify-end px-4 py-4">
  {session?.user ? (
        <div className="relative">
        <button 
           ref={userRef}
           onClick={() => {
           setUserMenuOpen(!userMenuOpen); 
          }}
           className="cursor-pointer mt-1 
           flex items-center justify-center bg-white rounded-full w-7 h-7"
          >
          {session.user.name.charAt(0).toUpperCase()}
        </button>
           {
              userMenuOpen&&( 
              <div style={{ position: 'relative', zIndex: 9999 }}>
              <div 
              ref={userMenuRef}
              className="bg-gray-50 p-7 right-0 shadow-lg absolute top-1">
              
              <ul>
                 {userMenu.map((item) => (
                  <li 
                  onClick={()=> { setUserMenuOpen(false)
                  if (item.onClick) item.onClick();}}
                  className="p-0.5 cursor-pointer rounded hover:bg-gray-200"
                  key={item.label}>
                  <a href={item.href}>
                    {item.label} 
                  </a>
                </li>
                
                 ))}
                
               </ul>

           </div>  
           </div>
            )} 
       </div>
    ) : (
    <Link href="/login">Login/Register</Link>
    )}
   <div>
      <Link href="/cart">
        <BsCart4
          style={{color: 'white', fontSize: '33px', marginRight: '20px', marginLeft: '10px'}} 
          />   
         {cartItemsCount > 0 && (
         <span className="item-count mr-8">
          {cartItemsCount}
          </span>
          )}
          </Link>
        </div>
   </div>
    </nav>
    <div className="nav-links hidden md:flex flex-col md:flex-row gap-4 lg:gap-8 items-center justify-center">
          <Link href="/" className="text-black hover:underline">
            Home
          </Link>
          <Link href="/search" className="text-black hover:underline">
            Categories
          </Link>
          <Link href="/about" className="text-black hover:underline">
            About 
          </Link>
          <Link
            href="/contact"
            className="text-black hover:underline" >
            Contact US
          </Link>
        </div>
    </header>
  <main 
    style={{ marginLeft:'0px', marginRight:'0px', marginTop:'16px', width: '100%' }}>{children}
  </main>
 <footer className="footer flex h-10 mt-4 justify-center items-center shadow-inner">
      <p>Copyright © 2023 Bazaar</p>
  </footer>
      </div>
    </>
  );
}
