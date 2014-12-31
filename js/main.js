$(function(){


	function start (){
		var pyramid={
				month=0,
				members= $('[name=start]').val()

		} 
		var totalpop = $('[name=population]').val();
		while(pyramid<totalpop){
			addRow([month,members]);
		}
	}

	function addRow(items){
		var row = $('<tr>');
		var cell = $('<td>');
		for(var item in items){
			row.append(cell.clone.text(item));
		}
		$('table tbody').append(row);
	}

	$('#start').click(){
		console.log('starting');
		start();
	}
});