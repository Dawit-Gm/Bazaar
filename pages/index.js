import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
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
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setContainerWidth(document.getElementById('grid-container').offsetWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set the initial value

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


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

    const imageUrls = ['https://res.cloudinary.com/dxxzqmxu5/image/upload/v1721127128/%E1%89%A3%E1%8B%9B%E1%88%AD_Bazaar.com_3_rc7uba.png',
                       'https://res.cloudinary.com/dxxzqmxu5/image/upload/v1719910428/plastic_products_hdzp3p.jpg',
                       'https://res.cloudinary.com/dxxzqmxu5/image/upload/v1719848190/addtext_com_MTEyODEzMjM5Mg_p1hxqr.png',
                      ];
                      const servicesPageUrl = 'https://www.bazaar.com.et/service';

                      const imageData = imageUrls.map((imageUrl, index) => {
                 return {
                       imageUrl,
                      link: index === 2 ? servicesPageUrl : null, // Add link for the third image
                      alt: index === 2 ? 'Visa and Passport Services in Ethiopia' : `Image ${index + 1}`, // Add specific alt for the third image
                    };
                    });

                      
  return (
    <Layout>
      <DefaultSeo
        title="Buy Plastic Products Online With a Factory Price Option in Addis Ababa, Ethiopia"
        description="Shop affordable plastic products With a Factory Price Option at Ethiopia’s top online store, Bazaar.com. Find chairs, tables, kitchenwares, and more. Enjoy quick delivery in Addis Ababa and save time and money."
        canonical="https://bazaar-et.vercel.app/"
        openGraph={{
          url: 'https://bazaar-et.vercel.app/',
          title: 'Buy Plastic Products Online With a Factory Price Option in Addis Ababa, Ethiopia',
          description: "Shop affordable plastic products With a Factory Price Option at Ethiopia’s top online store, Bazaar.com. Find chairs, tables, kitchenwares, and more. Enjoy quick delivery in Addis Ababa and save time and money.",
          images: imageUrls.map((url) => ({ url })),
          site_name: 'Bazaar',
         }}
         additionalLinkTags={[
          {
            rel: 'icon',
            href: '/favicon.ico'
          },
            ]} 
          additionalMetaTags={[
         {
           name: 'google-site-verification',
           content: 'LQcA8czKq5n5r2DX8Guc5WMUllIzRZQU3q2JA3ywvII' 
          },
        ]}  
      />
      <JsonLd
        itemScope
        itemType="http://schema.org/WebPage"
        itemProp="mainEntity"
        itemID="https://bazaar-et.vercel.app/"
        url="https://bazaar-et.vercel.app/"
      />
      <Carousel 
         showThumbs={false} 
         autoPlay 
         infiniteLoop={true} 
         interval={10000}
         >       
       {imageData.map((image, index) => (
          <a href={image.link} target="_blank" rel="noopener noreferrer" key={index}>
            <div>
              <Image 
                 src={image.imageUrl} 
                 alt={image.alt} // Use the alt text from imageData
                 width={450} 
                 height={130} />
            </div>
          </a>
        ))}
      </Carousel>
     <div id="grid-container">
        {containerWidth > 0 && (
          <GridLayout containerWidth={containerWidth} className="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product) => (
              <ProductItem
                product={product}
                key={product.slug}
                addToCartHandler={addToCartHandler}
              ></ProductItem>
            ))}
          </GridLayout>
        )}
      </div>
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
