import { useState } from "react";
import "./about.css";
import { useInView, InView } from 'react-intersection-observer';

import placeholderImg from '../../assets/placeholder-image.jpg'

const TextFunction = ({ text, maxLength }) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  const renderText = () => {
    if (text.length <= maxLength || showFullText) {
      return text;
    }

    return text.slice(0, maxLength) + "...";
  };

  return (
    <div>
      <p>{renderText()}</p>
      {text.length > maxLength && (
        <button className="btn-gold" onClick={toggleShowFullText}>
          {showFullText ? "See Less" : "See More"}
        </button>
      )}
    </div>
  );
};

const About = () => {
  const { ref: headerRef, inView: headerIsVisible } = useInView({ triggerOnce: true });
  const { ref: section1Ref, inView: section1IsVisible } = useInView({ triggerOnce: true });
  const { ref: section2Ref, inView: section2IsVisible } = useInView({ triggerOnce: true });
  const { ref: section3Ref, inView: section3IsVisible } = useInView({ triggerOnce: true });
  const { ref: section4Ref, inView: section4IsVisible } = useInView({ triggerOnce: true });
  const { ref: section5Ref, inView: section5IsVisible } = useInView({ triggerOnce: true });

  return (
    <>
      <div
        className={`aboutpage-header d-flex justify-content-center align-items-center ${headerIsVisible ? 'fade-in' : 'fade-out'}`}
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1521510535750-13af4de027e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80")',
        }}
        ref={headerRef}
      >
        <div className="text-white text-center" >
          <h2 className="display-2">Why AGOY</h2>
          <h6 className="mb-5">Learn more about AGOY Education</h6>
          <a href="#education" className="text-decoration-none btn-white">see education</a>
        </div>
      </div>
      
      <div className="container text-white">
        <div className="row height-50vh">
          <div className="col d-flex align-items-center justify-content-center placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
            <h2>Sleep Association</h2>
          </div>
          <div className="col d-flex align-items-center justify-content-center placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
            <h2>Yoga Association</h2>
          </div>
        </div>
      </div>

      <div className={`width-70vw mx-auto mt-5 ${section1IsVisible ? 'show-from-bottom' : 'hide-from-bottom'}`} ref={section1Ref}>
        <h1 className="text-gold">AGOY Sleep Experience</h1>
        <p className="text-dim">is the result of years of research and testing to create the most comfortable and
        advanced beds for you. The roots of the mattresses are reflected in the long tradition of Health &
        Wellness with the activity of sleep, increasing comfort, quality and fulfillment to you and providing you
        with all the necessary accoutrement to achieve this level of sleep.
        <br />
        <br />
        The philosophy and origin of Agoy Sleep Experience is centered around the belief that sleep is one of the
        most vital components of our health and lifestyle. In addition, the philosophy also brings in the concept
        of Yoga as part of the health and wellness cycle, introducing various means and methodology from Yoga
        into the people’s sleep.
        <br />
        <br />
        The combination of these concepts into one philosophy is the guiding principle by which Agoy Sleep
        Experience is able to offer people a more fulfilling sleep.
        </p>
      </div>

      <div className="mission-vision-container d-flex flex-wrap justify-content-center my-5" ref={section2Ref}>
        <div className={`mission-text text-dim p-4 ${section2IsVisible ? 'show-from-left' : 'hide-from-left'}`}>
          <div className="d-flex justify-content-center mx-auto">
            <img
              src="https://images.unsplash.com/photo-1462899006636-339e08d1844e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              className="mb-5"
              alt="Mission Image"
            />
          </div>
          <div className="mx-auto">
            <div className="width-30vw">
              <h2 className="text-gold">Mission</h2>
              <TextFunction
                text="Our mission at Agoy Sleep Experience is to empower individuals to achieve holistic wellness and rejuvenation by crafting mattresses inspired by the principles of yoga. We are dedicated to seamlessly blending the art of relaxation and the science of sleep, ensuring our customers experience the perfect balance between comfort, support, and tranquility. Through meticulous craftsmanship and innovative design, we aim to create mattresses that nurture the body, mind, and spirit. By integrating the principles of yoga into our products, we foster a harmonious sleep environment that promotes deep rest, stress relief, and alignment. At Agoy Sleep Experience, we prioritize the well-being of our customers. We strive to provide an exceptional sleep experience that transcends the ordinary, encouraging individuals to awaken their full potential and embrace a balanced lifestyle. We are committed to utilizing eco-friendly materials and sustainable manufacturing practices, thus promoting a healthier planet and a cleaner future. Our passionate team of artisans, gurus, and sleep experts work diligently to research, design, and develop mattresses that promote optimal rest and rejuvenation. We embrace continuous innovation and collaborate with leading experts in the field to ensure our products reflect the evolving needs and desires of our customers. Ultimately, our mission is to inspire a world where the transformative power of yoga and the rejuvenating benefits of quality sleep converge, allowing individuals to embark on a restorative journey towards enhanced well-being, inner harmony, and a revitalized life."
                maxLength={500}
              />
            </div>
          </div>
        </div>
        <div className={`vision-text text-dim p-4 ${section2IsVisible ? 'show-from-right' : 'hide-from-right'}`}>
          <div className="d-flex justify-content-center mx-auto">
            <img
              src="https://images.unsplash.com/photo-1441802763029-b621005a04a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1219&q=80"
              className="mb-5"
              alt="Vision Image"
            />
          </div>
          <div className="mx-auto">
            <h2 className="text-gold">Vision</h2>
            <TextFunction
              text="Our vision at Agoy Sleep Experience is to revolutionize the way people experience rest and relaxation by merging the timeless wisdom of yoga with the science of sleep. We envision a world where the act of sleeping becomes a sacred ritual, a transformative journey that nourishes the body, mind, and spirit. Through our innovative mattresses inspired by yoga, we aim to create a sleep sanctuary where individuals can effortlessly find solace, rejuvenation, and profound peace. We envision a future where each sleep experience is a harmonious blend of luxurious comfort, unparalleled support, and holistic wellness. At Agoy Sleep Experience, we aspire to become the global leader in yoga-infused sleep solutions, setting the benchmark for innovation, quality, and sustainability. We envision ourselves as pioneers, continuously pushing the boundaries of design and technology to create mattresses that transcend the ordinary and elevate the sleep experience to new heights. Our commitment to environmental consciousness is at the core of our vision. We strive to source eco-friendly materials and employ sustainable manufacturing practices, ensuring that our products not only benefit individuals but also contribute to a healthier planet for future generations. We envision a community of like-minded individuals who prioritize self-care, mindfulness, and well-being. By fostering a sense of connection and inspiration, we aim to create a movement where people embrace the transformative power of yoga-infused sleep, awakening their true potential and living their lives with intention and vitality. In pursuit of our vision, we collaborate with esteemed yoga practitioners, sleep experts, and innovators to refine our products and develop cutting-edge technologies that optimize sleep quality. By constantly evolving and adapting, we envision ourselves as catalysts of positive change in the sleep industry, creating a lasting impact on the lives of our customers. Together, we envision a future where Agoy Sleep Experience is synonymous with unparalleled sleep experiences, embodying the perfect balance between tranquility, rejuvenation, and the transformative essence of yoga."
              maxLength={500}
            />
          </div>
        </div>
      </div>

      {/* <div className={`about-brand-vocal bg-gold d-flex justify-content-center align-items-center mb-5 ${section3IsVisible ? 'fade-in' : 'fade-out'}`} ref={section3Ref}>
        <h2>BRAND VOCABULARY HERE</h2>
      </div> */}

      <div className="aboutpage-wordsinspire-container" ref={section4Ref}>
        <div className="mb-5">
          <h2 className={`display-6 text-gold text-center ${section4IsVisible ? 'show-from-bottom' : 'hide-from-bottom'}`}>WORDS THAT INSIPRES US</h2>
        </div>
        <div className="d-flex justify-content-between align-items-center text-white">
          <div className={`aboutpage-wordsinspire-box d-flex justify-content-center align-items-center ${section4IsVisible ? 'show-from-left' : 'hide-from-left'}`} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1561049501-e1f96bdd98fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=378&q=80")'}}>
            <h2 className="display-5">YOGA*</h2>
          </div>
          <div className={`aboutpage-wordsinspire-box d-flex justify-content-center align-items-center ${section4IsVisible ? 'show-from-bottom' : 'hide-from-bottom'}`} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=465&q=80")'}}>
            <h2 className="display-5">JOURNEY*</h2>
          </div>
          <div className={`aboutpage-wordsinspire-box d-flex justify-content-center align-items-center ${section4IsVisible ? 'show-from-right' : 'hide-from-right'}`} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1562088287-bde35a1ea917?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=464&q=80")'}}>
            <h2 className="display-5">CREATIVITY*</h2>
          </div>
        </div>
      </div>

      {/* <hr className="width-80vw mx-auto my-5"/> */}
    </>
  );
};

export default About;
