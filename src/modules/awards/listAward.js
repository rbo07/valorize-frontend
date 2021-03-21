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
import { faPlus } from '@fortawesome/free-solid-svg-icons'

//import Axios
import axios from 'axios';
import { baseURL } from '../../services/api';

// Button
import { Button } from 'antd';

//Spin
import { Spin } from 'antd';

// Select
import { Select } from 'antd';
import 'antd/dist/antd.css';

//sweetalert2
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

//Import Jquery resources
import $ from "jquery"
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';

//Pagination
import ReactPaginate from 'react-paginate';

//Print
import Print from "../../services/print";

//Template
import Header from "../../components/header";
import Menu from "../../components/menu";

const currentRoleUser = localStorage.getItem('ROLE_KEY');


class ListAward extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            listAwards: [],
            dataCriterionsLookUp: [],
            dataPeriodLookUp: [],
            messagePeriodLookUp: '',
            messageCriterionLookUp: '',
            campAwardName: "",
            campAwardDescription: "",
            valueSelectedPeriodsLookUp: null,
            valueSelectedCriterionsLookUp: null,
            message: '',
            offset: 0,
            perPage: 7,
            currentPage: 0,
            loading: false
        }
    }

    componentDidMount() {
        this.loadAwards();
        this.criterionsLookUp();
        this.periodsLookUp();
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadAwards()
        });

    };

    loadAwards() {
        this.setState({ loading: true });
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const url = baseURL + '/awards';
        axios.get(url, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {

                    const dataAwards = res.data.awards
                    const slice = dataAwards.slice(this.state.offset, this.state.offset + this.state.perPage)

                    this.setState({
                        listAwards: slice,
                        pageCount: Math.ceil(dataAwards.length / this.state.perPage),
                        loading: false
                    })
                } else {
                    this.setState({
                        listAwards: null,
                        message: res.data.message,
                        loading: false
                    });
                }
            })
            .catch(error => {
                alert('Error server ' + error)
            })
    }

    periodsLookUp() {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const urlLookUp = baseURL + '/periodsLookUp';
        axios.get(urlLookUp, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
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

    turnDataCriterion(obj) {
        if (obj !== null) return obj.criterion_name
    }

    turnDataPeriod(obj) {
        if (obj !== null) return obj.period_name
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
                <Link title="Editar Prêmio" class="btn icon edit" to={"/admin/awards/edit/" + id} >
                    <FontAwesomeIcon icon={faPen} size='sm' />
                </Link>
            )
        } else if (currentRoleUser == 2) {
            return (
                <Link title="Editar Prêmio" class="btn icon edit" to={"/awards/edit/" + id} >
                    <FontAwesomeIcon icon={faPen} size='sm' />
                </Link>
            )
        }
    }

    handleChangePeriod(value) {
        this.setState({ valueSelectedPeriodsLookUp: value });
    }

    handleChangeCriterion(value) {
        this.setState({ valueSelectedCriterionsLookUp: value });
    }

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
        } else {
            return ''
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
        } else {
            return ''
        }
    }


    render() {
        const { Option } = Select;

        return (
            <div>
                <Menu />
                <div id="Prêmios" class='Content'>
                    <Header />
                    <div class="row">
                        <div class="col-md-6">
                            <h1>Gerenciar Prêmios</h1>
                        </div>

                        <div class="col-md-6 actions text-right">
                            <button class="btn icon add" data-toggle="modal" data-target="#exampleModal">
                                <FontAwesomeIcon icon={faPlus} size='sm' /> Adicionar Prêmios
                        </button>

                            <button class="btn icon pdf" onClick={() => Print.printDocument("Prêmios")} data-toggle="tooltip" title="Exportar PDF">
                                <FontAwesomeIcon icon={faDownload} size='sm' />
                            </button>
                        </div>
                    </div>
                    <div class="text-center">
                        <Spin size="large" spinning={this.state.loading} />
                    </div>
                    <div id="table-awards">
                        {this.getMessagePeriod()}
                        {this.getMessageCriterion()}
                        {this.loadData()}
                    </div>


                    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Adicionar Prêmio</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">

                                    <div class="form-row">

                                        <div class="form-row justify-content-center">
                                            <div class="form-group col-md-12">
                                                <label for="inputAwardName">Nome do Prêmio <span class="label-required">*</span></label>
                                                <input maxlength="100" type="text" class="form-control" id="inputAwardName" placeholder="Nome do Prêmio" value={this.state.campAwardName} onChange={(value) => this.setState({ campAwardName: value.target.value })} />
                                            </div>


                                            <div class="form-group col-md-12">
                                                <label for="inputAwardDescription">Descrição do Prêmio <span class="label-required">*</span></label>
                                                <textarea maxlength="255" type="text" class="inputDate form-control" id="inputAwardDescription" placeholder="Descrição do Prêmio" value={this.state.campAwardDescription} onChange={(value) => this.setState({ campAwardDescription: value.target.value })} />
                                            </div>

                                            <div class="form-group col-md-12">
                                                <label for="selectPeriodLookUp">Período Associado</label>
                                                <Select onChange={(value) => this.handleChangePeriod(value)} size={'40px'} value={this.state.valueSelectedPeriodsLookUp} placeholder="Selecione o Período" >
                                                    {this.state.dataPeriodLookUp.map(data => <Option value={data.id} key={data.id}>{data.period_name}</Option>)}
                                                </Select>
                                            </div>

                                            <div class="form-group col-md-12">
                                                <label for="selectCriterionLookUp">Critério Associado</label>
                                                <Select onChange={(value) => this.handleChangeCriterion(value)} size={'40px'} value={this.state.valueSelectedCriterionsLookUp} placeholder="Selecione o Critério" >
                                                    {this.state.dataCriterionsLookUp.map(data => <Option value={data.id} key={data.id}>{data.criterion_name}</Option>)}
                                                </Select>
                                            </div>
                                        </div>

                                    </div>
                                    <div class="message-required-form"><span class="label-required">*</span> Campos Obrigatórios</div>
                                    <div class="modal-footer">
                                        <button id="cancelButton" type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancelar</button>
                                        <button type="submit" class="btn btn-primary" onClick={() => this.sendSave()}>Salvar <Spin size="small" spinning={this.state.loading} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="scrim">
                    <div>Aguarde...</div>
                    <Spin size="large" spinning={true} />
                </div>
            </div>
        )
    }

    loadData() {
        if (this.state.listAwards == null) {
            return (
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Ops!</strong> {this.state.message}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )
        } else {
            return (
                <div>
                    <table class="table table-striped">
                        <thead class="thead-dark">
                            <tr>
                                <th scope="col" class="text-center">ID</th>
                                <th scope="col">Nome do Prêmio</th>
                                <th scope="col">Critério Associado</th>
                                <th scope="col">Período Associado</th>
                                <th width="30%" scope="col">Descrição do Prêmio</th>
                                <th colspan="2" class="center"><span class="label-acoes">Ações</span></th>
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
    loadFillData() {

        return this.state.listAwards.map((data) => {
            return (
                <tr>
                    <td class="text-center"><span class="label-mobile">ID</span>{data.id}</td>
                    <td><span class="label-mobile">Nome do Prêmio</span>{data.award_name}</td>
                    <td><span class="label-mobile">Critério Associado</span>{this.turnDataCriterion(data.criterions)}</td>
                    <td><span class="label-mobile">Período Associado</span>{this.turnDataPeriod(data.periods)}</td>
                    <td><span class="label-mobile">Descrição do Prêmio</span>{this.truncate(data.award_description, 40)}</td>
                    <td>
                        <span class="label-mobile">Ações</span>
                        {this.renderEditButton(data.id)}
                        <Button title="Excluir Prêmio" danger onClick={() => this.onDelete(data.id)}>
                            <FontAwesomeIcon icon={faTrash} size='sm' />
                        </Button>
                    </td>
                </tr>
            )
        })
    }

    onDelete(id) {
        Swal.fire({
            title: 'Você tem certeza?',
            text: 'Deseja remover este Prêmio?',
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
                    'Prêmio mantido!',
                    'warning'
                )
            }
        })
    }

    sendDelete(awardId) {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const url = baseURL + "/award/delete/" + awardId;

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
                    this.loadAwards()
                })
            }
        }).catch(error => {
            alert("Error 325 " + error)
        })
    }

    //Enviar dados ao lado Servidor
    sendSave() {

        if (this.state.campAwardName == "") {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Nome do Prêmio",
                'warning'
            )
        }
        else if (this.state.campAwardDescription == "") {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Descrição do Prêmio",
                'warning'
            )
        }
        // else if (this.state.valueSelectedPeriodsLookUp == null) {
        //     Swal.fire(
        //         'Alerta!',
        //         "Preencha o campo Período Associado",
        //         'warning'
        //     )
        // }
        // else if (this.state.valueSelectedCriterionsLookUp == null) {
        //     Swal.fire(
        //         'Alerta!',
        //         "Preencha o campo Critério Associado",
        //         'warning'
        //     )
        // }
        else {
            this.setState({ loading: true });
            const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
            const url = baseURL + "/awards/create";

            const datapost = {
                award_name: this.state.campAwardName,
                award_description: this.state.campAwardDescription,
                criterion_id: this.state.valueSelectedCriterionsLookUp,
                period_id: this.state.valueSelectedPeriodsLookUp,
            }

            axios.post(url, datapost, {
                headers: {
                    'Authorization': token
                }
            })
                .then(res => {
                    if (res.data.success === true) {
                        this.setState({ loading: false });

                        Swal.fire(
                            'Prêmio Cadastrado!',
                            res.data.message,
                            'success'
                        ).then((result) => {
                            this.loadAwards()
                            this.closeModal()
                        })

                    }
                    else {
                        this.setState({ loading: false });

                        Swal.fire(
                            'Erro!',
                            res.data.message,
                            'error'
                        )

                    }
                }).catch(error => {
                    alert("Error 34 " + error)
                })
        }

    }

}

export default ListAward;