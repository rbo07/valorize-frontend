import React, { useEffect, useState } from 'react';
import { Chart } from 'react-charts'

//import Axios
import axios from 'axios';
import { baseURL } from '../services/api';

const currentUser = localStorage.getItem('USER_KEY');

function RatingsPeriods() {

    const [data, setData] = useState({});

    useEffect(() => {
        const token = 'Bearer ' + localStorage.getItem('TOKEN_KEY');
        
        let url = baseURL + "/averages/" + currentUser;

        axios.get(url, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => {
                if (res.data.success) {
                    let data = res.data.averagesPeriods
                    setData(data);

                }
            })
    }, []);

    const series = React.useMemo(
        () => ({
            type: 'bar'
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
                height: '250px'
            }}
        >
            <Chart data={data} series={series} axes={axes} tooltip />
        </div>
    )
    return lineChart
}

export default RatingsPeriods;
