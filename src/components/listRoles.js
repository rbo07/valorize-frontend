//Import React
import React from 'react';
import { Link } from "react-router-dom";

import { baseURL } from '../services/api';
//Import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

//import Axios
import axios from 'axios';

const url = baseURL + '/roles';

class ListRoles extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataRole: [],
        }
    }

    componentDidMount() {
        this.listRoles();
    }

    listRoles() {
        const token = 'Bearer '+ localStorage.getItem('TOKEN_KEY');
        
        axios.get(url, { headers: {
            'Authorization': token }
          })
            .then(res => {
                if (res.data.success) {
                    const data = res.data.roles
                    this.setState({
                        dataRole: data,
                    })

                } else {
                    alert('Error Web Service');
                }
            })
            .catch(error => {
                alert('Error server ' + error)
            })
    }

    loadFillData() {

        return this.state.dataRole.map((data) => {
            return (
                <div>
                    {data.role_name}
                    <span class="float-right">
                        <Link to={"/role/"+data.id} >Edit</Link>
                    </span>
                </div>
            )
        })
    }

    render() {
        return (
            <div>
                {this.loadFillData()}
            </div>
        );
    }
}



export default ListRoles;