import AlertsOverTime from "../components/alertOverTime"
const GraphByTime = ()=>{
    return(
        <div className="p-2">
            <h2 className="text-3xl font-bold mb-4 text-white text-center">
              Alerts Over Time
            </h2>
            <div className="p-4 flex flex-wrap justify-evenly">
              <div className="w-full md:w-2/3">
                <AlertsOverTime />
              </div>
              <div className="w-full md:w-1/3 content-center justify-center">
                <p className="font-mono font-semibold text-xl text-white text-center p-4">
                  The graph beside displays the number of alerts occurring over
                  time. The x-axis represents the time intervals (15 mins), and
                  the y-axis shows the count of alerts. By observing the trend
                  line, you can identify patterns and spikes in alert activity,
                  helping you understand the overall security posture of your
                  system.
                </p>
              </div>
            </div>
          </div>
    )
}
export default GraphByTime;