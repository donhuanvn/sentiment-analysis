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

import classes from './SentimentChartVertical.module.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function SentimentChartVertical(props) {
  const options = {
    elements: {
      bar: { borderWidth: 1, barThickness: 0.5 },
    },
    responsive: true,
    aspectRatio: 1,
    plugins: {
      legend: { display: false, position: 'right' },
      title: {
        display: true,
        text: `Sentiment Analysis Result`,
      },
    },
    scales: {
      y: {
        title: { display: true, text: "Percentage of sentiment" },
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  }

  const sentimentData = [
    props.data.sentimentData.negative,
    props.data.sentimentData.neutral,
    props.data.sentimentData.positive,
  ]
  const labels = ['negative', 'neutral', 'positive']
  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: sentimentData,
        borderColor: [
          'rgba(20, 20, 20, 0.7)',
          'rgba(7, 52, 250, 0.7)',
          'rgba(255, 99, 132, 0.7)'
        ],
        backgroundColor: [
          'rgba(20, 20, 20, 0.4)',
          'rgba(7, 52, 250, 0.4)',
          'rgba(255, 99, 132, 0.4)'
        ],
      }
    ],
  };

  return (
    <div className={classes.container}>
      <Bar options={options} data={data} />
    </div>
  )
}

export default SentimentChartVertical
