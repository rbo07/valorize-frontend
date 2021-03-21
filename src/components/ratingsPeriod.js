import React from 'react';

//import Axios
import axios from 'axios';
import { baseURL } from '../services/api';

// Donut Chart React
import { Donut } from 'react-donut-component'

//Import Jquery resources
import $ from "jquery"

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

//sweetalert2
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

const currentUser = localStorage.getItem('USER_KEY');


class RatingsPeriod extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listRatingsPeriod: [],
            lastPeriod: "",
            message: '',
            size: null,
        }
    }

    componentDidMount() {
        let self = this;
        this.loadingRatingsPeriod();
    }

    checkId(id) {
        if (id == null || id == undefined) {
            return 0
        } else {
            return id
        }
    }

    checkUrl(userId, currentUser) {
        if (userId == 0) {
            return currentUser
        } else {
            return userId
        }
    }

    loadingRatingsPeriod() {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');

        const userId = this.checkId(this.props.userId)

        const url = baseURL + "/ratings/" + this.checkUrl(userId, currentUser);

        axios.get(url, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const data = res.data.ratingsPeriod

                    this.setState({
                        listRatingsPeriod: data,
                        lastPeriod: res.data.lastPeriodName,
                        size: data.length
                    })

                } else {
                    this.setState({
                        message: res.data.message,
                        listRatingsPeriod: null,
                        lastPeriod: res.data.lastPeriodName
                    })
                }
            })
            .catch(error => {
                alert('Error server ' + error)
            })
    }
    getWidth(size) {
        let width = $(window).outerWidth()

        if(width <= 400){
            return '100%'
        } else if(width <= 960){
            return '50%'
        } else {
            if (size == 1) {
                return '100%'
            } else if (size == 2) {
                return '50%'
            } else if (size == 3) {
                return '33%'
            } else if (size >= 4) {
                return '25%'
            }
        } 
    }

    getEvaluation() {
        if (this.state.listRatingsPeriod == null) {
            return (
                <div class="alert mini alert-warning alert-dismissible fade show" role="alert">
                    <strong>Ops!</strong> {this.state.message}</div>
            )

        } else {
            return this.state.listRatingsPeriod.map((data) => {
                return (
                    <div class="criterion" style={{ width: this.getWidth(this.state.size) }}>
                        <div class={'chart x-' + data.rating_score}>
                            <span class="score">{data.rating_score}<small>%</small></span>
                        </div>
                        {data.criterions.criterion_name}
                    </div>
                )
            })
        }

    }

    loadFillData() {
        return (
            <div class="my-evaluation">
                <label>Meu Desempenho <span>| {this.state.lastPeriod}</span></label>
                <div>
                    {this.getEvaluation()}
                </div>
            </div>
        )
    }

    render() {
        return this.loadFillData()
    }

}

export default RatingsPeriod;