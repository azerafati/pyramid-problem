$(function() {


	
	///main class
	function Pyramid () {
		this.month = 1;
		this.members = eval($('[name=start]').val());
		this.activeMembers = this.members;
		this.insertion = eval($('[name=insertion]').val());
	}
	
	
	
	
	
	function start() {
		
		$('table tbody tr').remove();
		
		var pyramid = new Pyramid();
		
		var totalpop = eval($('[name=population]').val());
		
		while (pyramid.members < totalpop) {
			addRow([ pyramid.month, pyramid.members ]);
			pyramid.members += pyramid.activeMembers * pyramid.insertion;
			pyramid.month++;
		}
	}

	function addRow(items) {
		var row = $('<tr>');
		var cell = $('<td>');
		items.forEach(function(item) {
			row.append(cell.clone().text(item));
		});
		$('table tbody').append(row);
	}

	$('#start').click(function() {
		console.log('starting');
		start();
	})
});