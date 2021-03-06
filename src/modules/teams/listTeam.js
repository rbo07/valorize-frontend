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

class ListTeam extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listTeams: [],
            dataUserLookUp: [],
            campTeamName: "",
            message: '',
            messageUserLookup: '',
            campTeamDescription: "",
            valueSelectTeamLeader: null,
            offset: 0,
            perPage: 7,
            currentPage: 0,
            loading: false
        }
    }

    componentDidMount() {
        this.loadTeams();
        this.usersLookUp();
        ActiveMenu.setActive('.lk-team');
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
            this.loadTeams()
        });

    };

    loadTeams() {
        this.setState({ loading: true });

        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const url = baseURL + '/teams';

        axios.get(url, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const dataTeams = res.data.teams
                    const slice = dataTeams.slice(this.state.offset, this.state.offset + this.state.perPage)

                    this.setState({
                        listTeams: slice,
                        pageCount: Math.ceil(dataTeams.length / this.state.perPage),
                        loading: false
                    })

                } else {
                    this.setState({
                        listTeams: null,
                        message: res.data.message,
                        loading: false
                    });
                }
            })
            .catch(error => {
                alert('Error server ' + error)
            })
    }

    usersLookUp() {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const urlUserLookUp = baseURL + "/userLookUpLeader"

        axios.get(urlUserLookUp, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    const data = res.data.users
                    this.setState({
                        dataUserLookUp: data
                    })

                } else {
                    this.setState({
                        messageUserLookup: res.data.message,
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

    handleChangeLeader(value) {
        this.setState({ valueSelectTeamLeader: value });
    }

    getMessageUser() {
        if (this.state.messageUserLookup !== '') {
            return (
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Ops!</strong> {this.state.messageUserLookup}
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
                <div id="Equipes" class={'Content ' + ActiveMenu.getClassMenu()}>
                    <Header />
                    <div class="row">
                        <div class="col-md-6">
                            <h1>Gerenciar Equipes</h1>
                        </div>
                        <div class="col-md-6 actions text-right">
                            <button class="btn icon add" data-toggle="modal" data-target="#exampleModal">
                                <FontAwesomeIcon icon={faPlus} size='sm' /> Adicionar Equipe
                        </button>

                            <button class="btn icon pdf" onClick={() => Print.printDocument("Equipes")} data-toggle="tooltip" title="Exportar PDF">
                                <FontAwesomeIcon icon={faDownload} size='sm' />
                            </button>
                        </div>
                    </div>
                    <div class="text-center">
                        <Spin size="large" spinning={this.state.loading} />
                    </div>
                    <div id="table-teams">
                        {this.getMessageUser()}
                        {this.loadData()}
                    </div>


                    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Adicionar Equipe</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">

                                    <div class="form-row">

                                        <div class="form-row justify-content-center">
                                            <div class="form-group col-md-12">
                                                <label for="inputTeamName">Nome da Equipe <span class="label-required">*</span></label>
                                                <input maxlength="100" type="text" class="form-control" id="inputTeamName" placeholder="Nome da Equipe" value={this.state.campTeamName} onChange={(value) => this.setState({ campTeamName: value.target.value })} />
                                            </div>

                                            <div class="form-group col-md-12">
                                                <label for="selectUserLookUp">L??der da Equipe <span class="label-required">*</span></label>
                                                <Select onChange={(value) => this.handleChangeLeader(value)} size={'40px'} value={this.state.valueSelectTeamLeader} placeholder="Selecione o L??der" >
                                                    {this.state.dataUserLookUp.map(data => <Option value={data.id} key={data.id}>{data.user_name}</Option>)}
                                                </Select>
                                            </div>

                                            <div class="form-group col-md-12">
                                                <label for="inputTeamDescription">Descri????o da Equipe <span class="label-required">*</span></label>
                                                <textarea maxlength="255" type="text" class="form-control" id="inputTeamDescription" placeholder="" value={this.state.campTeamDescription} onChange={(value) => this.setState({ campTeamDescription: value.target.value })} />
                                            </div>
                                        </div>

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
        );
    }

    checkNull(data) {
        if (data !== null) return this.truncate(data.user_name, 30)
        else return 'Sem l??der'
    }

    loadData() {
        if (this.state.listTeams == null) {
            return (
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Ops! </strong> {this.state.message}
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
                                <th scope="col">Nome da Equipe</th>
                                <th scope="col">L??der</th>
                                <th scope="col">Descri????o</th>
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

        return this.state.listTeams.map((data) => {
            return (
                <tr>
                    <td class="text-center"><span class="label-mobile">ID</span>{data.id}</td>
                    <td><span class="label-mobile">Nome da Equipe</span>{this.truncate(data.team_name,30)}</td>
                    <td><span class="label-mobile">L??der</span>{this.checkNull(data.leader)}</td>
                    <td><span class="label-mobile">Descri????o</span>{this.truncate(data.team_description, 40)}</td>
                    <td>
                        <span class="label-mobile">A????es</span>
                        <Link title="Editar Equipe" class="btn icon edit" to={"/admin/teams/edit/" + data.id} >
                            <FontAwesomeIcon icon={faPen} size='sm' />
                        </Link>
                        <Button title="Excluir Equipe" danger onClick={() => this.onDelete(data.id)}>
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
            text: 'Deseja remover esta Equipe?',
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
                    'Equipe mantida!',
                    'info'
                )
            }
        })
    }

    sendDelete(teamId) {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        const url = baseURL + "/teams/delete/" + teamId;

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
                    this.loadTeams()
                })
            }
        }).catch(error => {
            alert("Error 325 " + error)
        })
    }

    //Enviar dados ao lado Servidor
    sendSave() {

        if (this.state.campTeamName == "") {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Nome da Equipe",
                'warning'
            )
        }
        else if (this.state.valueSelectTeamLeader == null) {
            Swal.fire(
                'Alerta!',
                "Preencha o campo L??der da Equipe",
                'warning'
            )
        }
        else if (this.state.campTeamDescription == "") {
            Swal.fire(
                'Alerta!',
                "Preencha o campo Descri????o da Equipe",
                'warning'
            )
        }
        else {
            this.setState({ loading: true });
            const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
            const url = baseURL + "/teams/create";

            const datapost = {
                team_name: this.state.campTeamName,
                lider_id: this.state.valueSelectTeamLeader,
                team_description: this.state.campTeamDescription
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
                            'Equipe Cadastrada!',
                            res.data.message,
                            'success'
                        ).then((result) => {
                            this.loadTeams()
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

export default ListTeam;