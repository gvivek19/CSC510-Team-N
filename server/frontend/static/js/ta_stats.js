   
  $(document).ready(function() {
    var score_list = [0];
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
        graph_data=data.graph;

        google.charts.load('current', {packages: ['corechart', 'bar']});
        google.charts.setOnLoadCallback(drawDualY);
        
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



function drawDualY() {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Marks');
      data.addColumn('number','Frequency');

      data.addRows(graph_data);
      
      var options = {
        chart: {
          title: 'Score distribution'
        },
        hAxis: {
          title: 'Marks'
        },
        vAxis: {
          title: 'Frequency'
        }
      };
      

      var material = new google.charts.Bar(document.getElementById('chart_div'));
      material.draw(data, options);
 }
