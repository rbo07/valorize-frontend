import React from 'react';

//import Axios
import axios from 'axios';
import { baseURL } from '../services/api';

// Donut Chart React
import { Donut } from 'react-donut-component'


import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const currentUser = localStorage.getItem('USER_KEY');


class cumulativeAverage extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      data_media: '',
      data_period: '',
      message: ''
    }
  }

  checkId(id) {
    if (id == null || id == undefined) {
        return 0
    } else {
        return id
    }
}

checkUrl(userId, currentUser) {
    if(userId == 0){
        return currentUser
    } else {
        return userId
    }
}

  componentDidMount() {
    const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');

    const userId = this.checkId(this.props.userId)

    const url = baseURL + "/averages/" + this.checkUrl(userId, currentUser);

    axios.get(url, {
      headers: {
        'Authorization': token
      }
    })
      .then(res => {
        if (res.data.success) {
          const data = res.data.media
          this.setState({
            data_media: data,
            data_period: res.data.lastPeriodName
          })
        } else {
          this.setState({
            data_media: null,
            data_period: res.data.lastPeriodName,
            message: res.data.message,
          })
        }
      }).catch(error => {
        alert("Error server " + error)
      })
  }



  render() {
    if (this.state.data_media == null) {
      return (
        <div class="card average">
          <label>Média Acumulada <span>| Todos os Períodos</span></label>
          <div class="alert mini alert-warning alert-dismissible fade show" role="alert">
            <strong>Ops!</strong> {this.state.message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
      )
    } else {
      return (
        <div class="card average">
          <label>Média Acumulada <span>| Todos os Períodos</span></label>
          <Donut
            styleTrack={{ strokeWidth: 15, stroke: '#efefef' }}
            styleIndicator={{ stroke: 'rgb(255, 204, 0)' }}>
            {this.state.data_media}
          </Donut>
        </div>
      );
    }
  }
}

export default cumulativeAverage;