import React, { useEffect, useState } from 'react';
import { Chart } from 'react-charts'

//import Axios
import axios from 'axios';
import { baseURL } from '../services/api';

function ChartArea() {

    const [ data, setData ] = useState({});

    useEffect(() => {
        const token = 'Bearer '+ localStorage.getItem('TOKEN_KEY');
        let url = baseURL + '/report/average/totalPeriod';

        axios.get(url, { headers: {
            'Authorization': token }
          })
            .then(res => {
                if (res.data.success) {
                    let data = res.data.datePerPeriod
                    setData(data);

                }
            })
            .catch(error => {
                alert('Error server ' + error)
            })

    }, []);
    
    const series = React.useMemo(
        () => ({
            type: 'bar',
            options: {
                legend: {
                    display: true,
                }
            }
        }),
        []
    )

    const axes = React.useMemo(
        () => [
            { primary: true, type: 'ordinal', position: 'bottom' },
            { position: 'left', type: 'linear', stacked: true }
        ],
        []
    )

    const lineChart = (
        // A react-chart hyper-responsively and continuously fills the available
        // space of its parent element automatically
        <div
            style={{
                width: '100%',
                height: '300px'
            }}
        >
            <Chart data={data} series={series} axes={axes} tooltip />
        </div>
    )
    if (data.length == 0 ) {
        return (
            <div class="alert mini alert-warning alert-dismissible fade show" role="alert">
                <strong>Ops!</strong> Nenhuma equipe avaliada nos últimos períodos.
            </div>
        )
    } else {
        return lineChart
    }
}

export default ChartArea;
