import React, { useContext } from 'react';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import { Store } from '../utils/Store';
import axios from 'axios';
import db from '../utils/db';
import Product from '../models/Product';
import { toast } from 'react-toastify';
import { DefaultSeo } from 'next-seo';
import { JsonLd } from 'react-schemaorg';
import Image from 'next/image';
import Link from 'next/link';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

export default function Home({ products, categories }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
 // const [containerWidth, setContainerWidth] = useState(0);

 {/* // Use useLayoutEffect to ensure DOM is updated before accessing elements
  useLayoutEffect(() => {
    const handleResize = () => {
      const gridContainer = document.getElementById('grid-container');
      if (gridContainer) {
        setContainerWidth(gridContainer.offsetWidth);
      }
    };

    // Ensure grid-container exists before accessing its properties
    const gridContainer = document.getElementById('grid-container');
    if (gridContainer) {
      setContainerWidth(gridContainer.offsetWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);*/}

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    toast.success('Product added to the cart');
  };

  const imageUrls = [
    'https://res.cloudinary.com/dxxzqmxu5/image/upload/v1719848190/addtext_com_MTEyODEzMjM5Mg_p1hxqr.png',

    'https://res.cloudinary.com/dxxzqmxu5/image/upload/v1719910428/plastic_products_hdzp3p.jpg',
    'https://res.cloudinary.com/dxxzqmxu5/image/upload/v1719848190/addtext_com_MTEyODEzMjM5Mg_p1hxqr.png',
  ];

  return (
    <Layout>
      <DefaultSeo
        title="Buy Plastic Products Online With a Factory Price Option in Addis Ababa, Ethiopia"
        description="Shop affordable plastic products With a Factory Price Option at Ethiopia’s top online store, Bazaar.com. Find chairs, tables, kitchenwares, and more. Enjoy quick delivery in Addis Ababa and save time and money."
        canonical="https://www.bazaar.et/"
        openGraph={{
          url: 'https://www.bazaar.et/',
          title: 'Buy Plastic Products Online With a Factory Price Option in Addis Ababa, Ethiopia',
          description: "Shop affordable plastic products With a Factory Price Option at Ethiopia’s top online store, Bazaar.com. Find chairs, tables, kitchenwares, and more. Enjoy quick delivery in Addis Ababa and save time and money.",
          images: imageUrls.map((url) => ({ url })),
          site_name: 'Bazaar',
        }}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: '/favicon.ico',
          },
        ]}
        additionalMetaTags={[
          {
            name: 'google-site-verification',
            content: 'LQcA8czKq5n5r2DX8Guc5WMUllIzRZQU3q2JA3ywvII',
          },
        ]}
      />
      <JsonLd
        itemScope
        itemType="http://schema.org/WebPage"
        itemProp="mainEntity"
        itemID="https://www.bazaar.et/"
        url="https://www.bazaar.et/"
      />
      <div className="carousel-container" >
        <Carousel
          showThumbs={false}
          autoPlay
          infiniteLoop
          interval={10000}
          showStatus={false}
          showIndicators={false}
          className="custom-carousel"
        >
          {imageUrls.map((imageUrl, index) => (
            <div key={index} className="carousel-item">
              <Image 
              src={imageUrl}
              alt={`Image ${index + 1}`}
              width={1200}
              height={600}
              layout="responsive"
              />
            </div>
          ))}
        </Carousel>
      </div>

        
      <div id="grid-container">
        <div className="grid md:grid-cols-4 md:gap-5">
          {/* Categories Sidebar - Hidden on mobile, visible on md+ */}
          <div className="hidden md:block md:col-span-1 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            {/*<h2 className="text-xl font-semibold mb-4">Products</h2>*/}
            <nav className="space-y-2">
             {/*<Link
                href="/search"
                className="block px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                All Products
              </Link>*/}
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/search?category=${category}`}
                  className="block px-4 py-3 rounded-lg transition-colors hover:bg-gray-50 text-gray-700"
                >
                  {category}
                </Link>
              ))}
            </nav>
          </div>

          {/* Products Grid - Full width on mobile, 75% on desktop */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductItem
                  key={product.slug}
                  product={product}
                  addToCartHandler={addToCartHandler}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  const categories = await Product.distinct('category');
  await db.disconnect();

  return {
    props: {
      products: products.map(db.convertDocToObj),
      categories,
    },
  };
}