//Import React
import React from 'react';
import { Link } from "react-router-dom";
import ActiveMenu from "../../services/setMenu";

//Import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

//Icon
import { PlusOutlined } from '@ant-design/icons';

//import Axios
import axios from 'axios';
import { baseURL } from '../../services/api';

// Badge
import { Badge } from 'antd';

//Spin
import { Spin } from 'antd';

// Button
import { Button } from 'antd';

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

class ListTiebreaker extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            ListTiebreakers: [],
            campTiebreakName: "",
            campTiebreakWeight: null,
            message: '',
            offset: 0,
            perPage: 7,
            currentPage: 0,
            loading: false
        }
    }

    componentDidMount() {
        this.loadTiebreakers();
        ActiveMenu.setActive('.lk-tiebreak');
    }

    truncate(str, n) {
        return (str.length > n) ? str.substr(0, n - 1) + ' ...' : str;
    };

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadTiebreakers()
        });

    };

    loadTiebreakers() {
        this.setState({ loading: true });
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const url = baseURL + '/tiebreakers';

        axios.get(url, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const dataTiebreakers = res.data.tiebreakers
                    const slice = dataTiebreakers.slice(this.state.offset, this.state.offset + this.state.perPage)

                    this.setState({
                        ListTiebreakers: slice,
                        pageCount: Math.ceil(dataTiebreakers.length / this.state.perPage),
                        loading: false
                    })
                } else {
                    this.setState({
                        ListTiebreakers: null,
                        message: res.data.message,
                        loading: false
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

    renderEditButton(id) {
        if (currentRoleUser == 1) {
            return (
                <Link title="Editar Critério de Desempate" class="btn icon edit" to={"/admin/tiebreakers/edit/" + id} >
                    <FontAwesomeIcon icon={faPen} size='sm' />
                </Link>
            )
        } else if (currentRoleUser == 2) {
            return (
                <Link title="Editar Critério de Desempate" class="btn icon edit" to={"/tiebreakers/edit/" + id} >
                    <FontAwesomeIcon icon={faPen} size='sm' />
                </Link>
            )
        }
    }

    handleChangeTiebreak(value) {
        this.setState({ campTiebreakWeight: value });
    }

    render() {
        const { Option } = Select;
        return (
            <div>
                <Menu />
                <div id="Critérios-de-Desempate" class={'Content ' + ActiveMenu.getClassMenu()}>
                    <Header />
                    <div class="row">
                        <div class="col-md-6">
                            <h1>Gerenciar Critérios de Desempate</h1>
                        </div>

                        <div class="col-md-6 actions text-right">
                            <button class="btn icon add" data-toggle="modal" data-target="#exampleModal">
                                <FontAwesomeIcon icon={faPlus} size='sm' /> Adicionar Critério de Desempate
                        </button>

                            <button class="btn icon pdf" onClick={() => Print.printDocument("Critérios-de-Desempate")} data-toggle="tooltip" title="Exportar PDF">
                                <FontAwesomeIcon icon={faDownload} size='sm' />
                            </button>
                        </div>
                    </div>
                    <div class="text-center">
                        <Spin size="large" spinning={this.state.loading} />
                    </div>
                    <div id="table-tiebreakers">
                        {this.loadData()}
                    </div>


                    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Adicionar Critério de Desempate</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">

                                    <div class="form-row justify-content-center">
                                        <div class="form-group col-md-12">
                                            <label for="inputTiebreakName">Nome do Critério de Desempate <span class="label-required">*</span></label>
                                            <input maxlength="100" type="text" class="form-control" id="inputTiebreakName" placeholder="Nome do Critério de Desempate" value={this.state.campTiebreakName} onChange={(value) => this.setState({ campTiebreakName: value.target.value })} />
                                        </div>

                                        <div class="form-group col-md-12">
                                            <label for="selectTiebreakWeight">Peso <span class="label-required">*</span></label>
                                            <Select onChange={(value) => this.handleChangeTiebreak(value)} size={'40px'} value={this.state.campTiebreakWeight} placeholder="Selecione o Critério de Desempate" >
                                                <Option value={5} key={5}>5</Option>
                                                <Option value={10} key={10}>{10}</Option>
                                                <Option value={15} key={15}>{15}</Option>
                                                <Option value={20} key={20}>{20}</Option>
                                                <Option value={25} key={25}>{25}</Option>
                                                <Option value={30} key={30}>{30}</Option>
                                                <Option value={35} key={35}>{35}</Option>
                                                <Option value={40} key={40}>{40}</Option>
                                                <Option value={45} key={45}>{45}</Option>
                                                <Option value={50} key={50}>{50}</Option>
                                                <Option value={55} key={55}>{55}</Option>
                                                <Option value={60} key={60}>{60}</Option>
                                                <Option value={65} key={65}>{65}</Option>
                                                <Option value={70} key={70}>{70}</Option>
                                                <Option value={75} key={75}>{75}</Option>
                                                <Option value={80} key={80}>{80}</Option>
                                                <Option value={85} key={85}>{85}</Option>
                                                <Option value={90} key={90}>{90}</Option>
                                                <Option value={95} key={95}>{95}</Option>
                                                <Option value={100} key={100}>{100}</Option>
                                            </Select>
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
        if (this.state.ListTiebreakers == null) {
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
                                <th scope="col">Nome do Critério de Desempate</th>
                                <th width="15%" class="text-center" scope="col">Peso</th>
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
    loadFillData() {

        return this.state.ListTiebreakers.map((data) => {
            return (
                <tr>
                    <td class="text-center"><span class="label-mobile">ID</span>{data.id}</td>
                    <td><span class="label-mobile">Nome do Critério de Desempate</span>{this.truncate(data.tiebreaker_name, 50)}</td>
                    <td class="text-center">
                        <span class="label-mobile">Peso</span>
                        <Badge className="site-badge-count-109" count={100} overflowCount={data.tiebreaker_weight} style={{ backgroundColor: '#52c41a' }} />
                    </td>
                    <td>
                        <span class="label-mobile">Ações</span>
                        {this.renderEditButton(data.id)}
                        <Button title="Excluir Critério de Desempate" danger onClick={() => this.onDelete(data.id)}>
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
            text: 'Deseja remover este Critério de Desempate?',
            icon: "warning",
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
                    'Desempate mantido!',
                    'info'
                )
            }
        })
    }

    sendDelete(tiebreakId) {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const url = baseURL + "/tiebreak/delete/" + tiebreakId;

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
                    this.loadTiebreakers()
                })
            }
        }).catch(error => {
            alert("Error 325 " + error)
        })
    }

    //Enviar dados ao lado Servidor
    sendSave() {

        if (this.state.campTiebreakName == "") {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Nome do Critério de Desempate",
                'warning'
            )
        }
        else if (this.state.campTiebreakWeight == null) {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Peso",
                'warning'
            )
        }
        else {
            this.setState({ loading: true });
            const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
            const url = baseURL + "/tiebreak/create";

            const datapost = {
                tiebreaker_name: this.state.campTiebreakName,
                tiebreaker_weight: this.state.campTiebreakWeight,
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
                            'Critério de Desempate Cadastrado!',
                            res.data.message,
                            'success'
                        ).then((result) => {
                            this.loadTiebreakers()
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

export default ListTiebreaker;