//Import React
import React from 'react';
import { Link } from "react-router-dom";
import ActiveMenu from "../../services/setMenu";

//Import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

//import Axios
import axios from 'axios';
import { baseURL } from '../../services/api';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

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

//Template
import Header from "../../components/header";
import Menu from "../../components/menu";

//Pagination
import ReactPaginate from 'react-paginate';

//Print
import Print from "../../services/print";



const currentRoleUser = localStorage.getItem('ROLE_KEY');

class ListCriterion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listCriterions: [],
            dataAwardsLookUp: [],
            dataPeriodLookUp: [],
            messagePeriodLookUp: '',
            messageAwardLookUp: '',
            message: '',
            campCriterionName: "",
            campCriterionDescription: "",
            valueSelectedPeriodsLookUp: null,
            valueSelectedAwardsLookUp: null,
            offset: 0,
            perPage: 7,
            currentPage: 0,
            loading: false
        }
    }

    componentDidMount() {
        this.loadCriterions();
        this.awardsLookUp();
        this.periodsLookUp();
        ActiveMenu.setActive('.lk-criterion');
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadCriterions()
        });

    };

    loadCriterions() {
        this.setState({ loading: true });
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const url = baseURL + '/criterions';

        axios.get(url, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const dataCriterions = res.data.criterions
                    const slice = dataCriterions.slice(this.state.offset, this.state.offset + this.state.perPage)

                    this.setState({
                        listCriterions: slice,
                        pageCount: Math.ceil(dataCriterions.length / this.state.perPage),
                        loading: false
                    })
                } else {
                    this.setState({
                        listCriterions: null,
                        message: res.data.message,
                        loading: false
                    });
                }
            })
            .catch(error => {
                alert('Error server ' + error)
            })
    }

    awardsLookUp() {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const urlAwardsLookUp = baseURL + "/awardsLookUp"

        axios.get(urlAwardsLookUp, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const data = res.data.awards
                    this.setState({
                        dataAwardsLookUp: data,
                    })

                } else {
                    this.setState({
                        messageAwardLookUp: res.data.message
                    })
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

    turnDataAward(obj) {
        if (obj !== null) return this.truncate(obj.award_name, 20)
    }

    turnDataPeriod(obj) {
        if (obj !== null) return this.truncate(obj.period_name, 20)
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
                <Link title="Editar Crit??rio" class="btn icon edit" to={"/admin/criterions/edit/" + id} >
                    <FontAwesomeIcon icon={faPen} size='sm' />
                </Link>
            )
        } else if (currentRoleUser == 2) {
            return (
                <Link title="Editar Crit??rio" class="btn icon edit" to={"/criterions/edit/" + id} >
                    <FontAwesomeIcon icon={faPen} size='sm' />
                </Link>
            )
        }
    }

    handleChangePeriod(value) {
        this.setState({ valueSelectedPeriodsLookUp: value });
    }

    handleChangeAward(value) {
        this.setState({ valueSelectedAwardsLookUp: value });
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

    getMessageAward() {
        if (this.state.messageAwardLookUp !== '') {
            return (
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Ops!</strong> {this.state.messageAwardLookUp}
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
                <div id="Crit??rios" class={'Content ' + ActiveMenu.getClassMenu()}>
                    <Header />
                    <div class="row">
                        <div class="col-md-6">
                            <h1>Gerenciar Crit??rios</h1>
                        </div>

                        <div class="col-md-6 actions text-right">
                            <button class="btn icon add" data-toggle="modal" data-target="#exampleModal">
                                <FontAwesomeIcon icon={faPlus} size='sm' /> Adicionar Crit??rios
                        </button>

                            <button class="btn icon pdf" onClick={() => Print.printDocument("Crit??rios")} data-toggle="tooltip" title="Exportar PDF">
                                <FontAwesomeIcon icon={faDownload} size='sm' />
                            </button>
                        </div>
                    </div>
                    <div class="text-center">
                        <Spin size="large" spinning={this.state.loading} />
                    </div>
                    <div id="table-criterions">
                        {this.getMessagePeriod()}
                        {this.getMessageAward()}
                        {this.loadData()}
                    </div>


                    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Adicionar Crit??rio de Avalia????o</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">

                                    <div class="form-row">

                                        
                                            <div class="form-group col-md-12">
                                                <label for="inputCriterionName">Nome do Crit??rio <span class="label-required">*</span></label>
                                                <input maxlength="100" type="text" class="form-control" id="inputCriterionName" placeholder="Nome do Crit??rio" value={this.state.campCriterionName} onChange={(value) => this.setState({ campCriterionName: value.target.value })} />
                                            </div>


                                            <div class="form-group col-md-12">
                                                <label for="inputCriterionDescription">Descri????o do Crit??rio <span class="label-required">*</span></label>
                                                <textarea maxlength="255" type="text" class="inputDate form-control" id="inputCriterionDescription" placeholder="Descri????o do Crit??rio" value={this.state.campCriterionDescription} onChange={(value) => this.setState({ campCriterionDescription: value.target.value })} />
                                            </div>

                                            <div class="form-group col-md-12">
                                                <label for="selectPeriodLookUp">Per??odo Associado</label>
                                                <Select onChange={(value) => this.handleChangePeriod(value)} size={'40px'} value={this.state.valueSelectedPeriodsLookUp} placeholder="Selecione o Per??odo" >
                                                    <Option value={null} >Selecione o Per??odo</Option>
                                                    {this.state.dataPeriodLookUp.map(data => <Option value={data.id} key={data.id}>{data.period_name}</Option>)}
                                                </Select>
                                            </div>

                                            {/* <div class="form-group col-md-12">
                                                <label for="selectAwardLookUp">Pr??mio Associado</label>
                                                <Select onChange={(value) => this.handleChangeAward(value)} size={'40px'} value={this.state.valueSelectedAwardsLookUp} placeholder="Selecione o Pr??mio" >
                                                    {this.state.dataAwardsLookUp.map(data => <Option value={data.id} key={data.id}>{data.award_name}</Option>)}
                                                </Select>
                                            </div> */}
                                    </div>
                                    
                                    <div class="message-required-form"><span class="label-required">*</span> Campos Obrigat??rios</div>
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
        if (this.state.listCriterions == null) {
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
                                <th scope="col">Nome do Crit??rio</th>
                                <th scope="col">Pr??mio Associado</th>
                                <th scope="col">Per??odo Associado</th>
                                <th width="30%" scope="col">Descri????o do Crit??rio</th>
                                <th colspan="2" class="center"><span class="label-acoes">A????es</span></th>
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

        return this.state.listCriterions.map((data) => {
            return (
                <tr>
                    <td class="text-center"><span class="label-mobile">ID</span>{data.id}</td>
                    <td><span class="label-mobile">Nome do Crit??rio</span>{this.truncate(data.criterion_name, 30)}</td>
                    <td><span class="label-mobile">Pr??mio Associado</span>{this.turnDataAward(data.awards)}</td>
                    <td><span class="label-mobile">Per??odo Associado</span>{this.turnDataPeriod(data.periods)}</td>
                    <td><span class="label-mobile">Descri????o do Crit??rio</span>{this.truncate(data.criterion_description, 35)}</td>
                    <td>
                        <span class="label-mobile">A????es</span>
                        {this.renderEditButton(data.id)}
                        <Button title="Excluir Crit??rio" danger onClick={() => this.onDelete(data.id)}>
                            <FontAwesomeIcon icon={faTrash} size='sm' />
                        </Button>
                    </td>
                </tr>
            )
        })
    }

    onDelete(id) {
        Swal.fire({
            title: 'Voc?? tem certeza?',
            text: 'Deseja remover este Crit??rio?',
            icon: "warning",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'N??o, cancelar!'
        }).then((result) => {
            if (result.value) {
                this.sendDelete(id)
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'A????o Cancelada',
                    'Crit??rio mantido!',
                    'info'
                )
            }
        })
    }

    sendDelete(criterionId) {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const url = baseURL + "/criterions/delete/" + criterionId;

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
                    this.loadCriterions()
                })
            }
        }).catch(error => {
            alert("Error 325 " + error)
        })
    }

    //Enviar dados ao lado Servidor
    sendSave() {

        if (this.state.campCriterionName == "") {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Nome do Crit??rio",
                'warning'
            )
        }
        else if (this.state.campCriterionDescription == "") {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Descri????o do Crit??rio",
                'warning'
            )
        }
        // else if (this.state.valueSelectedPeriodsLookUp == null) {
        //     Swal.fire(
        //         'Alerta!',
        //         "Preencha o campo Per??odo Associado",
        //         'warning'
        //     )
        // }
        // else if (this.state.valueSelectedAwardsLookUp == null) {
        //     Swal.fire(
        //         'Alerta!',
        //         "Preencha o campo Pr??mio Associado",
        //         'warning'
        //     )
        // }
        else {
            this.setState({ loading: true });
            const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
            const url = baseURL + "/criterions/create";

            const datapost = {
                criterion_name: this.state.campCriterionName,
                criterion_description: this.state.campCriterionDescription,
                award_id: this.state.valueSelectedAwardsLookUp,
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
                            'Crit??rio Cadastrado!',
                            res.data.message,
                            'success'
                        ).then((result) => {
                            this.loadCriterions()
                            this.closeModal()
                        })

                    }
                    else {
                        this.setState({ loading: false });

                        Swal.fire(
                            'Alerta!',
                            res.data.message,
                            'warning'
                        )

                    }
                }).catch(error => {
                    alert("Error 34 " + error)
                })
        }

    }

}

export default ListCriterion;