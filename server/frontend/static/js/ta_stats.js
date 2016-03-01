   
  $(document).ready(function() {
    var score_list = [1,2,3,4,6,7,8];
    var assignment_title='Here is your title';
    var submitted_count=0;
    var total_students=0;
    $.ajax({
    url : "/ta_stats",
    method : "GET",
    data : {
      _id:getcookie("_id"),
      _assignment_id:getcookie("_assignment_id")
    },
    error : function(data, status, error) {
      console.log("ERROR : " + data + error);
    },
    success : function(data, status) {
      var returnedData = data.status;
      if(status == true) {
        assignment_title=data.title;
        visibility_status=data.status;
        submitted_count=data.total_submissions;
        student_count=data.total_students;
        score_list=data.marks;
        
      }
      
    }
  });

    addLoadEvent(function() {  
      document.getElementById('title').innerHTML = assignment_title;
    });  


    addLoadEvent(function() {  
      document.getElementById('submissions_count').innerHTML = submitted_count+'/'+total_students;
    });  


    addLoadEvent(function() {  
      document.getElementById('mean_value').innerHTML = mean(score_list);
    });  

    addLoadEvent(function() {  
      document.getElementById('median_value').innerHTML = median(score_list);
    });  

    addLoadEvent(function() {  
      document.getElementById('min_value').innerHTML = Math.min.apply(Math,score_list);
    });  

    addLoadEvent(function() {  
      document.getElementById('max_value').innerHTML = Math.max.apply(Math, score_list);
    });  


 
});

function addLoadEvent(func) {  
    var oldonload = window.onload;  
    if (typeof window.onload != 'function') {  
      window.onload = func;  
    } else {  
      window.onload = function() {  
        if (oldonload) {  
          oldonload();  
        }  
        func();  
      }  
    }  
}  
   
function mean(values){

  var sum = values.reduce(function(a, b) { return a + b; });
  var avg = sum / values.length;
  return Math.round(avg * 100) / 100
}

function median(values) {

    values.sort( function(a,b) {return a - b;} );

    var half = Math.floor(values.length/2);

    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}


google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Dinosaur', 'Length'],
    ['Acrocanthosaurus (top-spined lizard)', 12.2],
    ['Albertosaurus (Alberta lizard)', 9.1],
    ['Allosaurus (other lizard)', 12.2],
    ['Apatosaurus (deceptive lizard)', 22.9],
    ['Archaeopteryx (ancient wing)', 0.9],
    ['Argentinosaurus (Argentina lizard)', 36.6],
    ['Baryonyx (heavy claws)', 9.1],
    ['Brachiosaurus (arm lizard)', 30.5],
    ['Ceratosaurus (horned lizard)', 6.1],
    ['Coelophysis (hollow form)', 2.7],
    ['Compsognathus (elegant jaw)', 0.9],
    ['Deinonychus (terrible claw)', 2.7],
    ['Diplodocus (double beam)', 27.1],
    ['Dromicelomimus (emu mimic)', 3.4],
    ['Gallimimus (fowl mimic)', 5.5],
    ['Mamenchisaurus (Mamenchi lizard)', 21.0],
    ['Megalosaurus (big lizard)', 7.9],
    ['Microvenator (small hunter)', 1.2],
    ['Ornithomimus (bird mimic)', 4.6],
    ['Oviraptor (egg robber)', 1.5],
    ['Plateosaurus (flat lizard)', 7.9],
    ['Sauronithoides (narrow-clawed lizard)', 2.0],
    ['Seismosaurus (tremor lizard)', 45.7],
    ['Spinosaurus (spiny lizard)', 12.2],
    ['Supersaurus (super lizard)', 30.5],
    ['Tyrannosaurus (tyrant lizard)', 15.2],
    ['Ultrasaurus (ultra lizard)', 30.5],
    ['Velociraptor (swift robber)', 1.8]]);

  var options = {
    title: 'Lengths of dinosaurs, in meters',
    legend: { position: 'none' },
  };

  var chart = new google.visualization.Histogram(document.getElementById('chart_div'));
  chart.draw(data, options);
}
