
import placeholderImg from '../../assets/placeholder-image.jpg'
import headerImg1 from '../../assets/images/homepage/img1.jpg'

const LibraryContent = () => {
    return (
        <>
            <div className="container mt-5 mb-5">
                <div className="text-center">
                    <h1 className="text-gold">Heading 1</h1>
                    <h2 className="mb-4 text-gold">Heading 2</h2>
                    <p className="w-50 mx-auto text-dim">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
                </div>
            </div>

            <div className='height-60vh placeholder-image' style={{ backgroundImage: `url(${headerImg1})` }}></div>

            <div className='container'>
                <div className='row height-30vh'>
                    <div className='col d-flex justify-content-center align-items-center'>
                        <h2 className='mb-0 text-gold mont-bold'>HOW IT WORKS</h2>
                    </div>
                    <div className='col d-flex justify-content-center align-items-center'>
                        <p className='m-0 w-75 text-dim'>The top layer of The AGOY Bed with Pascal can be unzipped to reveal six interchangeable spring cassettes; three for each side. You can arrange the cassettes based on your body size, shape and needs.</p>
                    </div>
                </div>
            </div>

            <div className="">
                <div className="row m-0 height-40vh">
                    <div className="col p-0 placeholder-image" style={{ backgroundImage: `url(${headerImg1})` }}>
                        {/* <img src={headerImg1} className='img-fluid' alt='Image Holder' /> */}
                    </div>
                    <div className="col p-0 bg-gray d-flex align-items-center placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                        <p className='w-75 mx-auto'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                </div>
            </div>
            <div className="">
                <div className="row m-0 height-40vh">
                    <div className="col p-0 bg-gray d-flex align-items-center placeholder-image" style={{ backgroundImage: `url(${placeholderImg})` }}>
                        <p className='w-75 mx-auto'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                    <div className="col p-0 placeholder-image" style={{ backgroundImage: `url(${headerImg1})` }}>
                        {/* <img src={headerImg1} className='img-fluid' alt='Image Holder' /> */}
                    </div>
                </div>
            </div>

            <h2 className='text-center text-gold mt-5 mb-4 mont-bold'>Related</h2>

            <div className="d-flex flex-wrap justify-content-around align-items-center text-white mb-5">
                <div className='position-relative'>
                    <img src={placeholderImg} className='img-fluid' alt='Image Holder' width="400px" />
                    <div className='position-absolute' style={{ bottom: "0", left: "20px" }}>
                        <h3>Library 1</h3>
                        <p>There is a paragraph here.</p>
                    </div>
                </div>
                <div className='position-relative'>
                    <img src={placeholderImg} className='img-fluid' alt='Image Holder' width="400px" />
                    <div className='position-absolute' style={{ bottom: "0", left: "20px" }}>
                        <h3>Library 2</h3>
                        <p>There is a paragraph here.</p>
                    </div>
                </div>
                <div className='position-relative'>
                    <img src={placeholderImg} className='img-fluid' alt='Image Holder' width="400px" />
                    <div className='position-absolute' style={{ bottom: "0", left: "20px" }}>
                        <h3>Library 3</h3>
                        <p>There is a paragraph here.</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LibraryContent