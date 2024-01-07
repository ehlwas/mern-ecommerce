// import { useContext } from 'react'
// import { ItemPropsContext } from '../../context/itemPropsContext';
import { useInView } from 'react-intersection-observer';

import './home.css'

// import craftmanshipImage from '../../assets/images/craftmanshipImage.jpeg'
import headerImg1 from '../../assets/images/homepage/img1.jpg'
import craftmanshipImage from '../../assets/images/homepage/img2.png'
import restoreQualImage from '../../assets/images/homepage/img3.png'
import placeholderImg from '../../assets/placeholder-image.jpg'

import AGOYLogo from '../../assets/AGOYwhite.svg'

const Home = () => {    
    // const { displayDropdown } = useContext(ItemPropsContext);

    const { ref: headerRef, inView: headerIsVisible } = useInView({ triggerOnce: true });
    const { ref: section1Ref, inView: section1IsVisible } = useInView({ triggerOnce: true });
    const { ref: section2Ref, inView: section2IsVisible } = useInView({ triggerOnce: true });
    const { ref: section3Ref, inView: section3IsVisible } = useInView({ triggerOnce: true });
    const { ref: section4Ref, inView: section4IsVisible } = useInView({ triggerOnce: true });
    const { ref: section5Ref, inView: section5IsVisible } = useInView({ triggerOnce: true });

    return (
        <>
            {/* HEADER */}
            <div className={`header-container text-white shadow-sm placeholder-image ${headerIsVisible ? 'fade-in' : 'fade-out'}`} style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.3)), url(${headerImg1})` }} ref={headerRef}>
                <div className='header-one-content text-center'>
                    {/* <div className='m-auto width-100 height-10 bg-white ' /> */}
                    {/* <h2 className='title'>Discover</h2> */}
                    <img src={AGOYLogo} alt='Logo Image' width='250px' />
                    {/* <h6>Making of the mattress</h6> */}
                    {/* <button className='mt-4 btn-white'>see more</button> */}
                </div>
            </div>

            {/* NEXT LEVEL OF COMFORT */}
            <div className={`next-level-container d-flex flex-wrap justify-content-around`} ref={section1Ref}>
                <div className={`next-level-title text-gold ${section1IsVisible ? 'show-from-left' : 'hide-from-left'}`}>
                    <h1>NEXT LEVEL OF</h1>
                    <div className='d-flex comfort-col'><h1 className='next-level-comfort font-weight-bold'>COMFORT</h1><p className='tm-small'>TM</p></div>
                </div>
                <div className={`${section1IsVisible ? 'show-from-right' : 'hide-from-right'}`}>
                    <p className='next-level-text text-dim'>Enjoying the comfort of your bed is the ultimate luxury. Our goal is to provide you with
                    the best possible experience during your rest & sleep. We achieve this through
                    innovation. Agoy Sleep Experience enables the highest quality sleep, supporting your
                    wellbeing and ensuring a healthy and rewarding sleep.</p>
                    <button className='btn-gold'>read article</button>
                </div>
            </div>

            {/* PHILOSOPHY */}
            <div className="philosophy-navbar-container d-flex text-white letter-spacing-1" ref={section2Ref}>
                <div className={`philosophy-image-holder ${section2IsVisible ? 'fade-in' : 'fade-out'}`}>
                    {/* <img src='https://images.pexels.com/photos/298842/pexels-photo-298842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' className='img-fluid' /> */}
                    <img src={headerImg1} className='img-fluid' />
                </div>
                <div className='d-flex flex-column justify-content-center align-items-center'>
                    <div className={`philosophy-text ${section2IsVisible ? 'show-from-bottom' : 'hide-from-bottom'}`}>
                        <h1 className='text-gold'>PHILOSOPHY</h1>
                        <p className='text-dim'>Our brand belief is that people should renew the deeply intimate relationship with their
                        sleep in all its fullness. It is more a love affair than a business partnership. Savor and
                        safeguard our realm of sleep, not just for its performance benefits but for the special
                        way it allows us to connect with ourselves, practice mindfulness, enjoy the pre-sleep
                        preparation anticipating a truly good night sleep and reap the benefits of a post-sleep
                        drive for the new day.</p>
                        {/* <button className='btn-gold'>read article</button> */}
                    </div>
                </div>
            </div>
            
            {/* SUSTAINABLE CRAFTMANSHIP */}
            <div className={`craftmanship-title text-center text-gold ${section3IsVisible ? 'show-from-bottom' : 'hide-from-bottom'}`} ref={section3Ref}>
                <h1>SUSTAINABLE<br />CRAFTMANSHIP</h1>
                <h6 >Mattress Making</h6>
            </div>

            <div className="craftmanship-body d-flex justify-content-around text-white bg-gray" ref={section4Ref}>
                <div className={`craftmanship-body-col d-flex justify-content-center align-items-center ${section4IsVisible ? 'show-from-left' : 'hide-from-left'}`}>
                    <div className='philosophy-text text-dim'>
                        <p>It all starts with the materials. We pick
                        slow growth, strong pine, and high
                        tensile steel to build the highest quality
                        beds. AGOY choices are dictated by
                        responsibility towards the environment
                        and sustainable goals.</p>
                        <button className='btn-gold'>know more</button>
                    </div>
                </div>
                <div className={`craftmanship-body-col craftmanship-image-holder ${section4IsVisible ? 'fade-in' : 'fade-out'}`}>
                    <img src={headerImg1} className='img-fluid' alt='Craftmanship Image' />
                </div>
            </div>

            {/* RESTORE QUALITY */}
            <div className={`res-qual-container text-white letter-spacing-1 placeholder-image ${section5IsVisible ? 'fade-in' : 'fade-out'}`} style={{ backgroundImage: `url('${headerImg1}')` }} ref={section5Ref}>
                <div className='header-two-content mx-auto container'>
                    <div className='row'>
                        <div className='col pt-4'>
                            <div className='d-flex'><h1 className='text-gold'>RESTORE QUALITY</h1></div>
                            <p className='restore-qual-text text-dim'>We design our beds to last a lifetime. Since our Agoy mattresses are comprised of
                            replaceable and upgradable components, our beds cannot only be restored as it shows
                            wear but may be improved throughout the years with the release of new accessories
                            and technological innovations.</p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Home