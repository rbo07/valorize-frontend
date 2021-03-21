//Import React
import React from 'react';
import { Link } from "react-router-dom";

//Import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faPen } from '@fortawesome/free-solid-svg-icons'

//import Axios
import axios from 'axios';
import { baseURL } from '../../services/api';

// Select
import { Select } from 'antd';
import 'antd/dist/antd.css';

// Badge
import { Badge } from 'antd';

// Button
import { Button } from 'antd';

//Spin
import { Spin } from 'antd';

//Pagination
import ReactPaginate from 'react-paginate';

//sweetalert2
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

//Import Jquery resources
import $ from "jquery"
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';

//Print
import Print from "../../services/print";

//Template
import Header from "../../components/header";
import Menu from "../../components/menu";

const currentRoleUser = localStorage.getItem('ROLE_KEY');
const currentUser = localStorage.getItem('USER_KEY');


class ListRatings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ListRatings: [],
            ListRatingsTeam: [],
            dataPeriodLookUp: [],
            dataCriterionsLookUp: [],
            message: '',
            messagePeriodLookUp: '',
            messageCriterionLookUp: '',
            offset: 0,
            perPage: 7,
            currentPage: 0,
            temp_period: null,
            temp_criterion: null,
            loading: false
        };
        this.handlePageClick = this
            .handlePageClick
            .bind(this);
    }

    componentDidMount() {
        this.loadRatings();
        this.periodsLookUp();
        this.criterionsLookUp();
    }

    loadRatings() {
        this.setState({ loading: true });

        let periodId = this.state.temp_period
        let criterionId = this.state.temp_criterion

        if (periodId == undefined || periodId == 'Filtrar por Período') {
            periodId = null
        }

        if (criterionId == undefined || criterionId == 'Filtrar por Critério') {
            criterionId = null
        }

        const data = {
            period_id: periodId,
            criterion_id: criterionId
        }
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const url = baseURL + '/listRatings/' + currentUser

        axios.post(url, data, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success == 1) {
                    const dataRatings = res.data.ratings
                    const slice = dataRatings.slice(this.state.offset, this.state.offset + this.state.perPage)

                    this.setState({
                        ListRatings: slice,
                        pageCount: Math.ceil(dataRatings.length / this.state.perPage),
                        message: '',
                        loading: false
                    })
                } else if (res.data.success == 2) {
                    const dataRatingsTeam = res.data.ratingsTeam
                    const slice = dataRatingsTeam.slice(this.state.offset, this.state.offset + this.state.perPage)

                    this.setState({
                        ListRatingsTeam: slice,
                        pageCount: Math.ceil(dataRatingsTeam.length / this.state.perPage),
                        message: '',
                        loading: false
                    })

                } else {
                    this.setState({
                        message: res.data.message,
                        ListRatings: [],
                        ListRatingsTeam: [],
                        loading: false
                    })
                }
            })
            .catch(error => {
                this.setState({ loading: false });
                alert('Error server ' + error)
            })
    }

    turnDataUser(obj) {
        if (obj !== null) return obj.user_name
    }

    // turnDataAward(obj) {
    //     if (obj !== null) return obj.award_name
    // }

    turnDataPeriod(obj) {
        if (obj !== null) return obj.period_name
    }

    turnDataCriterion(obj) {
        if (obj !== null) return obj.criterion_name
    }

    turnDataTiebreak(obj) {
        if (obj !== null) return (
            <Badge className="site-badge-count-109" count={100} overflowCount={obj.tiebreaker_weight} style={{ backgroundColor: '#52c41a' }} />
        )
    }

    truncate(str, n) {
        return (str.length > n) ? str.substr(0, n - 1) + ' ...' : str;
    };

    closeModal() {
        $('#cancelButton').click();
    }

    renderEditButton(id) {
        if (currentRoleUser == 1) {
            return (
                <Link title="Editar Avaliação" class="btn icon edit" to={'/admin/ratings/edit/' + id} >
                    <FontAwesomeIcon icon={faPen} size='sm' />
                </Link>
            )
        } else if (currentRoleUser == 2) {
            return (
                <Link title="Editar Avaliação" class="btn icon edit" to={"/ratings/edit/" + id} >
                    <FontAwesomeIcon icon={faPen} size='sm' />
                </Link>
            )
        }
    }

    periodsLookUp() {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const urlLookUp = baseURL + '/periodsLookUp';
        axios.get(urlLookUp, {
            headers: {
                'Authorization': token
            }
        }).then(res => {
            if (res.data.success) {
                const data = res.data.periods
                this.setState({
                    dataPeriodLookUp: data
                })

            } else {
                this.setState({
                    messagePeriodLookUp: res.data.message
                })
            }
        })
            .catch(error => {
                alert('Error server ' + error)
            })
    }

    loadFillDataPeriodLookUp() {
        const { Option } = Select;
        return this.state.dataPeriodLookUp.map((data) => {
            return (
                <Option value={data.id} >{data.period_name}</Option>
            )
        })
    }

    criterionsLookUp() {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const urlCriterionsLookUp = baseURL + "/criterionsLookUp"

        axios.get(urlCriterionsLookUp, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const data = res.data.criterions
                    this.setState({
                        dataCriterionsLookUp: data
                    })

                } else {
                    this.setState({
                        messageCriterionLookUp: res.data.message
                    })
                }
            })
            .catch(error => {
                alert('Error server ' + error)
            })
    }

    handleChangePeriod(value) {
        this.setState({ temp_period: value }, () => {
            this.loadRatings()
        });
    }

    handleChangeCriterion(value) {
        this.setState({ temp_criterion: value }, () => {
            this.loadRatings()
        });
    }

    loadFillDataCriterionLookUp() {
        const { Option } = Select;
        return this.state.dataCriterionsLookUp.map((data) => {
            return (
                <Option value={data.id} >{data.criterion_name}</Option>
            )
        })
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadRatings()
        });

    };

    getMessagePeriod() {
        if (this.state.messagePeriodLookUp !== '') {
            return (
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Ops!</strong> {this.state.messagePeriodLookUp}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )
        }
    }
    getMessageCriterion() {
        if (this.state.messageCriterionLookUp !== '') {
            return (
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Ops!</strong> {this.state.messageCriterionLookUp}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )
        }
    }
    render() {
        const { Option } = Select;
        return (
            <div>
                <Menu />
                <div id="Avaliações" class='Content'>
                    <Header />
                    <div class="row">
                        <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                            <h1>Gerenciar Avaliações</h1>
                        </div>
                        <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 actions text-right">
                            <Select onChange={(value) => this.handleChangePeriod(value)} size={'40px'} defaultValue="Selecione o Período" style={{ width: 170 }} >
                                <Option value={null} >Selecione o Período</Option>
                                {this.loadFillDataPeriodLookUp()}
                            </Select>

                            <Select onChange={(value) => this.handleChangeCriterion(value)} size={'40px'} defaultValue="Selecione o Critério" style={{ width: 170 }} >
                                <Option value={null} >Selecione o Critério</Option>
                                {this.loadFillDataCriterionLookUp()}
                            </Select>
                            <button class="btn icon pdf" onClick={() => Print.printDocument("Avaliações")} data-toggle="tooltip" title="Exportar PDF">
                                <FontAwesomeIcon icon={faDownload} size='sm' />
                            </button>
                        </div>

                    </div>
                    {this.getMessagePeriod()}
                    {this.getMessageCriterion()}

                    <div class="text-center">
                        <Spin size="large" spinning={this.state.loading} />
                    </div>
                    {this.loadData()}
                </div>
                <div class="scrim">
                    <div>Aguarde...</div>
                    <Spin size="large" spinning={true} />
                </div>
            </div>
        )
    }

    loadMessage() {
        return (
            <div class="card">
                {this.state.message}
                <div>Altere os filtros para refinar sua consulta!</div>
            </div>
        )
    }

    loadFillData() {

        if (this.state.ListRatings.length > 0) {

            return this.state.ListRatings.map((data) => {
                return (
                    <tr>
                        <td class="text-center"><span class="label-mobile">ID</span>{data.id}</td>
                        <td><span class="label-mobile">Avaliado</span>{this.turnDataUser(data.user)}</td>
                        <td><span class="label-mobile">Avaliador</span>{this.turnDataUser(data.user_evaluator)}</td>
                        <td><span class="label-mobile">Período</span>{this.turnDataPeriod(data.periods)}</td>
                        <td><span class="label-mobile">Critério</span>{this.turnDataCriterion(data.criterions)}</td>
                        <td class="text-center"><span class="label-mobile">Nota</span>{data.rating_score}%</td>
                        <td class="text-center"><span class="label-mobile">Desempate</span>{this.turnDataTiebreak(data.tiebreakers)}</td>
                        <td class="text-center"><span class="label-mobile">Nota Final</span>{data.final_score}%</td>
                        {/* <td>{this.turnDataAward(data.awards)}</td> */}
                        <td>
                            <span class="label-mobile">Ações</span>
                            {this.renderEditButton(data.id)}
                            <Button title="Excluir Avaliação" danger onClick={() => this.onDelete(data.id)}>
                                <FontAwesomeIcon icon={faTrash} size='sm' />
                            </Button>
                        </td>
                    </tr>
                )
            })

        } else if (this.state.ListRatingsTeam.length > 0) {
            return this.state.ListRatingsTeam.map((data) => {
                return (
                    <tr>
                        <td class="text-center"><span class="label-mobile">ID</span>{data.id}</td>
                        <td><span class="label-mobile">Avaliado</span> {this.turnDataUser(data.user)}</td>
                        <td><span class="label-mobile">Avaliador</span>{this.turnDataUser(data.user_evaluator)}</td>
                        <td><span class="label-mobile">Período</span>{this.turnDataPeriod(data.periods)}</td>
                        <td><span class="label-mobile">Critério</span>{this.turnDataCriterion(data.criterions)}</td>
                        <td class="text-center"><span class="label-mobile">Nota</span>{data.rating_score}</td>
                        <td class="text-center"><span class="label-mobile">Desempate</span>{this.turnDataTiebreak(data.tiebreakers)}</td>
                        <td class="text-center"><span class="label-mobile">Nota Final</span>{data.final_score}</td>
                        {/* <td>{this.turnDataAward(data.awards)}</td> */}
                        <td>
                            {this.renderEditButton(data.id)}
                            <Button title="Excluir Avaliação" danger onClick={() => this.onDelete(data.id)}>
                                <FontAwesomeIcon icon={faTrash} size='sm' />
                            </Button>
                        </td>
                    </tr>
                )
            })
        }
    }

    loadData() {

        if (this.state.message !== '') {

            return this.loadMessage()

        } else {

            return (
                <div id="table-ratings">
                    <table class="table table-striped">
                        <thead class="thead-dark">
                            <tr>
                                <th width="2%" class="text-center" scope="col">ID</th>
                                <th width="13%" scope="col">Avaliado</th>
                                <th width="13%" scope="col">Avaliador</th>
                                <th scope="col">Período</th>
                                <th scope="col">Critério</th>
                                <th scope="col" class="text-center">Nota</th>
                                <th scope="col" class="text-center">Extra</th>
                                <th scope="col" class="text-center">Final</th>
                                {/* <th scope="col">Prêmio</th> */}
                                <th width="15%" colspan="2"><span class="label-acoes">Ações</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.loadFillData()}
                        </tbody>
                    </table>
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
                </div>
            )
        }
    }

    onDelete(id) {
        Swal.fire({
            title: 'Você tem certeza?',
            text: 'Deseja remover este Avaliação',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Não, cancelar!'
        }).then((result) => {
            if (result.value) {
                this.sendDelete(id)
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Ação Cancelada',
                    'Avaliação mantida!',
                    'warning'
                )
            }
        })
    }

    sendDelete(ratingId) {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const url = baseURL + "/rating/delete/" + ratingId;

        const datapost = 0

        axios.put(url, datapost, {
            headers: {
                'Authorization': token
            }
        }).then(res => {

            if (res.data.success === true) {
                Swal.fire(
                    'Deletado!',
                    res.data.message,
                    'success'
                ).then((result) => {
                    this.loadRatings()
                })
            }
        }).catch(error => {
            alert("Error 325 " + error)
        })
    }
}

export default ListRatings;