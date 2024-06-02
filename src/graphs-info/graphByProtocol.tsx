import ProtocolDistribution from "../components/protocolDistribution"
const GraphByProtocol = ()=>{
    return(
        <div>
            <h2 className="text-3xl font-bold mb-4 text-white text-center">
              Protocol Distribution
            </h2>
            <div className="p-4 flex flex-wrap justify-evenly">
              <div className="w-full md:w-1/3">
                <ProtocolDistribution />
              </div>
              <div className="w-full md:w-1/3 content-center justify-center">
                <p className="font-mono font-semibold text-xl text-white text-center ">
                  The bar chart beside depicts the distribution of alerts based
                  on the protocol (TCP, UDP). Each slice represents a different
                  protocol, and the size of the bar indicates the proportion of
                  alerts associated with that protocol. This information helps
                  you understand which protocols are more commonly involved in
                  the alerts.
                </p>
              </div>
            </div>
          </div>
    )
}
export default GraphByProtocol;