d3.json('../geocodes.json', function (error1,geocodes) {

	if (error1) {
		console.log("Error loading geocodes:", error1);
	}

d3.json('../households.json', function (error2,households) {

if (error2) {
	console.log("Error loading households:", error2);
}

  function tabulate(data, columns) {

/*
	data.forEach(function(d) {
		d.caseids = +d.caseids.substring(0, 3);
	});
*/

var nestGeocodes = d3.nest()
	.key(function(d) { return d.id_GEOCODE_REGION_CODE * 100 + d.id_GEOCODE_DIVISION_CODE * 10 + d.id_GEOCODE_STATE_CODE * 1; })
	//.rollup(function(v) { return v.id_GEOCODE_STATE_LABEL; })
	.entries(geocodes);

	console.log(nestGeocodes);

var householdCountByState = d3.nest()
	.key(function(d) { return d.id_REGION_CODE * 100 + d.id_DIVISION_CODE * 10 + d.id_STATE_CODE * 1; })
	.rollup(function(v) { return v.length; })
	.entries(households)
	.map(function(group) {
		return {
			'Geocode': group.key,
			'Synchronized': group.values
		}
	});


	console.log(householdCountByState);

	householdCountByState.forEach(function(householdCountByState) {
    var result = nestGeocodes.filter(function(geocode) {
        return geocode.key === householdCountByState.Geocode;
    });
    //delete householdCountByState.brand_id;
    householdCountByState.State = (result[0] !== undefined) ? result[0].values[0].id_GEOCODE_STATE_LABEL : null;
	});
	
	console.log(householdCountByState);






//	var temp1 = d3.nest()
//  	.key(function(d) { return d.caseids; })
//  	.rollup(function(v) { return v.length; })
//		.entries(data);
		


		
		var table = d3.select('body').append('table')
		var thead = table.append('thead')
		var	tbody = table.append('tbody');

		// append the header row
		thead.append('tr')
		  .selectAll('th')
		  .data(columns).enter()
		  .append('th')
		    .text(function (column) { return column; });

		// create a row for each object in the data
		var rows = tbody.selectAll('tr')
		  .data(householdCountByState)
		  .enter()
		  .append('tr');

		// create a cell in each row for each column
		var cells = rows.selectAll('td')
		  .data(function (row) {
		    return columns.map(function (column) {
		      return {column: column, value: row[column]};
		    });
		  })
		  .enter()
		  .append('td')
		    .text(function (d) { return d.value; });

	  return table;
	}

	//console.log(data);

	// render the table(s)
	//tabulate(households, ['id_REGION_CODE', 'id_DIVISION_CODE', 'id_STATE_CODE'
	//,'questionnaire']); // 2 column table
 tabulate(households, ['Geocode', 'State', 'Synchronized']); // 2 column table

}); // households
}); // geocodes
