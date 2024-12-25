import Layout from '../components/Layout';
import { BsPhoneVibrate } from 'react-icons/bs';
import { JsonLd } from 'react-schemaorg';
import { DefaultSeo } from 'next-seo';

export default function ServicePage() {
  return (
    <Layout>
     <DefaultSeo
       title="Passport & Visa Services in Addis Ababa, Ethiopia | Easy Travel Solutions"
       description="Simplify your travel with our comprehensive passport and visa services in Addis Ababa, Ethiopia. We offer expert assistance, appointment booking, and documentation guidance. Get started today!"
       canonical="https://bazaar-et.vercel.app/services/"
       openGraph={{
        url: "https://bazaar-et.vercel.app/services/", 
        title: "Passport & Visa Services in Addis Ababa, Ethiopia | Easy Travel Solutions",
        description: "Simplify your travel with our comprehensive passport and visa services in Addis Ababa, Ethiopia. We offer expert assistance, appointment booking, and documentation guidance. Get started today!",
        site_name: "Bazaar",
       }}
       additionalMetaTags={[
       {
         name: "keywords",
         content: "passport services, visa services, Addis Ababa, Ethiopia, travel documents, visa application, visa appointment booking, new passport, passport renewal",
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
  url="https://bazaar-et.vercel.app/services/"
/>
      <div className="services">
        <h1 className="services text-center ml-8 mr-8">
          <b style={{ backgroundColor: '#B5E582' }}>ጉዞዎን ቀላል ያድርጉት፡ ፓስፖርት እና የቪዛ አገልግሎቶች ቀላል ተደርገዋል። Simplify Your Travel: Passport & Visa Services Made Easy</b>
        </h1>
        <div className="services-content"> 
          <h1 className="services text-left">
            <b>የሚቀጥለውን ጉዞዎን በማቀድ ላይ ኖት? ከፓስፖርት እና የቪዛ ማመልከቻዎች ችግር እናውጣዎ።የጉዞ ሰነዶችን ውስብስብ ነገሮች ለማሰስ እንዲረዳዎ አጠቃላይ አገልግሎቶችን እናቀርባለን። Planning your next adventure? Let us take the hassle out of passport and visa applications.We offer a comprehensive range of services to help you navigate the complexities of travel documentation.
            </b>
          </h1>
          <h1 className="services text-center">
            <b style={{ backgroundColor: '#B5E582' }}>የቪዛ ማመልከቻ ድጋፍ / Visa Application Support</b></h1>

          <ul className="services">
            <li style={{ listStyleType: 'disc' }}>
              <b style={{ backgroundColor: '#B5E582' }}>የመተግበሪያ ቅጽ መሙላት/ Applicationt Form Filling: </b>ቡድናችን የቪዛ ማመልከቻ ቅጾችዎን በሙያው ይሞላል ፣ ይህም ትክክለኛነትን እና ሁሉንም መስፈርቶች ማክበርን ያረጋግጣል። Our team expertly fills out your visa application forms, ensuring accuracy and compliance with all requirements.
            </li>
            <li style={{ listStyleType: 'disc' }}>
              <b style={{ backgroundColor: '#B5E582' }}>ቀጠሮ መያዝ / Appointment Booking: </b>ጊዜ እና ጭንቀትዎን በመቆጠብ የቪዛ ቃለ መጠይቅ ቀጠሮዎን እንይዛለን። We handle the scheduling of your visa interview appointments, saving you time and frustration.
            </li>
            <li style={{ listStyleType: 'disc' }}>
              <b style={{ backgroundColor: '#B5E582' }}>የሰነድ መመሪያ / Documentation Guidance: </b>ለእርስዎ የተለየ የቪዛ አይነት አስፈላጊ ሰነዶች ላይ ግልጽ እና አጭር መመሪያዎችን እናቀርባለን። We provide clear and concise instructions on the necessary documentation for your specific visa type.
            </li>
          </ul>
          <h2 className="services text-center">
            <b style={{ backgroundColor: '#B5E582' }}>የፓስፖርት አገልግሎቶች / Passport Services</b></h2>
          <ul>
            <li style={{ listStyleType: 'disc' }}>
              <b style={{ backgroundColor: '#B5E582' }}>ፓስፖርት ማደስ / Renewals: </b>ለነባር ፓስፖርትዎ የእድሳት ሂደቱን እናስተካክላለን። We streamline the renewal process for your existing passport, ensuring a smooth and timely experience.
            </li>
            <li style={{ listStyleType: 'disc' }}>
              <b style={{ backgroundColor: '#B5E582' }}>አዲስ ፓስፖርት ማውጣት / First-Time Applications: </b>ሰነዶችን ከመሰብሰብ ጀምሮ ማመልከቻዎን እስከ ማስገባት ድረስ የመጀመሪያ ፓስፖርትዎን በማመልከት ሂደት ውስጥ እንመራዎታለን። We guide you through the process of applying for your first passport, from gathering documents to submitting your application.
            </li>
            <li style={{ listStyleType: 'disc' }}>
              <b style={{ backgroundColor: '#B5E582' }}>ፓስፖርት ለልጆች / Child Passports: </b>ሁሉም አስፈላጊ መስፈርቶች መሟላታቸውን በማረጋገጥ ለልጆች ፓስፖርት በማመልከት እንረዳለን። We assist with applying for passports for children, ensuring all necessary requirements are met.
            </li>
            <li style={{ listStyleType: 'disc' }}>
              <b style={{ backgroundColor: '#B5E582' }}>የጠፉ ፓስፖርት ማውጣት / Lost or Damaged Passports: </b>የጠፋ ወይም የተበላሸ ፓስፖርት ሪፖርት ለማድረግ እና ለመተካት ሂደቱን እናግዝዎታለን። We help you navigate the process of reporting a lost or damaged passport and applying for a replacement.
            </li>
          </ul>
          <h2 className="services text-center">
            <b style={{ backgroundColor: '#B5E582' }}>Why Choose Us?</b></h2>
          <p>
            Experienced Professionals: Our team has extensive knowledge of passport and visa regulations, ensuring your applications are handled correctly.
            Time-Saving Solutions: We handle the paperwork and appointments, freeing you to focus on other aspects of your trip.
            Stress-Free Experience: We provide clear communication and support throughout the process, minimizing stress and confusion.
            Competitive Pricing: We offer affordable and transparent pricing for our services.
            Ready to travel? Get started today!
          </p>

          
            <span style={{ marginRight: '10px' }}>ከቤትዎ ሆነው በመደወል ይዘዙን / Call us and order from home:</span>
           <div style={{ display: 'flex', alignItems: 'center' }}> 
            <a href="tel:0977757992" className="primary-button" style={{ marginLeft: '70px' }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <BsPhoneVibrate size={28} />
                <span style={{ marginLeft: '10px' }}>0977757992</span>
              </span>
            </a>
          </div>
          የጉዞ ህልሞቻችሁን እውን እናድርግ /Let us make your travel dreams a reality.
        </div>
      </div>
    </Layout>
  )
}
