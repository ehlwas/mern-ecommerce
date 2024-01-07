import { useInView, InView } from 'react-intersection-observer';

const Education = () => {
    const { ref: section5Ref, inView: section5IsVisible } = useInView({ triggerOnce: true });
  
    return (
        <>
            <div className={`abouteducation-header d-flex align-items-center ${section5IsVisible ? 'fade-in': 'fade-out'}`} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1220&q=80")' }} id="education" ref={section5Ref}>
                <div className='header-two-content mx-auto text-white'>
                <div className='d-flex'><h3 className='font-weight-bold display-5'>AGOY Education</h3></div>
                    <p className="abouteducation-header-text">
                    AGOY Sleep Experience is committed to provided instruction and education relating to the benefits of a
                    healthy sleep experience, by providing videos and articles that contain research and advice on how best
                    you can manage your sleep.
                    <br />
                    <br />
                    These instructional videos and articles combine the technology behind our products with tried and
                    tested sleep advice from professionals in their fields, targeting pain areas where sleep is unfulfilled and
                    ensuring that you are aware of the corrective measures that you can perform to better your sleep.
                    </p>
                </div>
            </div>

            <div className="d-flex flex-wrap justify-content-around align-items-center mt-5 text-dim">
                <InView triggerOnce={true}>
                {({ inView, ref, entry }) => (
                    <div className={`aboutpage-blogs-box ${inView ? 'show-from-bottom' : 'hide-from-bottom'}`} ref={ref}>
                    <img src="https://images.unsplash.com/photo-1605365070248-299a182a2ca6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" />
                    <div className="p-3">
                        <h5 className='text-gold'>Title 1</h5>
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor, sed cumque iusto minus, porro sint at quo pariatur aperiam molestias, consectetur odio quis! Culpa est aliquam illo laudantium enim quo!</p>
                        <button className="btn-gold">read more</button>
                    </div>
                    </div>
                )}
                </InView>
                <InView triggerOnce={true}>
                {({ inView, ref, entry }) => (
                    <div className={`aboutpage-blogs-box ${inView ? 'show-from-bottom' : 'hide-from-bottom'}`} ref={ref}>
                    <img src="https://images.unsplash.com/photo-1605365070248-299a182a2ca6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" />
                    <div className="p-3">
                        <h5 className='text-gold'>Title 2</h5>
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor, sed cumque iusto minus, porro sint at quo pariatur aperiam molestias, consectetur odio quis! Culpa est aliquam illo laudantium enim quo!</p>
                        <button className="btn-gold">read more</button>
                    </div>
                    </div>
                )}
                </InView>
                <InView triggerOnce={true}>
                {({ inView, ref, entry }) => (
                    <div className={`aboutpage-blogs-box ${inView ? 'show-from-bottom' : 'hide-from-bottom'}`} ref={ref}>
                    <img src="https://images.unsplash.com/photo-1605365070248-299a182a2ca6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" />
                    <div className="p-3">
                        <h5 className='text-gold'>Title 3</h5>
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor, sed cumque iusto minus, porro sint at quo pariatur aperiam molestias, consectetur odio quis! Culpa est aliquam illo laudantium enim quo!</p>
                        <button className="btn-gold">read more</button>
                    </div>
                    </div>
                )}
                </InView>
            </div>

            <div className={`abouteducation-header d-flex align-items-center mb-5 ${section5IsVisible ? 'fade-in': 'fade-out'}`} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1220&q=80")' }} id="education" ref={section5Ref}>
                <div className='header-two-content mx-auto text-white'>
                <div className='d-flex'><h3 className='font-weight-bold display-5'>Sleep (101)</h3></div>
                    <p className="abouteducation-header-text">
                    AGOY Sleep Experience is committed to provided instruction and education relating to the benefits of a
                    healthy sleep experience, by providing videos and articles that contain research and advice on how best
                    you can manage your sleep.
                    <br />
                    <br />
                    These instructional videos and articles combine the technology behind our products with tried and
                    tested sleep advice from professionals in their fields, targeting pain areas where sleep is unfulfilled and
                    ensuring that you are aware of the corrective measures that you can perform to better your sleep.
                    </p>
                </div>
            </div>

            <div className="d-flex flex-column align-items-center gap-5 mb-5">
                <iframe width="900vw" height="500px" src="https://www.youtube.com/embed/wrOipqzNZWI"></iframe>
                <iframe width="900vw" height="500px" src="https://www.youtube.com/embed/S2wu-3GjPtA"></iframe>
                <iframe width="900vw" height="500px" src="https://www.youtube.com/embed/wjDBAex1Ab0"></iframe>
            </div>
        </>
    )
}

export default Education