import React from 'react';
import { Link } from "react-router-dom";

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTh } from '@fortawesome/free-solid-svg-icons'
import { faMedal } from '@fortawesome/free-solid-svg-icons'
import { faSpellCheck } from '@fortawesome/free-solid-svg-icons'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { faUserFriends } from '@fortawesome/free-solid-svg-icons'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { faWrench } from '@fortawesome/free-solid-svg-icons'
import { faAddressCard } from '@fortawesome/free-solid-svg-icons'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'
import { faChartBar } from '@fortawesome/free-solid-svg-icons'
import { faBalanceScale } from '@fortawesome/free-solid-svg-icons'
import { faBars } from '@fortawesome/free-solid-svg-icons'


//Import Jquery resources
import $ from "jquery"


import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const currentRoleUser = localStorage.getItem('ROLE_KEY');
const currentUser = localStorage.getItem('USER_KEY');

class Menu extends React.Component {

    componentDidMount() {

        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })

        // Esconde Tooltip no click do Menu
        $(document).on('click', '.link-menu', function () {
            $('.tooltip').removeClass('show').addClass('hide')
        });
        this.centerMenu()
    }

    centerMenu() {
        let size1 = $('.Menu').outerHeight()
        let size2 = $('.Menu > ul').outerHeight()
        let marginTop = (size1 - size2) / 2

        $('.Menu > ul').css('marginTop', marginTop)
    }
    loadMenuMobile() {
        if (currentRoleUser == 1) {
            return (
                <ul>
                    <button id="btn-menu-mobile" class="btn btn-menu btn-menu-mobile" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <FontAwesomeIcon icon={faBars} size='sm' />
                    </button>

                    <div class="dropdown-menu nav-mobile nav-super">
                        <li class="dropdown-item"><Link class="link-menu" to="/admin/dashboard" data-toggle="tooltip" data-placement="right" title="Dashboard">Dashboard</Link></li>
                        <li class="dropdown-item"><Link class="link-menu" to="/admin/ratings" data-toggle="tooltip" data-placement="right" title="Gerenciar Avaliações">Gerenciar Avaliações</Link></li>
                        <li class="dropdown-item"><Link class="link-menu" to="/admin/tiebreakers" data-toggle="tooltip" data-placement="right" title="Gerenciar Critérios de Desempate" >Gerenciar Critérios de Desempate</Link></li>
                        <li class="dropdown-item"><Link class="link-menu" to="/admin/awards" data-toggle="tooltip" data-placement="right" title="Gerenciar Prêmios" >Gerenciar Prêmios</Link></li>
                        <li class="dropdown-item"><Link class="link-menu" to="/admin/criterions" data-toggle="tooltip" data-placement="right" title="Gerenciar Critérios" >Gerenciar Critérios</Link></li>
                        <li class="dropdown-item"><Link class="link-menu" to="/admin/periods" data-toggle="tooltip" data-placement="right" title="Gerenciar Períodos" >Gerenciar Períodos</Link></li>
                        <li class="dropdown-item"><Link class="link-menu" to="/admin/users" data-toggle="tooltip" data-placement="right" title="Gerenciar Usuários" >Gerenciar Usuários</Link></li>
                        <li class="dropdown-item"><Link class="link-menu" to="/admin/teams" data-toggle="tooltip" data-placement="right" title="Gerenciar Equipes" >Gerenciar Equipes</Link></li>
                        <li class="dropdown-item"><Link class="link-menu" to="/admin/roles" data-toggle="tooltip" data-placement="right" title="Gerenciar Funções" >Gerenciar Funções</Link></li>
                        <li class="dropdown-item"><Link class="link-menu" to="/admin/reports" data-toggle="tooltip" data-placement="right" title="Relatórios" >Relatórios</Link></li>
                        <li class="dropdown-item"><Link class="link-menu" to={"/admin/update/" + currentUser} data-toggle="tooltip" data-placement="right" title="Meus Dados" >Meus Dados</Link></li>
                    </div>
                </ul>
            )

        } else if (currentRoleUser == 2) {
            return (
                <ul>
                    <button id="btn-menu-mobile" class="btn btn-menu btn-menu-mobile" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <FontAwesomeIcon icon={faBars} size='sm' />
                    </button>

                    <div class="dropdown-menu nav-mobile">
                        <li class="dropdown-item"><Link class="link-menu" to={"/leader/dashboard"} data-toggle="tooltip" data-placement="right" title="Dashboard" >Dashboard</Link></li>
                        <li class="dropdown-item"><Link class="link-menu" to="/evaluation" onClick={() => {window.location.href="/evaluation"}} data-toggle="tooltip" data-placement="right" title="Avaliar Equipe" >Avaliar Equipe</Link></li>
                        <li class="dropdown-item"><Link class="link-menu" to="/winners" data-toggle="tooltip" data-placement="right" title="Premiar Equipe" >Premiar Equipe</Link></li>
                        <li class="dropdown-item"><Link class="link-menu" to="/ratings" data-toggle="tooltip" data-placement="right" title="Gerenciar Avaliações" >Gerenciar Avaliações</Link></li>
                        <li class="dropdown-item"><Link class="link-menu" to="/users" data-toggle="tooltip" data-placement="right" title="Gerenciar Equipe" >Gerenciar Equipe</Link></li>
                    </div>
                </ul>
            )

        } else if (currentRoleUser == 3 || currentRoleUser == undefined) {
            return (
                <ul>
                    <button id="btn-menu-mobile" class="btn btn-menu btn-menu-mobile" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <FontAwesomeIcon icon={faBars} size='sm' />
                    </button>
                    <div class="dropdown-menu nav-mobile">
                        <li class="dropdown-item"><Link class="link-menu" to={"/dashboard"} data-toggle="tooltip" data-placement="right" title="Dashboard" >Dashboard</Link></li>
                        <li class="dropdown-item"><Link class="link-menu" to={"/update/" + currentUser} data-toggle="tooltip" data-placement="right" title="Meus Dados" >Meus Dados</Link></li>
                        <li class="dropdown-item"><Link class="link-menu " to="/awards/view" data-toggle="tooltip" data-placement="right" title="Prêmios para o Período" >Prêmios para o Período</Link></li>
                        <li class="dropdown-item"><Link class="link-menu" to="/criterions/view" data-toggle="tooltip" data-placement="right" title="Critérios para o Período" >Critérios para o Período</Link></li>
                        <li class="dropdown-item"></li>
                    </div>
                </ul>

            )
        }
    }
    loadMenu() {
        if (currentRoleUser == 1) {

            return (
                <ul>
                    <li class="menu-item"><Link class="link-menu " to="/admin/dashboard" data-toggle="tooltip" data-placement="right" title="Dashboard"> <FontAwesomeIcon icon={faTh} /></Link> </li>
                    <li class="menu-item"><Link class="link-menu" to="/admin/ratings" data-toggle="tooltip" data-placement="right" title="Gerenciar Avaliações" ><FontAwesomeIcon icon={faChartBar} /></Link> </li>
                    <li class="menu-item"><Link class="link-menu" to="/admin/tiebreakers" data-toggle="tooltip" data-placement="right" title="Gerenciar Critérios de Desempate" ><FontAwesomeIcon icon={faBalanceScale} /></Link> </li>
                    <li class="menu-item"><Link class="link-menu " to="/admin/awards" data-toggle="tooltip" data-placement="right" title="Gerenciar Prêmios" ><FontAwesomeIcon icon={faMedal} /></Link> </li>
                    <li class="menu-item"><Link class="link-menu" to="/admin/criterions" data-toggle="tooltip" data-placement="right" title="Gerenciar Critérios" ><FontAwesomeIcon icon={faSpellCheck} /></Link> </li>
                    <li class="menu-item"><Link class="link-menu" to="/admin/periods" data-toggle="tooltip" data-placement="right" title="Gerenciar Períodos" ><FontAwesomeIcon icon={faCalendar} /></Link> </li>
                    <li class="menu-item"><Link class="link-menu" to="/admin/users" data-toggle="tooltip" data-placement="right" title="Gerenciar Usuários" ><FontAwesomeIcon icon={faUserFriends} /></Link> </li>
                    <li class="menu-item"><Link class="link-menu" to="/admin/teams" data-toggle="tooltip" data-placement="right" title="Gerenciar Equipes" ><FontAwesomeIcon icon={faUsers} /></Link> </li>
                    <li class="menu-item"><Link class="link-menu" to="/admin/roles" data-toggle="tooltip" data-placement="right" title="Gerenciar Funções" ><FontAwesomeIcon icon={faWrench} /></Link> </li>
                    <li class="menu-item"><Link class="link-menu" to="/admin/reports" data-toggle="tooltip" data-placement="right" title="Relatórios" ><FontAwesomeIcon icon={faChartLine} /></Link> </li>
                    <li class="menu-item"><Link class="link-menu" to={"/admin/update/" + currentUser} data-toggle="tooltip" data-placement="right" title="Meus Dados" ><FontAwesomeIcon icon={faAddressCard} /></Link> </li>
                </ul>
            )

        } else if (currentRoleUser == 2) {
            return (
                <ul>
                    <li class="menu-item"><Link class="link-menu" to={"/leader/dashboard"} data-toggle="tooltip" data-placement="right" title="Dashboard" ><FontAwesomeIcon icon={faTh} /></Link> </li>
                    <li class="menu-item"><Link class="link-menu" to="/evaluation" onClick={() => {window.location.href="/evaluation"}} data-toggle="tooltip" data-placement="right" title="Avaliar Equipe" ><FontAwesomeIcon icon={faStar} /></Link> </li>
                    <li class="menu-item"><Link class="link-menu" to="/winners" data-toggle="tooltip" data-placement="right" title="Premiar Equipe" ><FontAwesomeIcon icon={faTrophy} /></Link> </li>
                    <li class="menu-item"><Link class="link-menu" to="/ratings" data-toggle="tooltip" data-placement="right" title="Gerenciar Avaliações" ><FontAwesomeIcon icon={faChartBar} /></Link> </li>
                    <li class="menu-item"><Link class="link-menu" to="/users" data-toggle="tooltip" data-placement="right" title="Gerenciar Equipe" ><FontAwesomeIcon icon={faUsers} /></Link> </li>
                    <li class="menu-item"><Link class="link-menu" to={"/leader/update/" + currentUser} data-toggle="tooltip" data-placement="right" title="Meus Dados" ><FontAwesomeIcon icon={faAddressCard} /></Link> </li>
                </ul>
            )

        } else if (currentRoleUser == 3 || currentRoleUser == undefined) {
            return (
                <ul>
                    <li class="menu-item"><Link class="link-menu" to={"/dashboard"} data-toggle="tooltip" data-placement="right" title="Dashboard" ><FontAwesomeIcon icon={faTh} /></Link> </li>
                    <li class="menu-item"><Link class="link-menu" to={"/update/" + currentUser} data-toggle="tooltip" data-placement="right" title="Meus Dados" ><FontAwesomeIcon icon={faAddressCard} /></Link> </li>
                    <li class="menu-item"><Link class="link-menu " to="/awards/view" data-toggle="tooltip" data-placement="right" title="Prêmios para o Período" ><FontAwesomeIcon icon={faMedal} /></Link> </li>
                    <li class="menu-item"><Link class="link-menu" to="/criterions/view" data-toggle="tooltip" data-placement="right" title="Critérios para o Período" ><FontAwesomeIcon icon={faSpellCheck} /></Link> </li>
                </ul>
            )
        }
    }

    render() {

        return (
            <div>
                <div class='MenuMobile'>
                    {this.loadMenuMobile()}
                </div>
                <div class='Menu'>
                    {this.loadMenu()}
                </div>
            </div>
        );
    }
}

export default Menu;