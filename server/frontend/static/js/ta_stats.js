   
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

google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(drawTitleSubtitle);

function drawTitleSubtitle() {
      var data = new google.visualization.DataTable();
      data.addColumn('timeofday', 'Time of Day');
      data.addColumn('number', 'Motivation Level');
      data.addColumn('number', 'Energy Level');

      data.addRows([
        [{v: [8, 0, 0], f: '8 am'}, 1, .25],
        [{v: [9, 0, 0], f: '9 am'}, 2, .5],
        [{v: [10, 0, 0], f:'10 am'}, 3, 1],
        [{v: [11, 0, 0], f: '11 am'}, 4, 2.25],
        [{v: [12, 0, 0], f: '12 pm'}, 5, 2.25],
        [{v: [13, 0, 0], f: '1 pm'}, 6, 3],
        [{v: [14, 0, 0], f: '2 pm'}, 7, 4],
        [{v: [15, 0, 0], f: '3 pm'}, 8, 5.25],
        [{v: [16, 0, 0], f: '4 pm'}, 9, 7.5],
        [{v: [17, 0, 0], f: '5 pm'}, 10, 10],
      ]);

      var options = {
        chart: {
          title: 'Score distribution',
        },
        hAxis: {
          title: 'Score',
          format: 'h:mm a',
          viewWindow: {
            min: [7, 30, 0],
            max: [17, 30, 0]
          }
        },
        vAxis: {
          title: 'Frequency'
        }
      };

      var material = new google.charts.Bar(document.getElementById('chart_div'));
      material.draw(data, options);
    }


