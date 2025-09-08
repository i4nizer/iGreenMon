import action from "./action";
import condition from "./condition";
import input from "./input";
import reading from "./reading";
import sensor from "./sensor";
import threshold from "./threshold";

//

const init = () => {
    action.init()
    condition.init()
    input.init()
    reading.init()
    sensor.init()
    threshold.init()
}

//

export default { init }
