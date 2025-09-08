import esp32CamData from "./esp32-cam-data";
import esp32CamEmail from "./esp32-cam-email";
import esp32Data from "./esp32-data";
import esp32Email from "./esp32-email";

//

const init = () => {
    esp32Data.init()
    esp32Email.init()
    esp32CamData.init()
    esp32CamEmail.init()
}

//

export default { init }
