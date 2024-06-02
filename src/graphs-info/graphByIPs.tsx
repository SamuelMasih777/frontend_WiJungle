import TopSourceIPs from "../components/topSourceIP"
const GraphByIp =()=>{
    return(
        <div>
            <h2 className="text-3xl font-bold mb-4 text-white text-center">
              Top Source IPs
            </h2>
            <div className=" p-4 flex flex-wrap justify-evenly">
              <div className="w-full md:w-1/3 content-center justify-center">
                <p className="font-mono font-semibold text-xl text-white text-center ">
                  The chart above highlights the top source IP addresses that
                  are generating the most alerts. Each bar represents a unique
                  source IP address, and the length of the bar indicates the
                  number of alerts associated with that IP address. By
                  identifying the most active or suspicious source IPs, you can
                  prioritize investigation and take appropriate actions.
                </p>
              </div>
              <div className="w-full md:w-1/3">
                <TopSourceIPs />
              </div>
            </div>
          </div>
    )
}
export default GraphByIp;