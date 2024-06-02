import DestinationPortAnalysis from "../components/destinationPortAnalysis"
const GraphByDestPort = ()=>{
    return (
        <div >
            <h2 className="text-3xl font-bold mb-4 text-white text-center">
              Destination Port
            </h2>
            <div className="p-4 flex flex-wrap justify-evenly">
              <div className="w-full md:w-1/3 content-center justify-center">
                <p className="font-mono font-semibold text-xl text-white text-center ">
                  The Bar chart beside displays the most frequently targeted
                  destination ports based on the number of alerts. Each bar
                  represents a unique destination port, and the length of the
                  bar indicates the count of alerts associated with that port.
                </p>
              </div>
              <div className="w-full md:w-1/3">
                <DestinationPortAnalysis />
              </div>
            </div>
          </div>
    )
}
export default GraphByDestPort;