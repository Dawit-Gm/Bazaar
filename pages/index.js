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
        <title>Plastic items supplier in Ethiopia | Online Store for Household Plastic Products in Addis Ababa</title>
        <meta name="google-site-verification" content="LQcA8czKq5n5r2DX8Guc5WMUllIzRZQU3q2JA3ywvII" />
        <meta name="description" content="The largest selection Ethiopia's #1 Online Store for all Your Plastic product needs. Shop for affordable household plastic products online in Ethiopia. Save time and money with low prices on plastic arm chair, chairs, tables, kitchenware, dustbin, bread and fruit crate, plastic box, shelf, basket, dish dryer, laundary basket and more with delivery option." />
        <meta name="keywords" content="Online Plastic product Suplier in Ethiopia, Plastic Products suplier in Ethiopia , Plastic Chair in Ethiopia, Plastic Table in Ethiopia, Flowering Vase in Ethiopia, kichenware in Ethiopia, Plastic product Wholesale in Ethiopia , Plastic Retail Low Prices in Addis Ababa Ethiopia" />
        <link rel="canonical" href="https://www.bazaar.com.et/" />
        <link rel="icon" href="/favicon.ico" />
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
