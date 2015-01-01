$(function() {

	var actlimit = eval($('[name=actlimit]').val());

	
	///main class
	function Pyramid () {
		this.month = 0;
		this.start = eval($('[name=start]').val());
		this.members = [];
		this.insertion = eval($('[name=insertion]').val());
		this.actlimit = eval($('[name=actlimit]').val());
		this.minsubgroup = eval($('[name=minsub]').val());
		this.paymonth = eval($('[name=paymonth]').val());
		this.regNewMembers = function(num){
			for (var i = 0; i < num; i++) {
				this.members.push( new Member());
			}
		}
		this.regNewMembers(this.start);
		
		this.getNewMembers = function(){
			var newMembers = [];
			this.members.forEach(function(member) {
				if(member.age==0)
					newMembers.push(member);
			})
			return newMembers;
		}
		this.getActiveMembers = function() {
			var activeMembers = [];
			this.members.forEach(function(member) {
				if (member.isActive() && member.age!=0)
					activeMembers.push(member);
			})
			return activeMembers;
		}
		this.getPaidMembers = function() {
			var paidMembers = [];
			this.members.forEach(function(member) {
				if (member.earn)
					paidMembers.push(member);
			})
			return paidMembers;
		}
	}
	//members
	function Member () {
		this.age = 0;
		this.subgroup = [];
		this.earn = false;
		this.isActive = function(){
			return (this.age <= actlimit);
		}
	}
	
	
	
	
	function start() {



		actlimit = eval($('[name=actlimit]').val());
		$('table tbody tr').remove();

		var pyramid = new Pyramid();

		//validate if input will let for an payment ever
		var zeroPayMent = false;
		if ((pyramid.minsubgroup > pyramid.insertion * actlimit)) {
			zeroPayMent = true;
		}

		var totalpop = eval($('[name=population]').val());
		while (pyramid.members.length < totalpop ) { //loop for every month
			pyramid.month++;
			//every active members add new members at each month
			var members = pyramid.members;
			members.forEach(function(member){
				member.age++;
				if(member.isActive()){
					for (var i = 0; (i < pyramid.insertion && pyramid.members.length < totalpop); i++) {
						var newMember =  new Member();
						member.subgroup.push(newMember);
						pyramid.members.push(newMember);
					}
				}
				if (member.age > pyramid.paymonth && member.subgroup.length >= pyramid.minsubgroup)
					member.earn = (true);
			});

			var activeMembers = pyramid.getActiveMembers().length;
			var newMembers = pyramid.getNewMembers().length;
			var paidMembers = pyramid.getPaidMembers().length;
			addRow([ pyramid.month, activeMembers, newMembers ,(pyramid.members.length-(activeMembers+newMembers)),pyramid.members.length,paidMembers]);

			//for a massive population when memory allocation isn't an option, well we can easily calculate the rest using current available data
			if(pyramid.month>=pyramid.actlimit && (paidMembers||zeroPayMent)){
				massCalculation(pyramid.month,pyramid.insertion,pyramid.paymonth,totalpop);
				break;
			}
			
		}


		function massCalculation(month,insertion,paymonth,totalpop) { // we use this method from when the pattern comes out

			var members = valTD($('table tbody tr').eq(month-1),4);

			while ( members < totalpop) {
				var retired = valTD($('table tbody tr').eq(month-actlimit),1);
				var activeMembers = members-retired;
				var newMembers =activeMembers*insertion;
				var paidPatternTr =$('table tbody tr').eq(month-paymonth);
				var paidMembers =zeroPayMent?"0":valTD(paidPatternTr,1)+valTD(paidPatternTr,3);
				members = activeMembers + newMembers;
				if(members>totalpop){
					members=totalpop;
					newMembers = totalpop - activeMembers;
				}
				month++;
				addRow([ month, activeMembers, newMembers ,retired,members,paidMembers]);
			}

			
		}
	}
	
	function addRow(items) {
		var row = $('<tr>');
		var cell = $('<td>');
		items.forEach(function(item) {
			row.append(cell.clone().text(ep1000(item)));
		});
		$('table tbody').append(row);
	}

	
	var ep1000=function(str){ // seperate numbers by 3 and add ,
		return String(str).replace(/(\d)(?=(\d{3})+\b)/g,'$&,');
	}
	
	
	$('#start').click(function() {
		console.log('starting');
		start();
		initChart();

	})

	function valTD (td,index){
		return new Number(td.find('td').eq(index).text().replace(/[^0-9]/g,""));
	}
	
	
	/// chart
	function initChart(){
		
		
		
		var chartData = {
			    labels: $('table tbody tr').map(function(i,elm){
	            	return valTD($(elm),0);
	            }),
			    datasets: [
			        {
			            label: "Active Members",
			            fillColor: "rgba(239, 255, 2, 0.2)",
			            strokeColor: "rgba(239, 255, 2, 1)",
			            pointColor: "rgba(239, 255, 2, 1)",
			            pointStrokeColor: "#fff",
			            pointHighlightFill: "#fff",
			            pointHighlightStroke: "rgba(239, 255, 2, 1)",
			            data: $('table tbody tr').map(function(i,elm){
			            	return valTD($(elm),1);
			            })
			        },
			        {
			            label: "New Members",
			            fillColor: "rgba(81, 80, 80, 0.2)",
			            strokeColor: "rgba(151,187,205,1)",
			            pointColor: "rgba(151,187,205,1)",
			            pointStrokeColor: "#fff",
			            pointHighlightFill: "#fff",
			            pointHighlightStroke: "rgba(151,187,205,1)",
			            data: $('table tbody tr').map(function(i,elm){
			            	return valTD($(elm),2);
			            })
			        },
			        {
			            label: "Retired Members",
			            fillColor: "rgba(255, 8, 8, 0.2)",
			            strokeColor: "rgba(255, 8, 8, 1)",
			            pointColor: "rgba(255, 8, 8, 1)",
			            pointStrokeColor: "#fff",
			            pointHighlightFill: "#fff",
			            pointHighlightStroke: "rgba(255, 8, 8, 1)",
			            data: $('table tbody tr').map(function(i,elm){
			            	return valTD($(elm),3);
			            })
			        },
			        {
			            label: "Total Members",
			            fillColor: "rgba(0, 0, 0, 0.2)",
			            strokeColor: "rgba(0, 0, 0, 0.2)",
			            pointColor: "rgba(0, 0, 0, 0.2)",
			            pointStrokeColor: "#fff",
			            pointHighlightFill: "#fff",
			            pointHighlightStroke: "rgba(0, 0, 0, 0.2)",
			            data: $('table tbody tr').map(function(i,elm){
			            	return valTD($(elm),4);
			            })
			        },
			        {
			            label: "Members Being Paid",
			            fillColor: "rgba(32, 244, 8, 0.2)",
			            strokeColor: "rgba(32, 244, 8, 1)",
			            pointColor: "rgba(32, 244, 8, 1)",
			            pointStrokeColor: "#fff",
			            pointHighlightFill: "#fff",
			            pointHighlightStroke: "rgba(32, 244, 8, 1)",
			            data: $('table tbody tr').map(function(i,elm){
			            	return valTD($(elm),5);
			            })
			        }
			    ]
			};
		
		var ctx = $("#chart").get(0).getContext("2d");
		var myNewChart = new Chart(ctx);
		new Chart(ctx).Line(chartData, {
		});	}
	
	Chart.defaults.global.responsive = true;
});