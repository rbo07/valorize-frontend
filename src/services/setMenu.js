//Import Jquery resources
import $ from "jquery"


class ActiveMenu {

    setActive(id) {
        $('.menu-item').removeClass('active')
        $( id ).addClass('active')
    }

    getClassMenu() {
        if (localStorage.getItem('BEGINNER_KEY') == 1) {
            return "beginner"

        } else {
            return ''

        }
    }
}

export default new ActiveMenu();