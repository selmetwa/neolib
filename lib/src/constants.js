export const singleLineCharts = [{
    title: "Millitary Spending in Billions",
    fileName: "millitary",
    time: "date",
    yValue: " Billions of US $"
  },
  {
    title: "National Debt",
    fileName: "debt",
    time: "DATE",
    yValue: "FYGFD",
  },
  {
    title: "Union Membership",
    fileName: "unions",
    time: "Time",
    yValue: "Value",
  },
  {
    title: "Top Marginal Tax Rate",
    fileName: "top_taxes",
    time: "Date",
    yValue: "Rate",
  },
]

/*
      <DoubleLineChart
        title='Productivity-median hourly compensation'
        time='year'
        fileName='productivity_wages'
        lineOne=' productivity'
        lineTwo=' wages'
        lineOneName='Productivity'
        lineTwoName='Wages'
      />
      <DoubleLineChart
        title='Productivity Growth'
        time='year'
        fileName='productivity'
        lineOne='  productivity growth'
        lineTwo='  wage growth'
        lineOneName='Productivity Growth'
        lineTwoName='Wage Growth'
      />
*/
export const doubleLineCharts = [{
      title: 'Productivity-median hourly compensation',
      time: 'year',
      fileName: 'productivity_wages',
      lineOne: ' productivity',
      lineTwo: ' wages',
      lineOneName: 'Productivity',
      lineTwoName: 'Wages'
    },
    {
      title: 'Productivity Growth',
      time: 'year',
      fileName: 'productivity',
      lineOne: '  productivity growth',
      lineTwo: '  wage growth',
      lineOneName: 'Productivity Growth',
      lineTwoName: 'Wage Growth',
    }
  ]
  // export default singleLineCharts