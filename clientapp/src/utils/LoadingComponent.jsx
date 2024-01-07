import { DotSpinner } from '@uiball/loaders'

const LoadingComponent = () => {
    return (
        <div className="loading-content mx-auto height-50vh" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <DotSpinner 
                size={100}
                speed={0.9} 
                color="#D39E6C" 
            />
            <p className='text-gold' style={{ marginTop: "10px", color: "#fff", textAlign: "center" }}>Loading...</p>
        </div> 
    )
}

export default LoadingComponent;