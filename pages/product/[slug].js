import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import Product from '../../models/Product';
import db from '../../utils/db';
import { Store } from '../../utils/Store';

import '@fortawesome/fontawesome-free/css/all.css';
import { BsPhoneVibrate } from 'react-icons/bs';
import Head from 'next/head';


export default function ProductScreen(props) {
  const { product } = props;

  let mainImage = product.image[0];  
  let images = product.image.filter(img => img !== mainImage);

  const [currentMainImage, setMainImage] = useState(mainImage);
  const [currentImages, setImages] = useState(images);
 
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  if (!product) {
    return <Layout title="Produt Not Found">Produt Not Found</Layout>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);


    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
    };

       
  return (
    <Layout title={product.name}>
       <Head>
        <title>Plastic Products in Ethiopia | Buy Plastic Items at Low Prices Online</title>
        <meta name="description" content="Shop from the largest selection Ethiopia's #1 Online Store for all Your Plastic product needs. Save trips and shop comfortably online. Then sit back as we deliver at low prices." />
        <meta name="keywords" content="Arm Chair,Armless Chair, Square Table, Circle Table, Duka, Children's Chair, Children's Table, Flowering Vase,Flowering Pot, kichenware, Small Chair,cleaninig Bucket,Trash Basket,Laundary Basket, Dish Drying Shelve, Dustbin, Plastic Box" />
        <link rel="canonical" href="https://www.bazaar-et.vercel.app.com/" />
      </Head>
      <div className="mt-0 mb-3">
        <Link href="/">Back to Products</Link>
      </div>
      <div className="grid md:grid-cols-2 md:gap-5">
        <div className="md:col-span-1 ">
         <Image
            src={currentMainImage}
            alt={product.name}
            width={650}
            height={450}
            sizes="100vw"
          ></Image> 

      <div style={{ display: 'flex' }}>
       {currentImages.map((img, index) => (
       <Image
        key={index}
        src={img}
        width={90}
        height={90} 
        sizes="100vw"
        onClick={() => {
          setMainImage(img);
          setImages(product.image.filter(image => image !== img));
        }}
        style={{ marginTop:'5px', margin:'2px', cursor: 'pointer'}}
      />
      ))}
       
     </div>
      </div>
        <div style={{ marginTop:'5px', marginLeft:'0px'}}>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <div>Price:&nbsp;&nbsp;ETB&nbsp;{product.price}</div>
            <li>Category: {product.category}</li>         
            <li>Brand: {product.brand}</li>  
            <li>
              Location: {product.location}
            </li>
            <li>
             Status: {product.countInStock > 0 ? 'In stock' : 'Unavailable'}
            </li>
            {/*<li>
              Number of views: {product.numberOfViews} views
            </li>*/}
            <li>Description: {product.description}</li>
         </ul>
          <div style={{display: 'flex'}}>
            <button
                className="primary-button"
                onClick={addToCartHandler}
              >
                Add to cart
              </button> 

              <a href="tel:0799434941" className="primary-button">
                <span style={{display: 'flex', alignItems: 'center',}}>
                <BsPhoneVibrate size={28} />
                <span style={{marginLeft: '10px'}}>0799434941</span> 
                </span>
              </a>
           </div>        
          </div>       
        </div> 
    </Layout>
    );
  }

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
