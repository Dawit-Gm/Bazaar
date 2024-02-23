import axios from 'axios';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import GridLayout from 'react-grid-layout';
import Head from 'next/head';


export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    /*data.numberOfViews++;
    await axios.put(`/api/products/ ${product._id}`, {
      numberOfViews: data.numberOfViews
    });
    toast.success(data.numberOfViews);*/
  

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    toast.success('Product added to the cart');
  };

    const imageUrls = ['https://res.cloudinary.com/dxxzqmxu5/image/upload/v1689594094/banner2_dvibxa.jpg', 
                      'https://res.cloudinary.com/dxxzqmxu5/image/upload/v1689594059/banner1_tsl0jc.jpg'];
  return (
    <Layout>
      <Head>
        <title>Plastic Products in Ethiopia | Buy Affordable Online</title>
        <meta name="google-site-verification" content="LQcA8czKq5n5r2DX8Guc5WMUllIzRZQU3q2JA3ywvII" />
        <meta name="description" content="Shop from the largest selection Ethiopia's #1 Online Store for all Your Plastic product needs. Save trips and shop comfortably online. Then sit back as we deliver at low prices." />
        <meta name="keywords" content="Online Plastic Store, Plastic Products,Plastic Chair,Plastic Table,Flowering Vase, kichenware, Wholesale,Plastic Retail, Low Prices, Addis Ababa Ethiopia" />
        <link rel="canonical" href="https://www.bazaar.com.et/" />
        
      </Head>
      <Carousel showThumbs={false} autoPlay>
        {imageUrls.map((url, index) => (
        <div key={index}>
        <img src={url} alt={`Image ${index + 1}`} />
        </div>
        ))}
      </Carousel>      
      <GridLayout className="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
            addToCartHandler={
              addToCartHandler
            }
          ></ProductItem>
        ))}
      </GridLayout>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  const featuredProducts = await Product.find({ isFeatured: true }).lean();
  return {
    props: {
      featuredProducts: featuredProducts.map(db.convertDocToObj),
      products: products.map(db.convertDocToObj),
    },
  };
}
