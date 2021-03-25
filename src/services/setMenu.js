//Import Jquery resources
import $ from "jquery"


class ActiveMenu {

    setActive(id) {
        $('.menu-item').removeClass('active')
        $( id ).addClass('active')
    }
}

export default new ActiveMenu();