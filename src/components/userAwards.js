import React from 'react';

//import Axios
import axios from 'axios';
import { baseURL } from '../services/api';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'
import { faMedal } from '@fortawesome/free-solid-svg-icons'
import { faAward } from '@fortawesome/free-solid-svg-icons'
import { faCrown } from '@fortawesome/free-solid-svg-icons'
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-solid-svg-icons'

//Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

//sweetalert2
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

const currentUser = localStorage.getItem('USER_KEY');


class UserAwards extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listUserAwards: null,
            message: ''
        }
    }

    componentDidMount() {
        this.loadingUserAwards();
    }

    checkNull(array) {
        if (array == '') {
            return null
        } else {
            return array
        }
    }

    checkId(id) {
        if (id == null || id == undefined) {
            return 0
        } else {
            return id
        }
    }

    checkUrl(userId, currentUser) {
        if(userId == 0){
            return currentUser
        } else {
            return userId
        }
    }

    loadingUserAwards() {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');

        const userId = this.checkId(this.props.userId)

        const url = baseURL + "/usersAwards/" + this.checkUrl(userId, currentUser);

        axios.get(url, {
            headers: {
                'Authorization': token
            }
        }).then(res => {
            if (res.data.success) {
                const data = this.checkNull(res.data.awards)
                this.setState({ listUserAwards: data })

            } else {
                this.setState({
                    listUserAwards: null,
                    message: res.data.message
                })
            }
        })
            .catch(error => {
                alert('Error server ' + error)
            })
    }

    randomClassTrophy() {
        let classes = Array('faTrophy', 'faMedal', 'faAward')
        console.log(classes[Math.floor(Math.random() * classes.length)])
        return classes[Math.floor(Math.random() * classes.length)]
    }

    getAwardIcon() {
        let icons = ['faAward', 'faTrophy', 'faMedal', 'faCrown', 'faShieldAlt', 'faStar']
        let icon = icons[Math.floor(Math.random() * icons.length)];

        if (icon == 'faAward') {
            return (<FontAwesomeIcon icon={faAward} size='3x' />)
        } else if (icon == 'faTrophy') {
            return (<FontAwesomeIcon icon={faTrophy} size='3x' />)
        } else if (icon == 'faMedal') {
            return (<FontAwesomeIcon icon={faMedal} size='3x' />)
        } else if (icon == 'faCrown') {
            return (<FontAwesomeIcon icon={faCrown} size='3x' />)
        } else if (icon == 'faShieldAlt') {
            return (<FontAwesomeIcon icon={faShieldAlt} size='3x' />)
        } else if (icon == 'faStar') {
            return (<FontAwesomeIcon icon={faStar} size='3x' />)
        }
    }

    loadFillData() {
        if (this.state.listUserAwards == null) {
            return (
                <div class="alert mini alert-warning alert-dismissible fade show" role="alert">
                    <strong>Ops!</strong> {this.state.message}
                </div>
            )
        } else {
            return this.state.listUserAwards.map((data) => {
                return (
                    <div class="award">
                        <span className="iconAward">
                            {this.getAwardIcon()}
                        </span>
                        <span className="nameAward">
                            {data.award_name}
                        </span>
                    </div>
                )
            })
        }
    }

    render() {
        return (
            <div>
                {this.loadFillData()}
            </div>
        );
    }

}

export default UserAwards;