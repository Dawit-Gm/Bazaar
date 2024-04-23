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
//import Head from 'next/head';
import { JsonLd } from 'react-schemaorg';
import { DefaultSeo } from 'next-seo';
import Image from 'next/image';


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

    const imageUrls = ['https://res.cloudinary.com/dxxzqmxu5/image/upload/v1713883150/Bazaar.com_vlsdx2.png',
                       'https://res.cloudinary.com/dxxzqmxu5/image/upload/t_plastic products/v1713886130/plastcs1_cwmtvd.jpg',
                       'https://res.cloudinary.com/dxxzqmxu5/image/upload/t_plastic products/v1713885892/plastic_product_yex1nz.jpg'];
  return (
    <Layout>
      <DefaultSeo
        title="Buy Plastic Products Online in Addis Ababa, Ethiopia"
        description="Shop affordable plastic products at Ethiopia’s top online store, Bazaar.com. Find chairs, tables, kitchenwares, and more. Enjoy quick delivery in Addis Ababa and save time and money."
        canonical="https://www.bazaar.com.et/"
        openGraph={{
          url: 'https://www.bazaar.com.et/',
          title: 'Buy Plastic Products Online in Addis Ababa, Ethiopia',
          description: "Shop affordable plastic products at Ethiopia’s top online store, Bazaar.com. Find chairs, tables, kitchenwares, and more. Enjoy quick delivery in Addis Ababa and save time and money.",
          images: imageUrls.map((url) => ({ url })),
          site_name: 'Bazaar.com',
         }}
         additionalLinkTags={[
          {
            rel: 'icon',
            href: '/favicon.ico'
          },
        ]} 
      />
      <JsonLd
        itemScope
        itemType="http://schema.org/WebPage"
        itemProp="mainEntity"
        itemID="https://www.bazaar.com.et/"
        url="https://www.bazaar.com.et/"
      />
      <Carousel showThumbs={false} autoPlay>
        {imageUrls.map((url, index) => (
        <div key={index}>
         <Image src={url} alt={`Image ${index + 1}`} width={450} height={130} />
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
