
let ctx = document.getElementById("resultsChart").getContext('2d');
let resultsChart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
        labels: ["Google.com", "WebAir.tk", "MSN.com"],
        datasets: [{
            label: '# of Votes',
            data: [0,0,0],
            backgroundColor: [
                'rgba(244, 67, 54, 0.2)', //Secretly #F44336
                'rgba(30, 136, 229, 0.2)', //Covertly #1E88E5
                'rgba(253, 216, 53, 0.2)', //Blatently #FDD835
            ],
            borderColor: [
                'rgba(244, 67, 54, 1)', // I can't believe it's not #F44336
                'rgba(30, 136, 229, 1)', // ♫ I'm #1E88E5, da ba dee da ba daa... ♫
                'rgba(253, 216, 53, 1)', // 👏 # 👏 F 👏 D 👏 D 👏 8 👏 3 👏 5 👏
            ],
            borderWidth: 1
        }]
    },
  
    options: {
        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
    
});

function submit(colour){
  //These results are 110% safe against election fraud.
  let url = "https://wt-a2f50f91fada7f05131c207a29276c24-0.sandbox.auth0-extend.com/r-b-y-vote?colour=";
  url += colour;
  
  axios.get(url)
  .then(function (response) {
    updateUI(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
}

function updateUI(data){
  document.getElementById('buttons').style.display = 'none';
  
  resultsChart.data.datasets[0].data = [data.red, data.blue, data.yellow];
  resultsChart.update();
  
  document.getElementById('results').style.display = 'block';
}