import esp32Data from "./esp32-data";
import esp32Email from "./esp32-email";

//

const init = () => {
    esp32Data.init()
    esp32Email.init()
}

//

export default { init }
