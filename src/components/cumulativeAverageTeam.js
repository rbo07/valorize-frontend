import React from 'react';

//import Axios
import axios from 'axios';
import { baseURL } from '../services/api';

// Donut Chart
import { Donut, DonutValue, DonutLabel } from 'react-donut-component'

//Spin
import { Spin } from 'antd';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const currentUser = localStorage.getItem('USER_KEY');


class CumulativeAverageTeam extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      data_media: "",
      periodName: "",
      loading: false
    }
  }

  checkId(id) {
    if (id == null || id == undefined) {
      return 0
    } else {
      return id
    }
  }

  checkUrl(leaderId, currentUser) {
    if(leaderId == 0){
        return currentUser
    } else {
        return leaderId
    }
}

  componentDidMount() {
    this.setState({ loading: true });

    const leaderId = this.checkId(this.props.leaderId)
    const idPeriod = this.checkId(this.props.id)

    const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
    const url = baseURL + "/cumulativeAverageTeam/" + this.checkUrl(leaderId, currentUser) + ':' + idPeriod;

    axios.get(url, {
      headers: {
        'Authorization': token
      }
    })
      .then(res => {
        if (res.data.success == true) {
          const data = res.data.media
          this.setState({
            periodName: res.data.lastPeriodName,
            data_media: data,
            loading: false
          })
        } else {
          this.setState({
            periodName: res.data.lastPeriodName,
            loading: false
          })
        }
      })
      .catch(error => {
        this.setState({ loading: false });
        alert("Error server " + error)
      })
  }

  getData() {
    if (this.state.data_media == '' || this.state.data_media == null) {
      return (
        <div class="alert mini alert-warning alert-dismissible fade show" role="alert">
          <strong>Ops!</strong> Nenhuma média cadastrada neste período.
        </div>
      )
    } else {
      return (
        <Donut
          styleTrack={{ strokeWidth: 20, stroke: 'AliceBlue' }}
          styleIndicator={{ stroke: 'rgb(74, 181, 235)' }}
        >{this.state.data_media}</Donut>
      )
    }
  }

  render() {

    return (
      <div class="card average-dashboard-leader">
        <label>Média Geral do Time <span>| {this.state.periodName}</span></label>
        <Spin size="large" spinning={this.state.loading} />
        {this.getData()}
      </div>
    );
  }
}

export default CumulativeAverageTeam;