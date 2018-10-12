
if(localStorage.getItem('Token') == null){
  $('.sansur').css('display','none')
}else{
    baslat(localStorage.getItem('Token'),localStorage.getItem('Nick'));
}


function girisyap() {

if(localStorage.getItem('Token') == null){
console.log("ilk kez giriş yapıyor");
$( ".sorgu" ).wrap( '<div class="animated-background 12"></div>' );
width = $('.sorgu').width();
height = $( ".sorgu" ).height();
$( ".sorgu" ).hide()
$('.12').css('height',height);
$('.12').css('width',width);
tokenal()
}else{
  console.log("zaten kayıtlı ana sayfaya yönlendiliriyor");
    baslat(localStorage.getItem('Token'),localStorage.getItem('Nick'));
}

}

function tokenal() {
  $.ajax({
              url: "https://cors-anywhere.herokuapp.com/https://api.eksisozluk.com/token",
              type: 'POST',
              dataType: 'json',
              data:{'grant_type':'password','username':$('#form1-username').val(),'password':$('#form2-password').val(),'client_secret': '6cba2458-6fa8-4c55-8d72-78620542e43d'},
              contentType: 'application/json; charset=utf-8',
              success: function (result) {
                console.log(result);
                localStorage.setItem('Token', result.access_token);
                localStorage.setItem('Nick', result.nick);
                baslat(result.access_token,result.nick);
              },
              error: function (error) {
                  console.log("hata");
                  $('body').append('<div class="alert alert-accent alert-dismissible fade show mb-0 uyari" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><i class="fa fa-info mx-2"></i><strong>Hatalı Şifre ya da kullanıcı adı lütfen tekrar deneyiniz</div>')
                  $('.uyari').insertAfter('.sansur');
                  var cnt = $(".21").contents();
                  $(".21").replaceWith(cnt);
                  $( ".sorgu" ).show()
              }
          });
}




function baslat(token,nick) {

  $.ajax({
              url: "https://api.eksisozluk.com/v1/user/" + nick,
              type: 'GET',
              dataType: 'json',
              headers: {
      "authorization":"bearer " + token
    },
              contentType: 'application/json; charset=utf-8',
              success: function (result) {
                console.log(result)
                sonuc = result;
                verikaydet(sonuc);
                $('.arka').css('display','block')
                $('.giris').css('display','none')
                $('.sansur').css('display','none')
              },
              error: function (error) {
                $('.sansur').css('display','none')
                localStorage.removeItem("Token");
                localStorage.removeItem("Nick");
              }
          });
}

function yarak() {
  localStorage.removeItem('Buyuksira');
  localStorage.removeItem('Token');
  localStorage.removeItem('Nick');
  $('.arka').hide()
  $('.giris').show()
  $('.sorgu').show()
}



tarih = ""
veri = []
function verikaydet(sonuc) {

  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var date = d.getDate();
  var hour = d.getHours();
  var min = d.getMinutes();
  tarih = date + "." + month + "." + year + "/" + hour + ":" + min;

if(localStorage.getItem('Buyuksira') == null){
  localStorage.setItem("Buyuksira",'[{"'+tarih +'":"'+ sonuc.UserInfo.StandingQueueNumber +'"}]');
  veri = JSON.parse(localStorage.getItem('Buyuksira'));
    ekle();
  render(tarihler,veriler);
    kucukrender(veri,tarihler,veriler)
  console.log("ilk açış")
}else{
  veri = JSON.parse(localStorage.getItem('Buyuksira'));
  if(Object.values(veri[veri.length-1]) == sonuc.UserInfo.StandingQueueNumber){
      console.log("Sıralama değişmemiş")
        ekle();
    render(tarihler,veriler)
    kucukrender(veri,tarihler,veriler)
  }else{

      veri[veri.length] = {[tarih]: JSON.stringify(sonuc.UserInfo.StandingQueueNumber)}
      localStorage.setItem('Buyuksira', JSON.stringify(veri));
            ekle()
      console.log("eklendi");
      render(tarihler,veriler);
      kucukrender(veri,tarihler,veriler)

  }
}
}


function ekle() {
  for (var i = 0; i < veri.length; i++) {
    tarihler[i] = Object.keys(veri[i]);
    veriler[i] = Object.values(veri[i]);
  }
}

tarihler = [];
veriler = [];
kucukveriler = []

function yuzdebul(oldNumber, newNumber){
    var decreaseValue = oldNumber - newNumber;

    return (decreaseValue / oldNumber) * 100;
}


function yuzde(kucukveri) {

  $('body > div > main > div > div:nth-child(2) > div:nth-child(1) > div > div > div.d-flex.flex-column.m-auto > div:nth-child(2) > span').html(Math.round(yuzdebul(kucukveri[5],kucukveri[6]) * 100) / 100 +'%');



  if(Math.round(yuzdebul(kucukveri[5],kucukveri[6]) * 100) / 100 > 0){

    $('body > div > main > div > div:nth-child(2) > div > div > div > div.d-flex.flex-column.m-auto > div:nth-child(2) > span').addClass('stats-small__percentage--increase')
    backgroundColor= 'rgba(0, 184, 216, 0.1)'
    borderColor= 'rgb(0, 184, 216)'
  }else{

    $('body > div > main > div > div:nth-child(2) > div > div > div > div.d-flex.flex-column.m-auto > div:nth-child(2) > span').addClass('stats-small__percentage--decrease')
    backgroundColor = 'rgba(255,65,105,0.1)';
    borderColor =  'rgb(255,65,105)';
  }
}

function kucukrender(veri,tarihler,veriler) {
  $('.siralama').html(sonuc.UserInfo.StandingQueueNumber)
  tersveri = veri.reverse();
console.log(veri.length)
  if(veri.length < 7){
    siralama = [0,0,0,0,0,0,0]
  }else{
    console.log(tersveri)
    for (var i = 0; i < 7; i++) {
      kucukveri = Math.ceil(Object.values(tersveri[i]) / 10) * 10;
      kucukveri = kucukveri.toString();
      kucukveri = kucukveri.slice(0, 1) + "." + kucukveri.slice(1);
      kucukveriler[i] = kucukveri
    }

    siralama = kucukveriler.reverse();
      yuzde(kucukveriler);
  }

  backgroundColor =  'rgba(23,198,113,0.1)'
  borderColor =  'rgb(23,198,113)'


  var boSmallStatsDatasets = [
    {
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      data: siralama,
    }/*,
    {
      backgroundColor: 'rgba(23,198,113,0.1)',
      borderColor: 'rgb(23,198,113)',
      data: [1, 2, 3, 3, 3, 4, 4]
    },
    {
      backgroundColor: 'rgba(255,180,0,0.1)',
      borderColor: 'rgb(255,180,0)',
      data: [5, 3, 3, 3, 4, 3, 3]
    },
    {
      backgroundColor: 'rgba(255,65,105,0.1)',
      borderColor: 'rgb(255,65,105)',
      data: [1, 7, 1, 3, 1, 4, 8]
    },
    {
      backgroundColor: 'rgb(0,123,255,0.1)',
      borderColor: 'rgb(0,123,255)',
      data: [3, 2, 3, 2, 4, 5, 4]
    }*/
  ];

  // Options
  function boSmallStatsOptions(max) {
    return {
      maintainAspectRatio: true,
      responsive: true,
      // Uncomment the following line in order to disable the animations.
      // animation: false,
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
        custom: false
      },
      elements: {
        point: {
          radius: 0
        },
        line: {
          tension: 0.3
        }
      },
      scales: {
        xAxes: [{
          gridLines: false,
          scaleLabel: false,
          ticks: {
            display: false
          }
        }],
        yAxes: [{
          gridLines: false,
          scaleLabel: false,
          ticks: {
            display: false,
            // Avoid getting the graph line cut of at the top of the canvas.
            // Chart.js bug link: https://github.com/chartjs/Chart.js/issues/4790
            suggestedMax: max
          }
        }],
      },
    };
  }

  // Generate the small charts
  boSmallStatsDatasets.map(function (el, index) {
    var chartOptions = boSmallStatsOptions(Math.max.apply(Math, el.data) + 1);
    var ctx = document.getElementsByClassName('blog-overview-stats-small-' + (index + 1));
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5", "Label 6", "Label 7"],
        datasets: [{
          label: 'Today',
          fill: 'start',
          data: el.data,
          backgroundColor: el.backgroundColor,
          borderColor: el.borderColor,
          borderWidth: 1.5,
        }]
      },
      options: chartOptions
    });
  });

}








function render(tarihler,veriler) {
  console.log(veriler)
var bouCtx = document.getElementsByClassName('blog-overview-users')[0];
  var bouData = {
    // Generate the days labels on the X axis.

    labels: tarihler,
    datasets: [{
      label: 'Ölçüm',
      fill: 'start',
      data: veriler,
      backgroundColor: 'rgba(0,123,255,0.1)',
      borderColor: 'rgba(0,123,255,1)',
      pointBackgroundColor: '#ffffff',
      pointHoverBackgroundColor: 'rgb(0,123,255)',
      borderWidth: 1.5,
      pointRadius: 0,
      pointHoverRadius: 3
    }]
  };

  // Options
  var bouOptions = {
    responsive: true,
    legend: {
      position: 'top'
    },
    elements: {
      line: {
        // A higher value makes the line look skewed at this ratio.
        tension: 0.3
      },
      point: {
        radius: 0
      }
    },
    scales: {
      xAxes: [{
        gridLines: false,
        ticks: {
          callback: function (tick, index) {
            // Jump every 7 values on the X axis labels to avoid clutter.
            return index % 2 !== 0 ? '' : tick;
          }
        }
      }],
      yAxes: [{
        ticks: {
          suggestedMax: 45,
          callback: function (tick, index, ticks) {
            if (tick === 0) {
              return tick;
            }
            // Format the amounts using Ks for thousands.
            return tick > 999 ? (tick/ 1000).toFixed(1) + 'K' : tick;
          }
        }
      }]
    },
    // Uncomment the next lines in order to disable the animations.
    // animation: {
    //   duration: 0
    // },
    hover: {
      mode: 'nearest',
      intersect: false
    },
    tooltips: {
      custom: false,
      mode: 'nearest',
      intersect: false
    }
  };

  // Generate the Analytics Overview chart.
  window.BlogOverviewUsers = new Chart(bouCtx, {
    type: 'LineWithLine',
    data: bouData,
    options: bouOptions
  });

  // Hide initially the first and last analytics overview chart points.
  // They can still be triggered on hover.
  var aocMeta = BlogOverviewUsers.getDatasetMeta(0);
  aocMeta.data[0]._model.radius = 0;
  aocMeta.data[bouData.datasets[0].data.length - 1]._model.radius = 0;

  // Render the chart.
  window.BlogOverviewUsers.render();
  var cnt = $(".animated-background").contents();
  $(".animated-background").replaceWith(cnt);

  var cnt = $(".animated-background2").contents();
  $(".animated-background2").replaceWith(cnt);
  //
  // Users by device pie chart
  //

}
