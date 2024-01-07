import placeholderImg from '../../assets/placeholder-image.jpg'

const SLPreSleepContent = () => {
    return (
        <>
            <div className="sl-content-banner bg-gold text-white mb-5" style={{ backgroundImage: `url(${placeholderImg})` }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-5">
                        <p>
                            <h2 className="mont-bold">Pre-sleep activities,</h2> also known as bedtime routines or wind-down rituals, are a set of activities that 
                            people engage in to help prepare their minds and bodies for sleep. These activities are designed to relax 
                            and calm the body, signal to the brain that it's time to wind down and improve the overall quality of 
                            sleep. Here are some common pre-sleep activities that people often incorporate into their routines
                        </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='container text-dim mb-5'>
                <div className='row'>
                    <div className='col p-0 d-flex justify-content-center align-items-center'>
                        <div className='w-75'>
                            <h2 className='mont-bold text-gold'>Screen Dimming</h2>
                            <p>Reduce exposure to bright screens, such as those of smartphones, tablets, 
                            computers, and televisions, at least an hour before bedtime. The blue light emitted by screens can 
                            interfere with the production of the sleep-inducing hormone melatonin.</p>
                        </div>
                    </div>
                    <div className='col p-0'>
                        <img src={placeholderImg} className='img-fluid' alt='Image Holder' />
                    </div>
                </div>
                <div className='row'>
                    <div className='col p-0'>
                        <img src={placeholderImg} className='img-fluid' alt='Image Holder' />
                    </div>
                    <div className='col p-0 d-flex justify-content-center align-items-center'>
                        <div className='w-75'>
                            <h2 className='mont-bold text-gold'>Reading</h2>
                            <p>Engaging in a calming activity like reading a book, magazine, or e-reader with an adjustable 
                            backlight can help shift your focus away from the day's stresses and prepare your mind for relaxation.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray text-dim text-next-image-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col">
                            <h2 className='text-gold'><bold>Warm Bath</bold> or <bold>Shower</bold></h2>
                            <p>Taking a warm bath or shower can help lower your body temperature, which 
                            in turn can signal to your body that it's time to wind down and prepare for sleep.</p>
                        </div>
                        <div className="col">
                            <img src={placeholderImg} className='img-fluid' alt='Image Holder' />
                        </div>
                    </div>
                </div>
            </div>


            <div className="sl-content-banner bg-gold text-white" style={{ backgroundImage: `url(${placeholderImg})` }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-5">
                        <p>
                            <h2 className="mont-bold">Relaxation Techniques:</h2> Engaging in relaxation techniques such as deep breathing, progressive muscle 
                            relaxation, or meditation can help calm the mind and reduce stress and anxiety
                        </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gold text-white mb-5 text-next-image-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col">
                            <img src={placeholderImg} className='img-fluid' alt='Image Holder' />
                        </div>
                        <div className="col">
                            <h2 className="mb-0"><bold>Listening to Soothing Music</bold></h2>
                            <h2>or <bold>Sounds</bold></h2>
                            <p>Playing calming music or white noise can create a peaceful 
                            environment that promotes relaxation and helps drown out external disturbances.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container text-dim three-row-content mb-5">
                <div className="row mb-3">
                    <div className="col">
                        <img src={placeholderImg} className='img-fluid' alt='Image Holder' />
                        <div className="w-75 mx-auto mt-3">
                            <h2 className="mont-bold text-gold">Journaling</h2>
                            <p>Writing down your thoughts, concerns, or accomplishments of the day can help clear your 
                            mind and reduce racing thoughts that might keep you awake.</p>
                        </div>
                    </div>
                    <div className="col">
                        <img src={placeholderImg} className='img-fluid' alt='Image Holder' />
                        <div className="w-75 mx-auto mt-3">
                            <h2 className="mont-bold text-gold">Aromatherapy</h2>
                            <p>Using calming scents such as lavender through essential oils, diffusers, or scented 
                            candles can create a soothing atmosphere that promotes sleepiness.</p>
                        </div>
                    </div>
                    <div className="col">
                        <img src={placeholderImg} className='img-fluid' alt='Image Holder' />
                        <div className="w-75 mx-auto mt-3">
                            <h2 className='text-gold'><bold>Light Stretching</bold> or <bold>Yoga</bold></h2>
                            <p>Using calming scents such as lavender through essential oils, diffusers, or scented 
                            candles can create a soothing atmosphere that promotes sleepiness.</p>
                        </div>
                    </div>
                </div>

                <div className="row four-row-content height-50vh">
                    <div className="col text-white" style={{ backgroundImage: `url(${placeholderImg})` }}>
                        <div>
                            <h2 className='text-gold'><bold>Limiting Caffeine</bold> and <bold>Heavy Meals</bold></h2>
                            <p>Avoid consuming caffeine and heavy meals close to bedtime, as 
                            they can interfere with the ability to fall asleep</p>
                        </div>
                    </div>
                    <div className="col text-white" style={{ backgroundImage: `url(${placeholderImg})` }}>
                        <div>
                            <h2 className='text-gold'><bold>Creating</bold> a <bold>Comfortable Sleep Environment</bold></h2>
                            <p>Dim the lights, ensure a comfortable room temperature, 
                            and make sure your bed and pillows are comfortable.</p>
                        </div>
                    </div>
                </div>
                <div className="row four-row-content height-50vh">
                    <div className="col text-white" style={{ backgroundImage: `url(${placeholderImg})` }}>
                        <div>
                            <h2 className='text-gold'><bold>Setting</bold> a <bold>Consistent Sleep Schedule</bold></h2>
                            <p>Going to bed and waking up at the same time each day can help 
                            regulate your body's internal clock and improve sleep quality over time.</p>
                        </div>
                    </div>
                    <div className="col text-white" style={{ backgroundImage: `url(${placeholderImg})` }}>
                        <div>
                            <h2 className="mont-bold text-gold">Avoiding Intense Exercise</h2>
                            <p>While regular exercise is generally beneficial for sleep, engaging in 
                            vigorous workouts close to bedtime can stimulate the body and make it harder to fall asleep.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="header-container text-white" style={{ backgroundImage: `url(${placeholderImg})`}}>
                <div className='header-one-content text-center'>
                    <p className="w-50 mx-auto">It's important to personalize your pre-sleep routine based on what works best for you. Consistency is 
                    key, as these activities help signal to your body that it's time to wind down and prepare for restful sleep.</p>
                </div>
            </div>
        </>
    )
}

export default SLPreSleepContent