import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import classes from './Conversation.module.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


function Conversation(props) {
  const options = {
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 1,
        barThickness: 0.5
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'right'
      },
      title: {
        display: true,
        text: `Sentiment Analysis Result of Conversation ID #${props.data.conversationId}`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Percentage of sentiment"
        },
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  }

  const sentimentData = [
    props.data.sentimentData.positive,
    props.data.sentimentData.neutral,
    props.data.sentimentData.negative,
  ]
  const labels = ['positive', 'neutral', 'negative']
  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: sentimentData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  return (
    <div className={classes.chart_container}>
      <Bar options={options} data={data} />
    </div>
  )
}

export default Conversation
