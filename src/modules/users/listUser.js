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

//Spin
import { Spin } from 'antd';

//Pagination
import ReactPaginate from 'react-paginate';

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

//Print
import Print from "../../services/print";


const currentUser = localStorage.getItem('USER_KEY');
const currentRoleUser = localStorage.getItem('ROLE_KEY');


class ListUser extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      listUsers: [],
      listUsersTeam: [],
      teamId: null,
      dataRoleLookUp: [],
      dataUserLookUp: [],
      selectRole: "",
      valueSelectRole: null,
      selectUser: "",
      valueSelectUser: null,
      message: '',
      offset: 0,
      perPage: 7,
      currentPage: 0,
      loading: false
    }
    this.handlePageClick = this
      .handlePageClick
      .bind(this);
  }

  componentDidMount() {
    this.loadUser();
    this.rolesLookUp();
    this.usersLookUp();
  }

  loadUser() {
    this.setState({ loading: true });
    const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
    const url = baseURL + '/users/' + currentUser;

    axios.get(url, {
      headers: {
        'Authorization': token
      }
    })
      .then(res => {
        if (res.data.success == true) {
          const dataUsers = res.data.allUsers
          const dataUsersTeam = res.data.usersTeam
          const dataTeamId = res.data.teamId

          if (currentRoleUser == 1) {
            let slice = dataUsers.slice(this.state.offset, this.state.offset + this.state.perPage)

            this.setState({
              listUsers: slice,
              // listUsersTeam: dataUsersTeam,
              teamId: dataTeamId,
              pageCount: Math.ceil(dataUsers.length / this.state.perPage),
              loading: false
            })

          } else {
            let slice = dataUsersTeam.slice(this.state.offset, this.state.offset + this.state.perPage)

            this.setState({
              // listUsers: slice,
              listUsersTeam: slice,
              teamId: dataTeamId,
              pageCount: Math.ceil(dataUsersTeam.length / this.state.perPage),
              loading: false
            })

          }

        } else if (res.data.success == false) {
          const dataTeamId = res.data.teamId

          this.setState({
            message: res.data.message,
            listUsers: null,
            listUsersTeam: null,
            teamId: dataTeamId,
            loading: false
          })
        } else {
          this.setState({
            message: res.data.message,
            listUsers: null,
            listUsersTeam: null,
            loading: false
          })
        }
      })
      .catch(error => {
        alert('Error server ' + error)
      })
  }


  usersLookUp() {
    const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
    const urlUserLookUp = baseURL + "/userLookUp"

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
          alert('Error Web Service');
        }
      })
      .catch(error => {
        alert('Error server ' + error)
      })
  }

  rolesLookUp() {
    const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
    const urlRoleLookUp = baseURL + "/rolesLookUp"

    axios.get(urlRoleLookUp, {
      headers: {
        'Authorization': token
      }
    })
      .then(res => {
        if (res.data.success) {
          const data = res.data.roles
          this.setState({
            dataRoleLookUp: data
          })

        } else {
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

  checkIfOnline(data) {
    let result = data ? 'online' : 'offline';
    return result
  }
  getPaginate() {
    // if (currentRoleUser == 1) {
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
    // } else {
    //   return ''
    // }
  }

  loadTable() {
    if (this.state.message !== '') {
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
              {this.loadHeaderTable()}
            </thead>
            <tbody>
              {this.loadFillData()}
            </tbody>
          </table>
          {this.getPaginate()}
        </div>
      )
    }
  }

  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState({
      currentPage: selectedPage,
      offset: offset
    }, () => {
      this.loadUser()
    });
  };

  handleChangeRole(value) {
    this.setState({ valueSelectRole: value });
  }

  handleChangeUser(value) {
    this.setState({ valueSelectUser: value });
  }

  render() {
    const { Option } = Select;
    return (
      <div>
        <Menu />
        <div id="Usuários" class='Content'>
          <Header />
          <div class="row">
            <div class="col-md-6">
              {this.loadTitle()}
            </div>

            <div class="col-md-6 actions text-right">
              {this.loadButtonAdd()}
              <button class="btn icon pdf" onClick={() => Print.printDocument("Usuários")} data-toggle="tooltip" title="Exportar PDF">
                <FontAwesomeIcon icon={faDownload} size='sm' />
              </button>
            </div>
          </div>
          <div class="text-center">
            <Spin size="large" spinning={this.state.loading} />
          </div>
          <div id="table-users">
            {this.loadTable()}
          </div>


          <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">Adicionar Membro à Equipe</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">

                  <div class="form-row">

                    <div class="form-group col-md-12">
                      <label for="inputUser">Novo Membro <span class="label-required">*</span></label>

                      <Select onChange={(value) => this.handleChangeUser(value)} size={'40px'} value={this.state.valueSelectUser} placeholder="Selecione o Usuário" >
                        {this.state.dataUserLookUp.map(data => <Option value={data.id} key={data.id}>{data.user_name}</Option>)}
                      </Select>

                    </div>

                    <div class="form-group col-md-12">
                      <label for="inputRole">Função</label>

                      <Select onChange={(value) => this.handleChangeRole(value)} size={'40px'} value={this.state.valueSelectRole} placeholder="Selecione a Função" >
                        {this.state.dataRoleLookUp.map(data => <Option value={data.id} key={data.id}>{data.role_name}</Option>)}
                      </Select>

                    </div>
                  </div>

                  <div class="message-required-form"><span class="label-required">*</span> Campo Obrigatório</div>
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

  loadTitle() {
    if (currentRoleUser == 1) {
      return (
        <h1>Gerenciar Usuários</h1>
      )
    } else if (currentRoleUser == 2) {
      return (
        <h1>Gerenciar Equipe</h1>
      )
    }
  }

  loadButtonAdd() {
    if (currentRoleUser == 1) {
      return (
        <Link class="btn icon add" to={"/admin/users/add"} >
          <FontAwesomeIcon icon={faPlus} size='sm' /> Adicionar Usuário
        </Link>
      )
    } else if (currentRoleUser == 2) {
      return (
        <button class="btn icon add" data-toggle="modal" data-target="#exampleModal">
          <FontAwesomeIcon icon={faPlus} size='sm' /> Adicionar Membro
        </button>
      )
    }
  }

  loadHeaderTable() {
    if (currentRoleUser == 1) {
      return (
        <tr>
          <th scope="col" class="text-center">ID</th>
          <th scope="col">Nome</th>
          <th scope="col">Função</th>
          <th scope="col">Equipe</th>
          <th scope="col">Email</th>
          {/* <th scope="col">Endereço</th>
          <th scope="col">Telefone</th> */}
          <th scope="col" class="text-center">Online</th>
          <th width="15%" colspan="2" class="center"><span class="label-acoes">Ações</span></th>
        </tr>
      )
    } else if (currentRoleUser == 2) {
      return (
        <tr>
          <th scope="col" class="text-center">ID</th>
          <th scope="col">Nome</th>
          <th scope="col">Função</th>
          <th scope="col">Email</th>
          {/* <th scope="col">Endereço</th>
          <th scope="col">Telefone</th> */}
          <th width="15%" colspan="2" class="center"><span class="label-acoes">Ações</span></th>
        </tr>
      )
    }
  }

  turnDataRole(obj) {
    if (obj !== null) {
      return obj.role_name
    } else {
      return 'Sem função cadastrada'
    }
  }

  loadFillData() {
    if (currentRoleUser == 1) {

      return this.state.listUsers.map((data) => {
        return (
          <tr>
            <td class="text-center"><span class="label-mobile">ID</span>{data.id}</td>
            <td><span class="label-mobile">Nome</span>{data.user_name}</td>
            <td><span class="label-mobile">Função</span>{this.turnDataRole(data.roles)}</td>
            <td><span class="label-mobile">Equipe</span>{data.teams.map((i) => { return (i.team_name) })}</td>
            <td><span class="label-mobile">Email</span>{data.user_email}</td>
            {/* <td>{data.user_address}</td>
            <td>{data.user_phone}</td> */}
            <td class="text-center"><span class="label-mobile">Online</span><span class={this.checkIfOnline(data.user_islogged)}></span></td>
            <td>
              <span class="label-mobile">Ações</span>
              <Link title="Editar Usuário" class="btn icon edit" to={"/admin/users/edit/" + data.id} >
                <FontAwesomeIcon icon={faPen} size='sm' />
              </Link>
              <Button title="Excluir Usuário" danger onClick={() => this.onDelete(data.id)}>
                <FontAwesomeIcon icon={faTrash} size='sm' />
              </Button>
            </td>
          </tr>
        )
      })

    } else if (currentRoleUser == 2) {
      return this.state.listUsersTeam.map((data) => {
        return (
          <tr>
            <td class="text-center"><span class="label-mobile">ID</span>{data.id}</td>
            <td><span class="label-mobile">Nome</span>{data.user_name}</td>
            <td><span class="label-mobile">Função</span>{this.turnDataRole(data.roles)}</td>
            <td><span class="label-mobile">Email</span>{data.user_email}</td>
            {/* <td>{data.user_address}</td>
            <td>{data.user_phone}</td> */}
            <td>
              <span class="label-mobile">Ações</span>
              <Link title="Editar Usuário" class="btn icon edit" to={"/users/edit/" + data.id} >
                <FontAwesomeIcon icon={faPen} size='sm' />
              </Link>
              <Button title="Excluir Usuário" danger onClick={() => this.onDelete(data.id)}>
                <FontAwesomeIcon icon={faTrash} size='sm' />
              </Button>
            </td>
          </tr>
        )
      })

    }
  }

  onDelete(id) {
    Swal.fire({
      title: 'Você tem certeza?',
      text: 'Deseja remover o usuário desta equipe?',
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
          'Usuário mantido!',
          'info'
        )
      }
    })
  }

  sendDelete(userId) {
    const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
    let url = null
    let user_id = String(userId);
    let team_id = String(this.state.teamId)

    const datapostDelete = 0

    if (currentRoleUser == 1) {
      url = baseURL + "/users/delete/" + userId;

      axios.put(url, datapostDelete, {
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
            this.loadUser()
          })
        }
      }).catch(error => {
        alert("Error 325 " + error)
      })

    } else if (currentRoleUser == 2) {

      const datapost = user_id + ':' + team_id
      url = baseURL + "/removeUserTeamAssociation/" + datapost;

      axios.delete(url, {
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
            this.loadUser()
          })
        }
      }).catch(error => {
        alert("Error 325 " + error)
      })
    }

  }

  //Enviar dados ao lado Servidor
  sendSave() {

    if (this.state.valueSelectUser == null) {
      Swal.fire(
        'Alerta!',
        "Preencha o campo Usuário",
        'warning'
      )
    }
    // else if (this.state.valueSelectRole == null) {
    //   Swal.fire(
    //     'Alerta!',
    //     "Preencha o campo Função",
    //     'warning'
    //   )
    // }
    else {
      this.setState({ loading: true });
      const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
      const url = baseURL + "/storeUserTeamAssociation";

      const datapost = {
        id_user: this.state.valueSelectUser,
        id_role: this.state.valueSelectRole,
        team_id: this.state.teamId
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
              'Usuário Cadastrado!',
              res.data.message,
              'success'
            ).then((result) => {
              this.loadUser()
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

export default ListUser;