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

//Import Jquery
import $ from "jquery"

//Template
import Header from "../../components/header";
import Menu from "../../components/menu";

//Pagination
import ReactPaginate from 'react-paginate';

//Print
import Print from "../../services/print";

class ListRole extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listRoles: [],
            campRoleName: "",
            campRoleDescription: "",
            selectRoleAccess: "",
            valueSelectRoleAccess: null,
            offset: 0,
            perPage: 7,
            currentPage: 0,
            loading: false
        }
    }

    componentDidMount() {
        this.loadRoles();
        ActiveMenu.setActive('.lk-role');
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
            this.loadRoles()
        });

    };

    loadRoles() {
        this.setState({ loading: true });
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const url = baseURL + '/roles';

        axios.get(url, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const dataRoles = res.data.roles
                    const slice = dataRoles.slice(this.state.offset, this.state.offset + this.state.perPage)

                    this.setState({
                        listRoles: slice,
                        pageCount: Math.ceil(dataRoles.length / this.state.perPage),
                        loading: false
                    })

                } else {
                    this.setState({ loading: false });
                    alert('Error Web Service');

                }
            })
            .catch(error => {
                alert('Error server ' + error)
            })
    }


    closeModal() {
        $('#cancelButton').click();
    }

    handleChangeAccess(value) {
        this.setState({ valueSelectRoleAccess: value });
    }

    render() {
        const { Option } = Select;
        return (
            <div>
                <Menu />
                <div id="Funções" class='Content'>
                    <Header />
                    <div class="row">
                        <div class="col-md-6">
                            <h1>Gerenciar Funções</h1>
                        </div>

                        <div class="col-md-6 actions text-right">
                            <button class="btn icon add" data-toggle="modal" data-target="#exampleModal">
                                <FontAwesomeIcon icon={faPlus} size='sm' /> Adicionar Função
                        </button>

                            <button class="btn icon pdf" onClick={() => Print.printDocument("Funções")} data-toggle="tooltip" title="Exportar PDF">
                                <FontAwesomeIcon icon={faDownload} size='sm' />
                            </button>
                        </div>
                    </div>
                    <div class="text-center">
                        <Spin size="large" spinning={this.state.loading} />
                    </div>
                    <div id="table-roles">
                        <table class="table table-striped">
                            <thead class="thead-dark">
                                <tr>
                                    <th scope="col" class="text-center">ID</th>
                                    <th scope="col">Nome da Função</th>
                                    <th scope="col">Nível de Acesso</th>
                                    <th scope="col">Descrição</th>
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


                    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Adicionar Função</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">

                                    <div class="form-row">

                                        <div class="form-row justify-content-center">
                                            <div class="form-group col-md-12">
                                                <label for="inputRoleName">Nome da Função <span class="label-required">*</span></label>
                                                <input maxlength="100" type="text" class="form-control" id="inputRoleName" placeholder="Nome da Função" value={this.state.campRoleName} onChange={(value) => this.setState({ campRoleName: value.target.value })} />
                                            </div>

                                            <div class="form-group col-md-12">
                                                <label for="selectRolesAccess">Nível de Acesso <span class="label-required">*</span></label>
                                                <Select onChange={(value) => this.handleChangeAccess(value)} size={'40px'} value={this.state.valueSelectRoleAccess} placeholder="Selecione o Nível de Acesso" >
                                                    <Option value={1} key={1}>1 - Super Administrador</Option>
                                                    <Option value={2} key={2}>2 - Líder de Equipe</Option>
                                                    <Option value={3} key={3}>3 - Usuário Básico</Option>
                                                </Select>
                                            </div>

                                            <div class="form-group col-md-12">
                                                <label for="inputRoleDescription">Descrição da Função <span class="label-required">*</span></label>
                                                <textarea maxlength="255" type="text" class="form-control" id="inputRoleDescription" placeholder="" value={this.state.campRoleDescription} onChange={(value) => this.setState({ campRoleDescription: value.target.value })} />
                                            </div>
                                        </div>

                                        <div class="message-required-form"><span class="label-required">*</span> Campos Obrigatórios</div>

                                    </div>
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
        );
    }


    loadFillData() {

        return this.state.listRoles.map((data) => {
            return (
                <tr>
                    <td class="text-center"><span class="label-mobile">ID</span>{data.id}</td>
                    <td><span class="label-mobile">Nome da Função</span>{this.truncate(data.role_name, 40)}</td>
                    <td><span class="label-mobile">Nível de Acesso</span>{data.role_access}</td>
                    <td><span class="label-mobile">Descrição</span>{this.truncate(data.role_description, 40)}</td>
                    <td>
                        <span class="label-mobile">Ações</span>
                        <Link title="Editar Função" class="btn icon edit" to={"/admin/roles/edit/" + data.id} >
                            <FontAwesomeIcon icon={faPen} size='sm' />
                        </Link>
                        <Button title="Excluir Função" danger onClick={() => this.onDelete(data.id)}>
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
            text: 'Deseja remover esta Função?',
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
                    'Cancelado',
                    'Função mantida!',
                    'info'
                )
            }
        })
    }

    sendDelete(roleId) {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const url = baseURL + "/roles/delete/" + roleId;

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
                    this.loadRoles()
                })
            }
        }).catch(error => {
            alert("Error 325 " + error)
        })
    }

    //Enviar dados ao lado Servidor
    sendSave() {

        if (this.state.campRoleName == "") {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Nome da Função",
                'warning'
            )
        }
        else if (this.state.valueSelectRoleAccess == null) {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Nível de Acesso",
                'warning'
            )
        }
        else if (this.state.campRoleDescription == "") {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Descrição da Função",
                'warning'
            )
        }
        else {
            this.setState({ loading: true });
            const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
            const url = baseURL + "/roles/create";

            const datapost = {
                role_name: this.state.campRoleName,
                role_access: this.state.valueSelectRoleAccess,
                role_description: this.state.campRoleDescription
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
                            'Função Cadastrada!',
                            res.data.message,
                            'success'
                        ).then((result) => {
                            this.loadRoles()
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

export default ListRole;