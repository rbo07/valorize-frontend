//Import React
import React from 'react';

import { baseURL } from '../services/api';

//Pagination
import ReactPaginate from 'react-paginate';

//Spin
import { Spin } from 'antd';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

//Import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

//import Axios
import axios from 'axios';

const currentUser = localStorage.getItem('USER_KEY');
const currentRoleUser = localStorage.getItem('ROLE_KEY');

class Ranking extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataRanking: [],
            dataPosition: '',
            userName: '',
            lastPeriod: '',
            message: '',
            offset: 0,
            perPage: 7,
            currentPage: 0,
            loading: false
        };
        this.handlePageClick = this
            .handlePageClick
            .bind(this);
    }

    componentDidMount() {
        this.listRanking();
    }

    checkId(id) {
        if (id == null || id == undefined) {
            return 0
        } else {
            return id
        }
    }

    checkUrl(leaderId, currentUser) {
        if(leaderId == 0){
            return currentUser
        } else {
            return leaderId
        }
    }

    listRanking() {
        this.setState({ loading: true });

        const leaderId = this.checkId(this.props.leaderId)
        const idPeriod = this.checkId(this.props.id)

        const url = baseURL + '/ranking/' + this.checkUrl(leaderId, currentUser) + ':' + idPeriod;

        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');

        axios.get(url, {
            headers: {
                'Authorization': token
            }
        }).then(res => {
                if (res.data.success) {

                    if (currentRoleUser == 1) {
                        const data = res.data.ranking
                        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)

                        this.setState({
                            dataRanking: slice,
                            lastPeriod: res.data.lastPeriodName,
                            userName: res.data.userName,
                            pageCount: Math.ceil(data.length / this.state.perPage),
                            loading: false
                        })
                    } else {
                        const data = res.data.ranking
                        const position = res.data.position

                        this.setState({
                            dataRanking: data,
                            dataPosition: position,
                            lastPeriod: res.data.lastPeriodName,
                            userName: res.data.userName,
                            loading: false
                        })
                    }

                } else {
                    const message = res.data.message
                    this.setState({
                        dataRanking: null,
                        lastPeriod: res.data.lastPeriodName,
                        message: message,
                        loading: false
                    })
                }
            })
            .catch(error => {
                alert('Error server ' + error)
            })
    }

    loadRanking() {
        return this.state.dataRanking.map((data) => {
            return (
                <div>
                    <span><b>{data.position + ' - '}</b></span>
                    <span>{data.name}</span>
                    <span class='float-right'><strong>{data.score + '%'}</strong></span>
                </div>
            )
        })

    }

    getLabel() {
        if (currentRoleUser == 1) {
            return (
                <label>Ranking Geral <span>| {this.state.lastPeriod}</span></label>
            )
        } else if (currentRoleUser == 2) {
            return (
                <label>Ranking Meu Time <span>| {this.state.lastPeriod}</span></label>
            )
        }
    }

    loadFillData() {
        if (currentRoleUser == 1 || currentRoleUser == 2) {

            if (this.state.dataRanking == null) {
                return (
                    <div>
                        {this.getLabel()}
                        <div class="alert mini alert-warning alert-dismissible fade show" role="alert">
                            <strong>Ops! </strong>{this.state.message}
                        </div>
                    </div>
                )
            } else {
                return (
                    <div>
                        {this.getLabel()}
                        {this.loadRanking()}
                    </div>
                )

            }

        } else if (currentRoleUser == 3) {
            if (this.state.message !== '') {
                return (
                    <div class="text-left">
                        <label class="text-left">Minha Colocação no Ranking <span>| {this.state.lastPeriod}</span></label>
                        <div class="alert mini alert-warning alert-dismissible fade show" role="alert">
                            <FontAwesomeIcon icon={faExclamationTriangle} size='sm' /> {this.state.message}
                        </div>
                    </div>
                )
            } else {
                return (
                    <div>
                        <label>Minha Colocação no Ranking <span>| {this.state.lastPeriod}</span></label>
                        <span class="numberRanking">{this.state.dataPosition}</span>
                        {/* <div class="nameRanking">{this.state.userName}</div> */}
                    </div>
                )
            }
        }
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.listRanking()
        });

    };

    getPagination() {
        if (currentRoleUser == 1 && this.state.message == '') {
            return (
                <div class="text-center">
                    <div class="pagination-wrap">
                        <ReactPaginate
                            previousLabel={"<"}
                            nextLabel={">"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={this.state.pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"} />
                    </div>
                </div>
            )
        } else {
            return ''
        }
    }


    render() {
        return (
            <div>
                <Spin size="large" spinning={this.state.loading} />
                {this.loadFillData()}
                {this.getPagination()}
            </div>
        );
    }
}



export default Ranking;