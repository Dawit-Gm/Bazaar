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


export default function ProductScreen(props) {
  const { product } = props;
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
    
    const [mainImage, setMainImage] = useState(product.image[0]);
    const [Images, setImages] = useState(product.image.filter(img => img !== mainImage));

    
  return (
    <Layout title={product.name}>
      <div className="mt-0 mb-3">
        <Link href="/">Back to Products</Link>
      </div>
      <div className="grid md:grid-cols-2 md:gap-5">
        <div className="md:col-span-1 ">
          <Image
            src={mainImage}
            alt={product.name}
            width={650}
            height={450}
            sizes="100vw"
            ></Image> 

      <div style={{ display: 'flex' }}>
       {Images.map((img, index) => (
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
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>          
            <li>
             Status: {product.countInStock > 0 ? 'In stock' : 'Unavailable'}
            </li>
           <li>
              Number of views: {product.numberOfViews} views
            </li>
            <li>
              Location: {product.location}
            </li>
            <div>Price:&nbsp;&nbsp;ETB&nbsp;{product.price}</div>
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
