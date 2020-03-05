
function jsonKeys(data){
  var result = [];
  for(i=0, n=data.length; i<n; i++){
    result.push(d3.keys(data[i]));
  }
  return result;
}


function totalPerTeam(team, data){
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  var dates = d3.keys(data);
  var result = [];
  for(i=0, n=dates.length; i<n; i++){
    values = d3.values(data[dates[i]][team]);
    result.push(values.reduce(reducer));
  }
  return result;

}
function formatDatas(data){
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  result = {};
  result["Total"]=[];
  allTeams = jsonTeams(data);
  for(j=0, m=allTeams.length; j<m; j++){
    result[allTeams[j]] = [];
  }
  dates = d3.keys(data);
  for(i=0, n=dates.length; i<n; i++){
    result["Total"].push({"date" : dates[i], "totalTeams": 0});
    distinctTeams = d3.keys(data[dates[i]]);
    for(k=0, l=distinctTeams.length; k<l; k++){
      tempTotal = d3.values(data[dates[i]][distinctTeams[k]]).reduce(reducer);
      result[distinctTeams[k]].push({"date" : dates[i], "totalTeams" : tempTotal});
      result["Total"][i]["totalTeams"]= result["Total"][i]["totalTeams"]+tempTotal;
    }
  }

  return result;

}
function totalStock(data){
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  var total =[];
  dates = d3.keys(data);
  for(i=0, n=dates.length; i<n; i++){
    total[i]=0;
    teams = d3.keys(data[dates[i]]);
    for(j=0,m=teams.length; j<m; j++){
      values = d3.values(data[dates[i]][teams[j]]);
      total[i] = total[i]+values.reduce(reducer);
    }
  }

  return total;
}

function jsonTeams(data){
  var keys;
  var teams = ["Total"];
  var dates = d3.keys(data);
  for(i=0, n=dates.length; i<n; i++){
    keys = d3.keys(data[dates[i]]);
    for(j=0, m=keys.length; j<m; j++){
      if(!teams.includes(keys[j])){
        teams.push(keys[j]);
      }
    }
  }
  return teams;
}

function drawLineChart(){
  var margin = {top:10, right:30, bottom:30, left:60},
                width =  460 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;
  var svg = d3.select("#stockVariations").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate("+ margin.left + "," + margin.top+")");

  //read json file.
  d3.json("stockData.json" , (error, data) => {
    if(error) throw error;
    var allTeams = jsonTeams(data);
    d3.select("#selectButton").selectAll("myOptions").data(allTeams).enter().append('option').text(function(d){return d;}).attr("value", function(d){return d;})

    var myColor = d3.scaleOrdinal().domain(allTeams).range(d3.schemeSet2);

    dates = d3.keys(data);
    // alert(dates);
    totalTeams = totalStock(data);
    // alert(totalTeams);
    var dict = {};
    dict.dates = dates;
    dict.totalTeams = totalTeams;
    // alert(d3.keys(dict));
    minXScale = Math.min(10, dates.length);
    maxYScale = Math.max.apply(Math, totalTeams);

    domain = d3.extent(dates , function(d){return d;});
    var parseTime = d3.timeParse("%Y/%m");
    alert(width);
    var x = d3.scaleTime().domain(d3.extent(dates, function(d){return parseTime(d);})).range([0, width]);
    var x_axis = d3.axisBottom(x);
    var xFormat = "%Y/%b";



    svg.append("g").attr("transform", "translate(0," +height+ ")")
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat(xFormat)));

    // svg.append("g").attr("transform" , "translate(0," + height + ")").call(d3.axisBottom(x).ticks(10));

    var y = d3.scaleLinear().domain([0, maxYScale]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));


    allLines = formatDatas(data);
    initialLine = allLines["Total"];
    var line = svg.append('g')
    .append("path")
    .datum(initialLine)
    .attr("d", d3.line()
      .x(function(d){return x(parseTime(d.date))})
      .y(function(d){return y(d.totalTeams);}))
    .attr("stroke", function(d){return myColor("valueA") })
    .style("stroke-width", 4)
    .style("fill", "none");





    function update(selectedTeam){
      var dataFilter = allLines[selectedTeam];
      line.datum(dataFilter)
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .x(function(d){return x(parseTime(d.date))})
        .y(function(d){return y(d.totalTeams);}))
      .attr("stroke", function(d){return myColor(selectedTeam) })

    }

    d3.select("#selectButton").on("change", function(d){
      var selectedOption = d3.select(this).property("value")
      update(selectedOption)
    })
  });


}

drawLineChart();
