//Import React
import React from 'react';
import { Link } from "react-router-dom";

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
import { faSave } from '@fortawesome/free-solid-svg-icons'

// Button
import { Button } from 'antd';

// Switch
import { Switch } from 'antd';

//Spin
import { Spin } from 'antd';

//sweetalert2
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

//Import Jquery resources
import $ from "jquery"
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/themes/base/datepicker.css';
import datepickerFactory from 'jquery-datepicker';
import datepickerJAFactory from 'jquery-datepicker/i18n/jquery.ui.datepicker-pt-BR';

//Multiselect
import { Multiselect } from 'multiselect-react-dropdown';

//Template
import Header from "../../components/header";
import Menu from "../../components/menu";

//Pagination
import ReactPaginate from 'react-paginate';

//Print
import Print from "../../services/print";

const currentRoleUser = localStorage.getItem('ROLE_KEY');

// DatePicker
datepickerFactory($);
datepickerJAFactory($);


class ListPeriod extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listPeriods: [],
            dataAwardsLookUp: [],
            dataCriterionsLookUp: [],
            campPeriodName: "",
            campPeriodInitialDate: "",
            campPeriodFinalDate: "",
            campPeriodInitialDateSub: "",
            campPeriodFinalDateSub: "",
            messageAwardLookUp: '',
            messageCriterionLookUp: '',
            valueSelectedAwardsLookUp: [],
            valueSelectedCriterionsLookUp: [],
            setCurrentPeriod: false,
            currentPeriod: null,
            message: '',
            offset: 0,
            perPage: 7,
            currentPage: 0,
            loading: false
        }
    }

    componentDidMount() {
        const self = this;

        this.loadPeriods();
        this.awardsLookUp();
        this.criterionsLookUp();


        // Captura Data Inicial do DatePicker Calendar
        $("#inputPeriodInitialDate").change(function () {
            var dateComplete = $(this).datepicker("getDate");
            var date = $.datepicker.formatDate("yy-mm-dd", dateComplete);
            var date2 = $.datepicker.formatDate("dd-mm-yy", dateComplete);
            self.setState({
                campPeriodInitialDate: date + ' 00:00:00',
                campPeriodInitialDateSub: date2,
            })
        })

        // Captura Data Final do DatePicker Calendar
        $("#inputPeriodFinalDate").change(function () {
            var dateComplete = $(this).datepicker("getDate");
            var date = $.datepicker.formatDate("yy-mm-dd", dateComplete);
            var date2 = $.datepicker.formatDate("dd-mm-yy", dateComplete);
            self.setState({
                campPeriodFinalDate: date + ' 00:00:00',
                campPeriodFinalDateSub: date2,
            })
        })

        //Click Switcher
        $(document).on('click', '.ant-switch', function (e) {
            $('.ant-switch').removeClass('ant-switch-checked')
            $(this).addClass('.ant-switch-checked')
        });

        // Inicializa o DatePicker
        $(".inputDate").datepicker({ dateFormat: "yy-mm-dd" });

    }

    // Adiciona Prêmios no Array
    onSelectAwardLookUp(selectedList, selectedItem) {
        this.setState({
            valueSelectedAwardsLookUp: selectedList
        })
    }
    // Adiciona Prêmios no Array
    onRemoveAwardLookUp(selectedList, removedItem) {
        this.setState({
            valueSelectedAwardsLookUp: selectedList,
        })
    }

    // Adiciona Critérios no Array
    onSelectCriterionLookUp(selectedList, selectedItem) {
        this.setState({
            valueSelectedCriterionsLookUp: selectedList
        })
    }
    // Remove Critérios no Array
    onRemoveCriterionLookUp(selectedList, removedItem) {
        this.setState({
            valueSelectedCriterionsLookUp: selectedList,
        })
    }

    checkPeriodActivated(periods) {
        let id = null
        periods.map((data) => {
            if (data.period_activated == true) {
                id = data.id
            }
        })
        return id
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadPeriods()
        });

    };

    loadPeriods() {
        this.setState({ loading: true });
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const url = baseURL + '/periods';

        axios.get(url, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const dataPeriods = res.data.periods
                    const slice = dataPeriods.slice(this.state.offset, this.state.offset + this.state.perPage)

                    this.setState({
                        listPeriods: slice,
                        currentPeriod: this.checkPeriodActivated(dataPeriods),
                        setCurrentPeriod: true,
                        pageCount: Math.ceil(dataPeriods.length / this.state.perPage),
                        loading: false
                    })

                } else {
                    this.setState({
                        listPeriods: null,
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
                    });
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
                    });
                }
            })
            .catch(error => {
                alert('Error server ' + error)
            })
    }

    closeModal() {
        $('#cancelButton').click();
    }

    highlight() {
        let id = this.state.currentPeriod - 1;
        $('tbody').find('tr:eq(' + id + ')').addClass('highlight');
    }


    // Formata da Data vinda do Objeto
    formatDate(str) {
        let string = str.slice(0, str.lastIndexOf('T'))
        let fields = string.split('-');
        let finalString = fields[2] + '-' + fields[1] + '-' + fields[0]
        return finalString
    }

    renderEditButton(id) {
        if (currentRoleUser == 1) {
            return (
                <Link title="Editar Período" class="btn icon edit" to={"/admin/periods/edit/" + id} >
                    <FontAwesomeIcon icon={faPen} size='sm' />
                </Link>
            )
        } else if (currentRoleUser == 2) {
            return (
                <Link title="Editar Período" class="btn icon edit" to={"/periods/edit/" + id} >
                    <FontAwesomeIcon icon={faPen} size='sm' />
                </Link>
            )
        }
    }

    saveCurrentPeriod() {
        if (this.state.setCurrentPeriod == false) {
            Swal.fire(
                'Atenção!',
                'Selecione um período a ser ativado!',
                'warning'
            )
        } else {
            this.setState({ loading: true });
            const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
            const datapost = {
                period_id: this.state.currentPeriod
            }
            const url = baseURL + '/periods/activePeriod'

            axios.put(url, datapost, {
                headers: {
                    'Authorization': token
                }
            })
                .then(res => {
                    if (res.data.success === true) {
                        this.setState({ loading: false });
                        Swal.fire(
                            'Sucesso!',
                            res.data.message,
                            'success'
                        ).then((result) => {
                            this.highlight()
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
        return (
            <div>
                <Menu />
                <div id="Períodos-de-Avaliação" class='Content'>
                    <Header />
                    <div class="row">
                        <div class="col-md-6">
                            <h1>Gerenciar Períodos</h1>
                        </div>

                        <div class="col-md-6 actions text-right">
                            <button class="btn icon add" data-toggle="modal" data-target="#exampleModal">
                                <FontAwesomeIcon icon={faPlus} size='sm' /> Adicionar Período
                        </button>

                            <button class="btn icon add" onClick={this.saveCurrentPeriod.bind(this)}>
                                <FontAwesomeIcon icon={faSave} size='sm' /> Salvar Período Ativo <Spin size="small" spinning={this.state.loading} />
                            </button>

                            <button class="btn icon pdf" onClick={() => Print.printDocument("Períodos-de-Avaliação")} data-toggle="tooltip" title="Exportar PDF">
                                <FontAwesomeIcon icon={faDownload} size='sm' />
                            </button>
                        </div>
                    </div>
                    {this.getMessageCriterion()}
                    {this.getMessageAward()}
                    <div class="text-center">
                        <Spin size="large" spinning={this.state.loading} />
                    </div>
                    <div id="table-periods">
                        {this.loadData()}
                    </div>

                    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Adicionar Período</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">

                                    <div class="form-row">

                                        <div class="form-row justify-content-center">
                                            <div class="form-group col-md-12">
                                                <label for="inputPeriodName">Nome do Período <span class="label-required">*</span></label>
                                                <input maxlength="100" type="text" class="form-control" id="inputPeriodName" placeholder="Nome do Período" value={this.state.campPeriodName} onChange={(value) => this.setState({ campPeriodName: value.target.value })} />
                                            </div>


                                            <div class="form-group col-md-12">
                                                <label for="inputPeriodInitialDate">Data Inicial <span class="label-required">*</span></label>
                                                <input type="text" class="inputDate form-control" id="inputPeriodInitialDate" placeholder="Data Inicial" value={this.state.campPeriodInitialDateSub} />
                                            </div>

                                            <div class="form-group col-md-12">
                                                <label for="inputPeriodFinalDate">Data Final <span class="label-required">*</span></label>
                                                <input type="text" class="inputDate form-control" id="inputPeriodFinalDate" placeholder="Data Final" value={this.state.campPeriodFinalDateSub} />
                                            </div>

                                            <div class="form-group col-md-12">
                                                <label>Prêmios Associados</label>
                                                <Multiselect
                                                    options={this.state.dataAwardsLookUp}
                                                    displayValue="award_name"
                                                    onSelect={this.onSelectAwardLookUp.bind(this)}
                                                    onRemove={this.onRemoveAwardLookUp.bind(this)}
                                                />
                                            </div>

                                            <div class="form-group col-md-12">
                                                <label>Critérios Associados</label>
                                                <Multiselect
                                                    options={this.state.dataCriterionsLookUp}
                                                    displayValue="criterion_name"
                                                    onSelect={this.onSelectCriterionLookUp.bind(this)}
                                                    onRemove={this.onRemoveCriterionLookUp.bind(this)}
                                                />
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

    getSwitch(id) {
        if (id == this.state.currentPeriod) {
            return (
                <Switch defaultChecked={true} onChange={(checked: boolean) => {
                    this.setState({ setCurrentPeriod: checked, currentPeriod: id });
                }} />)
        } else {
            return (
                <Switch defaultChecked={false} onChange={(checked: boolean) => {
                    this.setState({ setCurrentPeriod: checked, currentPeriod: id });
                }} />)
        }
    }
    loadData() {

        if (this.state.listPeriods == null) {
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
                                <th width="5%" scope="col" class="text-center">ID</th>
                                <th scope="col">Nome do Período</th>
                                <th>Período Ativo</th>
                                <th width="12%" scope="col">Data Inicial</th>
                                <th width="12%" scope="col">Data Final</th>
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

        return this.state.listPeriods.map((data) => {
            return (
                <tr>
                    <td class="text-center"><span class="label-mobile">ID</span>{data.id}</td>
                    <td><span class="label-mobile">Nome do Período</span>{data.period_name}</td>
                    <td>
                        <span class="label-mobile">Período Ativo</span>
                        {this.getSwitch(data.id)}
                    </td>
                    <td><span class="label-mobile">Data Inicial</span>{this.formatDate(data.period_initial_date)}</td>
                    <td><span class="label-mobile">Data Final</span>{this.formatDate(data.period_final_date)}</td>
                    <td>
                        <span class="label-mobile">Ações</span>
                        {this.renderEditButton(data.id)}
                        <Button title="Excluir Período" danger onClick={() => this.onDelete(data.id)}>
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
            text: 'Deseja remover este Período?',
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
                    'Período mantido!',
                    'warning'
                )
            }
        })
    }

    sendDelete(periodId) {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const url = baseURL + "/periods/delete/" + periodId;

        const datapost = 0;

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
                    this.loadPeriods()
                })
            }
        }).catch(error => {
            alert("Error 325 " + error)
        })
    }

    //Enviar dados ao lado Servidor
    sendSave() {

        if (this.state.campPeriodName == "") {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Nome do Período",
                'warning'
            )
        }
        else if (this.state.campPeriodInitialDate == "") {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Data Inicial",
                'warning'
            )
        }
        else if (this.state.campPeriodFinalDate == "") {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Data Final",
                'warning'
            )
        }
        else {
            this.setState({ loading: true });
            const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
            const url = baseURL + "/periods/create";

            // Transforma o Array de Prêmios em array de IDs apenas
            const awardsAssociateID = []
            for (var i = 0; i < this.state.valueSelectedAwardsLookUp.length; i++) {
                awardsAssociateID[i] = this.state.valueSelectedAwardsLookUp[i].id
            }
            // Transforma o Array de Critérios em array de IDs apenas
            const criterionsAssociateID = []
            for (var i = 0; i < this.state.valueSelectedCriterionsLookUp.length; i++) {
                criterionsAssociateID[i] = this.state.valueSelectedCriterionsLookUp[i].id
            }

            const datapost = {
                period_name: this.state.campPeriodName,
                period_initial_date: this.state.campPeriodInitialDate,
                period_final_date: this.state.campPeriodFinalDate,
                awardsAssociate: awardsAssociateID,
                criterionsAssociate: criterionsAssociateID,
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
                            'Período Cadastrado!',
                            res.data.message,
                            'success'
                        ).then((result) => {
                            this.loadPeriods()
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


export default ListPeriod;