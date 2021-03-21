import React, { useEffect, useState } from 'react';
import { Chart } from 'react-charts'

//import Axios
import axios from 'axios';
import { baseURL } from '../services/api';

    function ChartLine() {

        const [data, setData] = useState({});

        useEffect(() => {
            const token = 'Bearer '+ localStorage.getItem('TOKEN_KEY');
            let url = baseURL + '/report/average/TeamPerPeriod';

            axios.get(url, { headers: {
                'Authorization': token }
              })
                .then(res => {
                    if (res.data.success) {
                        let data = res.data.averagesTeamsPerPeriod
                        setData( data );
                    }
                })
                .catch(error => {
                    alert('Error server ' + error)
                })
    
        }, []);

        const axes = React.useMemo(
            () => [
                { primary: true, type: 'ordinal', position: 'bottom' },
                { type: 'linear', position: 'left' }
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
                <Chart data={data} axes={axes} tooltip />
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

    export default ChartLine;
