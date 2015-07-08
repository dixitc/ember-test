
window.App = Ember.Application.create({
    LOG_TRANSITIONS: true,
    LOG_TRANSITIONS_INTERNAL: true,
    LOG_VIEW_LOOKUPS: true
});

//***********************************************************************************
//				Ember Transition try
//**********************************************************************************

App.AnimatedRoute = Ember.Route.extend({
  _transitioning: false,
  willExit: function() { return Ember.RSVP.resolve(); },
  willEnter: function() { return Ember.RSVP.resolve(); },

  deactivate: function() { this._transitioning = false; },

  afterModel: function(model, transition) {
    var route = this
    transition.then(function() {
      new Ember.RSVP.Promise(function(resolve, _) {
        Ember.run.next(this, function() {
          route.willEnter().then(resolve);
        });
      });
    });

    this._super.apply(this, arguments);
  },

  actions: {
    willTransition: function(transition) {
      var routeNames = transition.handlerInfos.map(function(o) {
        return o.name;
      });
      var isParent = routeNames.indexOf(this.routeName) > -1;
      if (isParent) { return true; }
      if (this._transitioning) { return true; }

      this._transitioning = true;
      transition.abort();
      this.willExit().then(function() { transition.retry(); });
    }
  }
});

App.BasicRoute = App.AnimatedRoute.extend({
  willEnter: function() {
    console.log("ENTER");
    return $('.outlet').fadeIn().promise();
  },
  willExit: function() {
    console.log("EXIT");
    return $('.outlet').fadeOut().promise();
  }
});

Ember.Application.initializer({
  name: 'defaultRoute',
  initialize: function(container) {
    container.register('route:basic', App.BasicRoute);
  }
});

//***********************************************************************************
//   ember transition try ends
//***********************************************************************************


App.Store = DS.Store.extend({});
App.ApplicationAdapter = DS.FixtureAdapter;

/*App.ApplicationAdapter = DS.RESTAdapter.extend({
	host: 'http://172.16.1.168:3000'
})
*/


/*App.Store = DS.Store.extend({
	revision: 13,
	adapter: 'DS.FixtureAdapter'
});*/

App.User = DS.Model.extend({
	title: DS.attr('string')
});

App.Report = DS.Model.extend({
	name : DS.attr('string'),
	street : DS.attr('string'),
	city : DS.attr('string'),
	date : DS.attr('string'),
	person : DS.attr('string'),
	designation : DS.attr('string'),
	authorityperson : DS.attr('string'),
	authoritydesignation : DS.attr('string'),	
	satisfaction : DS.attr('number'),
	devices : DS.hasMany('device',{async : true}),
	products : DS.attr(),
	created : DS.attr('string'),
	sensors : DS.attr(),
	draft : DS.attr(),
	imgurl : DS.attr()
})

App.Newport = DS.Model.extend({
	name : DS.attr('string'),
	date : DS.attr('string'),
	person : DS.attr('string'),
	designation : DS.attr('string'),
	satisfaction : DS.attr('string'),
	newvices : DS.attr('newvice' , {async : true}),
	products : DS.attr(),
	sensors : DS.attr(),
	draft : DS.attr()
})

App.Newvice = DS.Model.extend({
	newport : DS.belongsTo('newport',{async : true}),
	modelNumber : DS.attr('number'),
	uniqueCode : DS.attr('number'),
	productName : DS.attr('string')
});

App.Device = DS.Model.extend({
	report : DS.belongsTo('report',{async : true}),
	modelNumber : DS.attr('number'),
	uniqueCode : DS.attr('number'),
	productName : DS.attr('string')
});


App.Client = DS.Model.extend({
    slug: DS.attr('string'),
    title: DS.attr('string')
    
});

App.Report.FIXTURES = [
	{ id:1,street : '98, Hal Airport Road' , city : 'Bengaluru' ,name : 'Manipal Hospital' , created : 'Dec 30, 2014 4:38:56 PM' , products : 4 , sensors : 2 , draft : true , devices : []},
	{ id:2 ,street : '98, Hal Airport Road' , city : 'Bengaluru' ,name : 'St Marthas Hospital' , created : 'Dec 30, 2014 4:38:56 PM' , products : 8 , sensors : 2 , draft : true , devices : [1,2] , person : "Anupam Shukla" , designation : "Assistant , Supplies" , satisfaction : 2},
	{ id:3 ,street : '98, Hal Airport Road' , city : 'Bengaluru' ,name : 'Beams Hospital' , created : 'Dec 30, 2014 4:38:56 PM' , products : 2 , sensors : 21 , draft : false , devices : [] , person : "Dixit" , designation : "Cook" , satisfaction : 2},
	{ id:4 ,street : '98, Hal Airport Road' , city : 'Bengaluru' ,name : 'Beams Hospital' , created : 'Dec 30, 2014 4:38:56 PM' , products : 6 , sensors : 2 , draft : false , devices : []}
]

App.Device.FIXTURES = [
	{ id:1,report: 2, modelNumber : 666 , uniqueCode : 666 , productName : 'superfartarato' },
	{ id:2 ,report: 2,modelNumber : 666 , uniqueCode : 666 , productName : 'superfartarato' }
]

App.Client.FIXTURES = [
	{ id: 1,slug: 'Masimo', title: '1071' },
	{ id: 2,slug: 'BPL', title: '142' }
];

App.User.FIXTURES = [
	{ id: 1, title: 'Rube Goldberg Breakfast-o-Matic' }
];




App.Router.map(function() {
	this.route('login');
	this.resource( 'user' , {path : '/user/:user_id'}, function(){
		this.route('home');
		this.route('clients');
		this.resource('client' , {path : '/client/:client_id'}, function(){
			this.route('report' , {path : 'report'});
			this.resource('edit' , {path  : '/edit/:edit_id'}, function(){
				this.route('device' , {path : '/device'});
				this.route('feedback' , {path : '/feedback'});
				this.route('signature' , {path : '/signature'});
			});
			this.resource('new' , {path : '/new'} , function(){
				this.route('device' , {path : '/device'});
				this.route('feedback' , {path : '/feedback'});
				this.route('signature' , {path : '/signature'});
			});
		});
	});

});


/*App.NewRoute  = Ember.Route.extend({
	model : function(params){
		var myreport = this.store.createRecord('report' ,{
			
			
		})
		var that = this;
		console.log(this.store.find('device'))
		myreport.get('devices').then(function(){
			// Now the devices array is available
			myreport.get('devices').addObject(this.store.find('device', 1));
		});
		myreport.set('id' , '5');
		myreport.set('name' , 'Leelavati');
		myreport.set('date' , 'Nov 9, 2014 6:30pm');
		myreport.set('products' , 4);
		myreport.set('sensors' , 2);
		myreport.set('draft' , false);
		
		myreport.save();
		this.store.find('report').then(function(myreports){
			console.log(myreports.get('length'));
			console.log(myreports);
			myreport.set('id' , (myreports.get('length')).toString());
			myreport.save();
		})
		
		this.store.find('device',1).then(function(mydevice){
			myreport.get('devices').then(function(mydevices){
				console.log(mydevice)
				mydevices.addObject(mydevice)
				console.log(myreport)
			})
		})
		var myreports = this.store.find('report');
		console.log((myreports.get('length')).toString())
		var moireport = {
			id:5
		}
		var that = this;
		this.store.createRecord('report' , moireport).save().then(function(persisted){
			console.log(that.store.find('report'));
			return persisted;
		})		
		console.log("new-route-model")
		


	
	

	//return basket;
	}
})
		*/

App.NewIndexRoute = Ember.Route.extend({


	renderTemplate: function() {
		this.render('edit/index', {
			controller: 'newIndex'
		});
	}	
})

App.NewIndexController = Ember.Controller.extend({
	needs : ['hospital'],
	selecthosp : false,
	editing : false,
	devicesarray : [],
	hospitals : [
		{ id:1,name : 'Manipal Hospital' , date : 'Nov 9, 2014 6:30pm' , devices : 4 , sensors : 2 , draft : true},
		{ id:2 ,name : 'Manipal Hospital' , date : 'Nov 9, 2014 6:30pm' , devices : 8 , sensors : 2 , draft : true},
		{ id:3 ,name : 'Beams Hospital' , date : 'Nov 9, 2014 6:30pm' , devices : 2 , sensors : 21 , draft : false},
		{ id:4 ,name : 'Beams Hospital' , date : 'Nov 9, 2014 6:30pm' , devices : 6 , sensors : 2 , draft : false}
	],
	date: function(){
	    var today = new Date();
	    var dd = today.getDate();
	    var mm = today.getMonth()+1; //January is 0!
	    var time = today.toLocaleTimeString()
	    var yyyy = today.getFullYear();
	    if(dd<10){
	        dd='0'+dd
	    } 
	    if(mm<10){
	        mm='0'+mm
	    } 
	    var today = dd+'/'+mm+'/'+yyyy;
	    var date = {day:dd,month:mm,year:yyyy,time:time}
	    return date
	},
	actions : {
		addReport : function(){
			this.transitionTo('client.report')
		},
		sethosp : function(params){
			console.log("NEWINDEXCONTROLLER SETHOSP");
			console.log(this.get('model'));
			console.log(this.store.all('newport'))
			console.log(params);
			var currmodel  = this.get('model');
			var that  = this;
			var today = new Date();
		    var today = new Date();
		    var dd = today.getDate();
			var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];		    
		    var mm = today.getMonth(); //January is 0!
		    var time = today.toLocaleTimeString()
		    var yyyy = today.getFullYear();			
			var date = monthNames[mm] +' '+dd+', '+yyyy+' '+time
			this.store.find('report' , params).then(function(myreport){
				console.log(currmodel.get('created'))
				that.get('model').set('created' ,date);
				that.get('model').set('name' ,myreport.get('name'));
				that.get('model').set('street' ,"98, Hal Airport Road");
				that.get('model').set('city' , 'Bengaluru');
				currmodel.save();
				console.log(that.store.find('report'))
			})
			this.set('selecthosp' , false);
			
		},
		selectstuff : function(){
			console.log("NEWINDEXCONTROLLER");
			console.log(this.get('model'))
			console.log(this.get('currentModel'))
			console.log("INSIDE SELECT STUFF");
			this.set('selecthosp' , true);
		},
		disableaction : function(){
			console.log("NEWINDEXCONTROLLER");
			console.log("blur cover being pressed");
			$('.focussed').css('height',myheight);
			$('.focussed').css('z-index',1);
			$('.focussed').removeClass('focussed');
			$('#action-icon').attr('src','plus.png');
			$('.action-options').css('opacity',0);
			$('.action-option-div').css('opacity',0);
			$('.blur-cover').fadeOut('slow');
			$('.action-options').css('-webkit-transform','scale(0.4)'); 
		},
		gotofeedback : function(model){
			console.log("NEWINDEXCONTROLLER");
			console.log("GOTOFEEDBACK")
			console.log(model)
			this.transitionTo('new.feedback' , model)
		},
		gotosignature : function(model){
			console.log("NEWINDEXCONTROLLER");
			console.log("GOTOSIGNATURE")
			console.log(model)
			this.transitionTo('new.signature' , model)
		},	
		gotodevice : function(params){
			console.log("NEWINDEXCONTROLLER");
			console.log("GOTODEVICE")
			console.log(params.get('id'));
			console.log(this.get('model'))
			this.transitionTo('new.device')
		},
		testbutton : function(){
			console.log("Controller working !")
			
			  /*$('.blur-cover').fadeIn(500)
			  $( ".map-view" ).animate({
			    
			    
			    height: "500px"
			    
			  }, 500, function() {
			    // Animation complete.
			    $( ".map-view" ).css('z-index',5)
			  }); */
			
			$('#action-button').toggleClass('active').promise().done(function(){
				$('.blur-cover').css('background-color','white');
				if($('#action-icon').attr('src') == 'plus.png'){
					$('#action-icon').attr('src','add.png');
					$('.blur-cover').fadeIn('slow')
					$('.action-options').css('opacity',1);
					$('.action-option-div').css('opacity',1);
					$('.action-option-div').css('opacity',1);
					$('.action-options').css('-webkit-transform','scale(1)');

				}else{
					$('#action-icon').attr('src','plus.png');
					$('.action-options').css('opacity',0);
					$('.blur-cover').fadeOut('slow')
					$('.action-options').css('-webkit-transform','scale(0.4)');
				}
			}); 
		},		
	}
})

App.NewDeviceRoute = Ember.Route.extend({
	model : function(){
		
		var fruit = this.store.createRecord('newvice', {
			
		})

		return fruit;
	},
	renderTemplate: function() {
		this.render('edit/device', {
			controller: 'newDevice'
		});
	},
	godel : function(){
		var array = []
		this.set('godel',array)
		return []
	}	
})

App.NewDeviceController = Ember.Controller.extend({
	actions : {
		upload:function(){
			console.log("in here dude")
			console.log(this.get('params'))
			$('#admyupload').click();
		},
		frikkinupload : function(theFile){
			console.log("frikkinupload")
			console.log(theFile)
			var array = $.map(theFile, function(value, index) {
				return [value];
			});
			console.log(array)
			this.set('godel', array);
		},		
		redirectdevice	: function(){
			this.transitionTo('new.index')
		},		
		addDevice : function(){
			console.log("NEWDEVICECONTROLLER");
			console.log('ADDING DEVICE');
			console.log(this.controllerFor('new.index').get('model').get('id'))
			console.log($('#admyupload')[0].files.length)
			console.log($('#admyupload')[0].files)
			console.log('GODEL');
			console.log(this.get('model'))


			//Setting up file upload variables
			var upload = false;
			var uploadName = null;
			var myfile = [];

			//Checking and initializing all the file upload stuff in the conditional
			if($('#admyupload')[0].files.length > 0){
				upload = true
				uploadName = $('#admyupload')[0].files[0].name
				console.log(this.get('godel').length)
				//pushing al files into myfile
				for (var i = this.get('godel').length - 1; i >= 0; i--) {
					myfile.push(this.get('godel')[i])
				};
				
				
			}


			

			var that = this;


			this.store.find('report' , 5).then(function(persisted){
			var moidevice =  {
	  			id: 3,
				fileUpload:upload,
				fileName:uploadName,
				file:myfile,				
	  			productName : ($('#productName').val()).toString(),
	  			modelNumber : $('#modelNo').val(),
	  			uniqueCode : $('#uniqueCode').val(),
	  			report : persisted
	  		}
		   that.store.createRecord('device', moidevice).save().then(function(apt) {
	    	persisted.get('devices').pushObject(apt);
		    persisted.save();
		  });	  		

		})

			console.log(this.store.find('report'));
		
			App.listController.set('model' , this.store.all('device'));

			console.log(this.store.all('device'))
			var array = []
			this.set('godel',array)
			console.log(this.store.find('report'))
			this.transitionTo('new.index')
		}
	}
})

App.NewFeedbackRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('edit/feedback', {
			controller: 'newFeedback'
		});
	}
})

App.NewFeedbackController = Ember.Controller.extend({
	feedbacksatisfaction : 0,
	actions : {
		selectsatisfaction : function(number){
			console.log("selectsatisfaction");
			var myid;
			myid = "#level-"+(this.feedbacksatisfaction).toString()
			$(myid).css('background-position-x',(parseInt($(myid).css('background-position-x'))+39).toString()+"px")
			myid = "#level-"+(number).toString()
			console.log((parseInt($(myid).css('background-position-x'))-39).toString()+"px");
			this.feedbacksatisfaction = number;
			$(myid).css('background-position-x',(parseInt($(myid).css('background-position-x'))-39).toString()+"px")
		},
		redirectfeedback : function(){

			this.transitionTo('new.index')
		},		
		savefeedback : function(){
			console.log("new-feedback-controller");
			console.log("savefeedback");
			console.log(this.get('feedbacksatisfaction'));
			console.log(this.controllerFor('new.index').get('model').get('id'))
			var that = this;
			this.store.find('report' , this.controllerFor('new.index').get('model').get('id')).then(function(report){
				report.set('designation', $('#modelNo').val().toString())
				report.set('person', $('#productName').val().toString())
				var me = 
				report.set('satisfaction', that.get('feedbacksatisfaction'))
				//report.save();
			})
			console.log(this.get('model'))
			this.transitionTo('new.index');
		}
	}
})

App.NewSignatureRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('edit/signature', {
			controller: 'newSignature'
		});
	}
})

App.NewSignatureController = Ember.Controller.extend({
	clicked : false,
	actions : {
		getcanvas : function(){
		},
		savesignature : function(){
			console.log("NEWSIGNATURECONTROLLER");
			console.log("saving signature");
			console.log(this.get('model'));
			this.transitionTo('new.index')
		},
		setSign : function(){
			console.log("setSign");
			var canvas = document.getElementById("mySignatureCanvas");
			var img    = canvas.toDataURL("image/png");
			this.get('model').set('imgurl',img);
			this.get('model').set('authoritydesignation',$('#modelNo').val().toString());
			this.get('model').set('authorityperson',$('#productName').val().toString());
			this.get('model').save();
			$('#myCanvas').empty();
			$('#canvas-bottom').remove();
			var newimg = '<img src="'+img+'">'
			$('#myCanvas').html(newimg);
			console.log(this.get('model'));
			console.log(img);
		},
		sign: function(){
			console.log(this.get('clicked'))
			$('#myCanvas').show();
			this.set('clicked' , true);
			console.log("Sign modal opened")
			var drawingStrokeValue=1;
			var eraseStrokeValue=1;
			$('#digitalSignature').show();
			var myheight = $('#myCanvas').height();
			var mywidth = $('#myCanvas').width();
			var newCanvas = '<canvas id="mySignatureCanvas" width='+mywidth+' height='+myheight+'>Your Browser does not support Canvas</canvas>';
			$('#myCanvas').html(newCanvas);
			
			
			var canvas = document.getElementById('mySignatureCanvas');
			var ctx  = canvas.getContext('2d');
			var drawingFlag=true;
			var eraseFlage=false;

			var mouse = {x: 0, y: 0};
			var last_mouse = {x: 0, y: 0};

			if (window.matchMedia('(max-width: 1000px)').matches) {
			        $('#digitalSignature').css('top','5%');
		    } else {
		     	$('#digitalSignature').css('top','15%');
		    }
		    var filterVal = 'blur(2px)';
			$(".mycontainer").css("webkitFilter",filterVal);
			$("#sec1").css("webkitFilter",filterVal);
			$("#sec7").css("webkitFilter",filterVal);
			$('.blur-cover').css('visibility','visible');
			$('.blur-cover').css('opacity',1);
			
			$('#signatureStrokeSizeButton').click(function(){
				drawingFlag=true;
				eraseFlage=false;
				onPaint;
				$('#customerSignatureSrokeSlider').toggle();
				$('#customerSignatureEraseSlider').hide();
			});

			$('#signatureEraseButton').click(function(){
				drawingFlag=false;
				eraseFlage=true;
				onPaint;
				$('#customerSignatureEraseSlider').toggle();
				$('#customerSignatureSrokeSlider').hide();
			});

			/* Mouse Capturing Work */
			canvas.addEventListener('mousemove', function(e) {
				last_mouse.x = mouse.x;
				last_mouse.y = mouse.y;
				var offsetValue=$(this).offset();
				mouse.x = e.pageX - offsetValue.left;
				mouse.y = e.pageY - offsetValue.top;
				e.preventDefault();
			}, false);

			canvas.addEventListener('mousedown', function(e) {
				$('#customerSignatureEraseSlider').hide();
				$('#customerSignatureSrokeSlider').hide();
				canvas.addEventListener('mousemove', onPaint, false);
				e.preventDefault();
			}, false); 

			canvas.addEventListener('mouseup', function(e) {
				canvas.removeEventListener('mousemove', onPaint, false);
				e.preventDefault();
			}, false);
			
			
			/* Touch Capturing Work */
			canvas.addEventListener('touchmove', function(e){
				var touchObject=e.changedTouches[0];
				var offsetValue=$(this).offset();
				last_mouse.x = mouse.x;
				last_mouse.y = mouse.y;
				mouse.x = parseInt(touchObject.pageX-offsetValue.left);
				mouse.y = parseInt(touchObject.pageY-offsetValue.top);
				e.preventDefault();
			}, false)

			/* Finger touch handelling */
			canvas.addEventListener('touchstart', function(e){
				$('#customerSignatureEraseSlider').hide();
				$('#customerSignatureSrokeSlider').hide();
				var touchObject=e.changedTouches[0];
				var offsetValue=$(this).offset();
				mouse.x = parseInt(touchObject.pageX-offsetValue.left);
				mouse.y = parseInt(touchObject.pageY-offsetValue.top);
				canvas.addEventListener('touchmove', onPaint, false);
				e.preventDefault();
			}, false)

			canvas.addEventListener('touchleave', function(e){
				canvas.removeEventListener('touchmove', onPaint, false);
				e.preventDefault();
			}, false)

			/* Drawing on Canvas*/
			function onPaint() {
				if(drawingFlag){
					ctx.strokeStyle="black";
					ctx.lineWidth =drawingStrokeValue;
					ctx.beginPath();
					ctx.moveTo(last_mouse.x, last_mouse.y);
					ctx.lineTo(mouse.x, mouse.y);
					ctx.closePath();
					ctx.stroke();
				}
				if(eraseFlage) {
					ctx.strokeStyle="rgb(249, 249, 249)";
					ctx.lineWidth =eraseStrokeValue*5;
					ctx.beginPath();
					ctx.moveTo(last_mouse.x, last_mouse.y);
					ctx.lineTo(mouse.x, mouse.y);
					ctx.closePath();
					ctx.stroke();
				}
			}
		}		
	}
})

App.HospitalController = Ember.ArrayController.create();
App.listController = Ember.ArrayController.create();



App.EditSignatureRoute = Ember.Route.extend({

})

App.EditSignatureController = Ember.Controller.extend({
clicked : false,
	actions : {
		getcanvas : function(){
		},
		savesignature : function(){
			console.log("NEWSIGNATURECONTROLLER");
			console.log("saving signature");
			console.log(this.get('model'));
			this.transitionTo('edit.index')
		},
		setSign : function(){
			console.log("setSign");
			var canvas = document.getElementById("mySignatureCanvas");
			var img    = canvas.toDataURL("image/png");
			this.get('model').set('imgurl',img);
			this.get('model').set('authoritydesignation',$('#modelNo').val().toString());
			this.get('model').set('authorityperson',$('#productName').val().toString());
			this.get('model').save();
			$('#myCanvas').empty();
			$('#canvas-bottom').remove();
			var newimg = '<img src="'+img+'">'
			$('#myCanvas').html(newimg);
			console.log(this.get('model'));
			console.log(img);
		},
		sign: function(){
			console.log(this.get('clicked'))
			$('#myCanvas').show();
			this.set('clicked' , true);
			console.log("Sign modal opened")
			var drawingStrokeValue=1;
			var eraseStrokeValue=1;
			$('#digitalSignature').show();
			var myheight = $('#myCanvas').height();
			var mywidth = $('#myCanvas').width();
			var newCanvas = '<canvas id="mySignatureCanvas" width='+mywidth+' height='+myheight+'>Your Browser does not support Canvas</canvas>';
			$('#myCanvas').html(newCanvas);
			
			
			var canvas = document.getElementById('mySignatureCanvas');
			var ctx  = canvas.getContext('2d');
			var drawingFlag=true;
			var eraseFlage=false;

			var mouse = {x: 0, y: 0};
			var last_mouse = {x: 0, y: 0};

			if (window.matchMedia('(max-width: 1000px)').matches) {
			        $('#digitalSignature').css('top','5%');
		    } else {
		     	$('#digitalSignature').css('top','15%');
		    }
		    var filterVal = 'blur(2px)';
			$(".mycontainer").css("webkitFilter",filterVal);
			$("#sec1").css("webkitFilter",filterVal);
			$("#sec7").css("webkitFilter",filterVal);
			$('.blur-cover').css('visibility','visible');
			$('.blur-cover').css('opacity',1);
			
			$('#signatureStrokeSizeButton').click(function(){
				drawingFlag=true;
				eraseFlage=false;
				onPaint;
				$('#customerSignatureSrokeSlider').toggle();
				$('#customerSignatureEraseSlider').hide();
			});

			$('#signatureEraseButton').click(function(){
				drawingFlag=false;
				eraseFlage=true;
				onPaint;
				$('#customerSignatureEraseSlider').toggle();
				$('#customerSignatureSrokeSlider').hide();
			});

			/* Mouse Capturing Work */
			canvas.addEventListener('mousemove', function(e) {
				last_mouse.x = mouse.x;
				last_mouse.y = mouse.y;
				var offsetValue=$(this).offset();
				mouse.x = e.pageX - offsetValue.left;
				mouse.y = e.pageY - offsetValue.top;
				e.preventDefault();
			}, false);

			canvas.addEventListener('mousedown', function(e) {
				$('#customerSignatureEraseSlider').hide();
				$('#customerSignatureSrokeSlider').hide();
				canvas.addEventListener('mousemove', onPaint, false);
				e.preventDefault();
			}, false); 

			canvas.addEventListener('mouseup', function(e) {
				canvas.removeEventListener('mousemove', onPaint, false);
				e.preventDefault();
			}, false);
			
			
			/* Touch Capturing Work */
			canvas.addEventListener('touchmove', function(e){
				var touchObject=e.changedTouches[0];
				var offsetValue=$(this).offset();
				last_mouse.x = mouse.x;
				last_mouse.y = mouse.y;
				mouse.x = parseInt(touchObject.pageX-offsetValue.left);
				mouse.y = parseInt(touchObject.pageY-offsetValue.top);
				e.preventDefault();
			}, false)

			/* Finger touch handelling */
			canvas.addEventListener('touchstart', function(e){
				$('#customerSignatureEraseSlider').hide();
				$('#customerSignatureSrokeSlider').hide();
				var touchObject=e.changedTouches[0];
				var offsetValue=$(this).offset();
				mouse.x = parseInt(touchObject.pageX-offsetValue.left);
				mouse.y = parseInt(touchObject.pageY-offsetValue.top);
				canvas.addEventListener('touchmove', onPaint, false);
				e.preventDefault();
			}, false)

			canvas.addEventListener('touchleave', function(e){
				canvas.removeEventListener('touchmove', onPaint, false);
				e.preventDefault();
			}, false)

			/* Drawing on Canvas*/
			function onPaint() {
				if(drawingFlag){
					ctx.strokeStyle="black";
					ctx.lineWidth =drawingStrokeValue;
					ctx.beginPath();
					ctx.moveTo(last_mouse.x, last_mouse.y);
					ctx.lineTo(mouse.x, mouse.y);
					ctx.closePath();
					ctx.stroke();
				}
				if(eraseFlage) {
					ctx.strokeStyle="rgb(249, 249, 249)";
					ctx.lineWidth =eraseStrokeValue*5;
					ctx.beginPath();
					ctx.moveTo(last_mouse.x, last_mouse.y);
					ctx.lineTo(mouse.x, mouse.y);
					ctx.closePath();
					ctx.stroke();
				}
			}
		}		
	}
})

App.EditFeedbackRoute = Ember.Route.extend({

})

App.EditFeedbackController = Ember.Controller.extend({
	actions : {
		redirectfeedback : function(){
			this.transitionTo('edit.index')
		},		
		savefeedback : function(){
			console.log("savefeedback");
			console.log(this.get('model').get('id'));
			this.store.find('report' , this.get('model').get('id')).then(function(report){
				report.set('designation', $('#modelNo').val().toString())
				report.set('person', $('#productName').val().toString())
				report.set('satisfaction', 2)
				report.save();
			})
			console.log(this.get('model'))
			this.transitionTo('edit.index');
		},
	}
})

App.EditDeviceRoute = Ember.Route.extend({
	model : function(params){
		console.log(params)
		return this.store.all('device')
	},
	godel : function(){
		var array = []
		this.set('godel',array)
		return []
	}	

})

App.EditDeviceController = Ember.Controller.extend({

	actions : {
		upload:function(){
			console.log("in here dude")
			console.log(this.get('params'))
			$('#admyupload').click();
		},
		frikkinupload : function(theFile){
			console.log("frikkinupload")
			console.log(theFile)
			var array = $.map(theFile, function(value, index) {
				return [value];
			});
			console.log(array)
			this.set('godel', array);
		},
		addDevice : function(){
			console.log('ADDING DEVICE')
			console.log(this.controllerFor('edit.index').get('model').get('id'))
			
			console.log($('#admyupload')[0].files.length)
			console.log($('#admyupload')[0].files)
			console.log('GODEL');


			//Setting up file upload variables
			var upload = false;
			var uploadName = null;
			var myfile = [];

			//Checking and initializing all the file upload stuff in the conditional
			if($('#admyupload')[0].files.length > 0){
				upload = true
				uploadName = $('#admyupload')[0].files[0].name
				console.log(this.get('godel').length)
				//pushing al files into myfile
				for (var i = this.get('godel').length - 1; i >= 0; i--) {
					myfile.push(this.get('godel')[i])
				};
				
				
			}

			var that = this;

			console.log('device-model-length');
			var id ;
			console.log(this.store.find('device').then(function(mydevices){
				id = mydevices.get('length')
			}))
			this.store.find('report' , this.controllerFor('edit.index').get('model').get('id')).then(function(persisted){
			var moidevice =  {
	  			id: id,
				fileUpload:upload,
				fileName:uploadName,
				file:myfile,				
	  			productName : ($('#productName').val()).toString(),
	  			modelNumber : $('#modelNo').val(),
	  			uniqueCode : $('#uniqueCode').val(),
	  			report : persisted
	  		}
		   that.store.createRecord('device', moidevice).save().then(function(apt) {
	    	persisted.get('devices').pushObject(apt);
		    persisted.save();
		  });	  		

		})


			/*
			var mydevice = this.store.createRecord('device',{
				fileUpload:upload,
				fileName:uploadName,
				file:myfile				
			})
			mydevice.set('modelNumber',$('#modelNo').val())
			mydevice.set('productName',($('#productName').val()).toString())
			mydevice.set('uniqueCode',$('#uniqueCode').val())

			var post = this.store.find('report' , 1)
/*			mydevice.save().then(
				function(){
					post.get('devices').addObject(mydevice)

					post.save().then(
						function(){
							console.log("success !")
							console.log(this.store.find('report' , 1))
						})
				}
			)*/


			/*myreport = this.store.find('report', 2).then(function(thereport){

				//thereport.get('devices').pushObject(mydevice)
				console.log(thereport.get('devices').addObject(mydevice));
				thereport.save();

			}) */

			console.log(this.store.find('report'));
		
			App.listController.set('model' , this.store.all('device'))				
			console.log(this.store.all('device'))
			var array = []
			this.set('godel',array)
			console.log(this.store.find('report'))
			this.transitionTo('edit.index')
		}
	}
})


App.LoginRoute = Ember.Route.extend({

})

App.LoginController = Ember.Controller.extend({
	actions : {

		login: function() {
			var that = this;
			console.log("LOGIN")
			$.post("http://172.16.1.168:3000/login?username="+$('#myuser').val()+"&password="+$('#mypass').val(), function(response){
				console.log('LOGIN SUCCESS');
				console.log(response);
			})
			.done(function(response){
				console.log("SECOND SUCCESS");
				console.log(response);
				that.transitionTo('user',1)
			})
		}

	}
})

App.IndexRoute = Ember.Route.extend({
	renderTemplate: function() {

		this.render('login', { into: 'application' });
	},	
	redirect: function() {
		console.log("this.Store.find('user')")
		console.log(this.store.find('user',1))
		App.listController.set('model' , null)
		App.HospitalController.set('model' , null)
		this.transitionTo('login');
	}
});


App.UserRoute = Ember.Route.extend({
	model: function(){
		console.log("gagagaga");
		console.log(this.store.find('user',1))
		return this.store.find('user',1)
	},
	redirect: function() {
		this.transitionTo('user.clients');
		this.store.find('report').then(function(report){
			App.HospitalController.set('model' , report)
		});
	}	
});

App.ClientReportRoute = Ember.Route.extend({
	model : function(){
		console.log("IN REPORT ROUTE");
		console.log(this.store.find('report'));

		return this.store.find('report')
		
	}
});

Handlebars.registerHelper("letter", function(value , options) {
	console.log("Inside letter logo");
	var name = (value.data.keywords.report.get('name')).charAt(0);
	console.log(name)
	return name;
});

Handlebars.registerHelper("fillStyle", function(value , options) {
	console.log("Inside fillStyle logo");
	var fillColor = ['#43BCFF','#208E3C','#C140BE','#FFCD40']
	return 'background-color:'+fillColor[(value.data.keywords.report.get('id'))-1];
});



App.ClientReportController = Ember.ArrayController.extend({

  actions : {

  	install : function(){
  		console.log("Installing shit");
  		var time = new Date();
  		console.log(time)
		var myreports = this.store.find('report');
		console.log((myreports.get('length')).toString())
		var moireport = {
			id:5,
			draft : false
		}
		var that = this;
		this.store.createRecord('report' , moireport).save().then(function(persisted){
			console.log(that.store.find('report'));
			//return persisted;
			that.transitionTo('new.index',persisted);
		})	  		

	/*	this.store.find('report' , 1).then(function(persisted){
			var moidevice =  {
	  			id: 3,
	  			productName : "booboo",
	  			modelNumber : 090,
	  			uniqueCode : 007,
	  			report : persisted
	  		}
		   that.store.createRecord('device', moidevice).save().then(function(apt) {
	    	persisted.get('devices').pushObject(apt);
		    persisted.save();
		  });	  		

		})
		this.store.createRecord('report', myreport).save().then(function(persisted) {
		  
		  		var moidevice =  {
		  			id: 3,
		  			productName : "booboo",
		  			modelNumber : 090,
		  			uniqueCode : 007,
		  			report : persisted
		  		}  
		   that.store.createRecord('device', moidevice).save().then(function(apt) {
		    persisted.get('devices').pushObject(apt);
		    
		  });
		});  		
  		this.store.find('report' , 3).then(function(myreport){
  			moidevice.set('report' , myreport)
  			myreport.get('devices').pushObject(moidevice);
  			moidevice.save();
  		})*/
  		
  		
  	}
  },
  drafts: (function() {
  	console.log("BERRIES")
  	console.log(this.get('model'));
   return this.get('model').filterProperty('draft', true);
  }).property('model.@each')
});

App.ClientNewRoute = Ember.Route.extend({

})


App.UserHomeController = Ember.Controller.extend({
	actions : {
		prack : function(){
			console.log("hehehehee lool");
			console.log(this.store.find('client' ,1))
			this.transitionTo('user.clients');
		}
	}
})

App.UserHomeRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('user/home', { into: 'user' });
	},
	model : function(){
		console.log("gigigigigig")
	}
})

Handlebars.registerHelper('ifColor', function(options) {
	console.log(options.data.keywords.controller.model.get('draft'))
	console.log(options.data.keywords.controller.editing)
	var mymodel = options.data.keywords.controller.model
  if(options.data.keywords.controller.editing){
  	if(options.data.keywords.controller.model.get('draft')){

  		return "background-color:#FCD21F"
  	}
  	return "background-color:#1FD305"
  }
  else{
  	return "background-color:#FCD21F"
  }

});

Handlebars.registerHelper('ifCond', function(options) {
	console.log(options.data.keywords.controller.model.get('draft'))
	console.log(options.data.keywords.controller.editing)
	var mymodel = options.data.keywords.controller.model
  if(options.data.keywords.controller.editing){
  	if(options.data.keywords.controller.model.get('draft')){

  		return "This report is not yet submitted .Draft was last saved on "+mymodel.get('created')
  	}
  	return "This report was successfully submitted on "+mymodel.get('created')
  }
  else{
  	return "New Installation"
  }

});

Handlebars.registerHelper('date', function(v1,options) {
	console.log("DATE HELPER");
	console.log(v1);
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var time = today.toLocaleTimeString()
    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 
    var today = dd+'/'+mm+'/'+yyyy;
    var date = {day:dd,month:mm,year:yyyy,time:time}
    console.log(date[v1])
    return date.time

});

Handlebars.registerHelper('setsat', function(options) {
	console.log(options.data.keywords.controller.model);
	var sat = options.data.keywords.controller.model.get('satisfaction');
	var myarray = [
		"Enjoyed",
		"Happy",
		"Ok Ok!",
		"Neutral",
		"Dislike",
		"Shocked",
		"Annoyed",
		"Angry"
	]
	
	
	
	return myarray[sat-1]

});

Handlebars.registerHelper('setsmiley', function(options) {
	console.log(options.data.keywords.controller.model);
	var sat = options.data.keywords.controller.model.get('satisfaction');
	var myarray = [
		{x : "0px" , y : "0px"},
		{x : "-121px" , y : "0px"},
		{x : "-42px" , y : "-35px"},
		{x : "-121px" , y : "-35px"},
		{x : "-41px" , y : "-71px"},
		{x : "-121px" , y : "-71px"},
		{x : "-41px" , y : "-107px"},
		{x : "-121px" , y : "-107px"}
	]
	
	console.log((myarray[sat+1].x).toString() + " " + myarray[sat+1].y)
	var myString = "background-position-y:"+(myarray[sat-1].y).toString()+";background-position-x:"+(myarray[sat-1].x).toString()
	return myString

});


App.UserClientsRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('user/clients', { into: 'user' });
	},
	model : function(params){
		console.log("poipipipi")
		
		console.log(this.store.find('client'))
		return this.store.all('client')
	}	
})

App.UserClientsController = Ember.ArrayController.extend({
	actions : {
		shack : function(){
			
		}
	}
})



App.ClientIndexRoute = Ember.Route.extend({
	
	afterModel : function(params){
		console.log("AFTERMODEL")
		console.log(params.client_slug);
		return this.store.find('client' ,1)
		
	},
	serialize: function(model, params) {
		console.log("Serializing this beyotch")
		return { client_slug: model.get('slug') };
	}		
})

App.UserIndexRoute = Ember.Route.extend({
	model: function(){
		console.log("mamamamama");
		
		console.log(this.store.all('user'))
		return this.store.find('user',1)
	}	
})

App.UserIndexController = Ember.Controller.extend({
	actions : {
		frack : function(){
			console.log("hoo hahaa");
			this.transitionTo('user.home');
		}
	}
});

App.EditRoute = Ember.Route.extend({
	model : function(params){
		console.log("INSTALLATION ROUTE")
		console.log(params);
		console.log(this.store.find('report' , params.edit_id))
		return this.store.find('report' , params.edit_id)
	}	
})

App.EditIndexRoute = Ember.Route.extend({
	model : function(){
		return this.modelFor('edit');
	}

})

App.EditIndexController = Ember.Controller.extend({
	needs : ['editDevice'],
	editing : true,
	selecthosp : false,
	count : 0,
	dontselecthosp : true,
	hospitals : [
	{ id:1,name : 'Manipal Hospital' , date : 'Nov 9, 2014 6:30pm' , devices : 4 , sensors : 2 , draft : true},
	{ id:2 ,name : 'Manipal Hospital' , date : 'Nov 9, 2014 6:30pm' , devices : 8 , sensors : 2 , draft : true},
	{ id:3 ,name : 'Beams Hospital' , date : 'Nov 9, 2014 6:30pm' , devices : 2 , sensors : 21 , draft : false},
	{ id:4 ,name : 'Beams Hospital' , date : 'Nov 9, 2014 6:30pm' , devices : 6 , sensors : 2 , draft : false}
],

actions : {
		redirectdevice	: function(){
			this.transitionTo('edit.index')
		},
		removedevice: function(params){
			console.log("REMOVE DEVICE");
			console.log(this.get('model'));
			console.log(params);
			params.deleteRecord();
		},
		gigi : function(){
			console.log("gigigigigi")
		},
		gotofeedback : function(model){
			console.log("GOTOFEEDBACK")
			console.log(model)
			this.transitionTo('edit.feedback' , model)
		},
		gotosignature : function(model){
			console.log("GOTOSIGNATURE")
			console.log(model)
			this.transitionTo('edit.signature' , model)
		},		
		gotodevice : function(params){
			console.log("GOTODEVICE")
			console.log(params)
			this.transitionTo('edit.device' , params)
		},
		add : function(){
			console.log('\n')
			console.log("ADD DEVICES")
			
			
			//showing the modal

			$('#addDevice').show(0,function(){
		    if (window.matchMedia('(max-width: 1000px)').matches) {
		        $('#addDevice').css('top','10%');
		    } else {
		     	$('#addDevice').css('top','15%');
		    }
			});
			//var filterVal = 'blur(2px)';
			//$(".mycontainer").css("webkitFilter",filterVal);
			//$("#sec1").css("webkitFilter",filterVal);
			//$("#sec7").css("webkitFilter",filterVal);
			//$('.blur-cover').css('visibility','visible');
			//$('.blur-cover').css('opacity',1);
		},
		selectstuff : function(){
			console.log("INSIDE SELECT STUFF");
			console.log(this.get('count'))
			this.set('selecthosp' , true);
			this.set('dontselecthosp' , false);
		},
		sethosp : function(params){
			console.log("SETHOSP")
			console.log(params);
			this.set('selecthosp' , false);
			this.set('dontselecthosp' , true);
			var mydata = this.store.all('report').get('content')
			console.log(mydata);
			var that = this
			this.store.find('report' , params).then(function(report){
				that.get('model').set('name' , report.get('name'))
			})
			console.log(this.get('model'))
			
		},
		mapoptions : function(){
			console.log("MAPOPTIONS")
			console.log(this.get('model'));
			
		},
		cancelShit : function(){
			console.log("blur cover being pressed");
			$('.focussed').css('height',myheight);
			$('.focussed').css('z-index',1);
			$('.focussed').removeClass('focussed');
			$('#action-icon').attr('src','plus.png');
			$('.action-options').css('opacity',0);

			$('.blur-cover').fadeOut('slow');
			$('.action-options').css('-webkit-transform','scale(0.4)'); 			
		},
		testbutton : function(){
			console.log("Controller working !")
			
			  /*$('.blur-cover').fadeIn(500)
			  $( ".map-view" ).animate({
			    
			    
			    height: "500px"
			    
			  }, 500, function() {
			    // Animation complete.
			    $( ".map-view" ).css('z-index',5)
			  }); */
			
			$('#action-button').toggleClass('active').promise().done(function(){
				$('.blur-cover').css('background-color','white');
				if($('#action-icon').attr('src') == 'plus.png'){
					$('#action-icon').attr('src','add.png');
					$('.blur-cover').fadeIn('slow')
					$('.action-options').css('opacity',1);
					$('.action-option-div').css('opacity',1);
					$('.action-options').css('-webkit-transform','scale(1)');

				}else{
					$('#action-icon').attr('src','plus.png');
					$('.action-options').css('opacity',0);
					$('.blur-cover').fadeOut('slow')
					$('.action-options').css('-webkit-transform','scale(0.4)');
				}
			}); 
		},
		testoption : function(){
			console.log("Option button working")
		},
		addingsensors : function(){
			$('.map-view').parent().click();
		},
		disableaction : function(){
			console.log("blur cover being pressed");
			$('.focussed').css('height',myheight);
			$('.focussed').css('z-index',1);
			$('.focussed').removeClass('focussed');
			$('#action-icon').attr('src','plus.png');
			$('.action-options').css('opacity',0);
			$('.action-option-div').css('opacity',0);
			$('.blur-cover').fadeOut('slow');
			$('.action-options').css('-webkit-transform','scale(0.4)'); 
		}
	},
  showthis : function(){
  	console.log("SHOWTHIS");
  	console.log(this.get('editing'))
  	console.log(this.get('model').get('draft'))
//  	return this.get('editing') && this.get('model').get('draft')
	return false;
  }	
})



App.IndexController = Ember.Controller.extend({
	actions : {
		cancelShit : function(){
			console.log("blur cover being pressed");
			$('.focussed').css('height',myheight);
			$('.focussed').css('z-index',1);
			$('.focussed').removeClass('focussed');
			$('#action-icon').attr('src','plus.png');
			$('.action-options').css('opacity',0);
			$('.blur-cover').fadeOut('slow');
			$('.action-options').css('-webkit-transform','scale(0.4)'); 			
		},
		testbutton : function(){
			console.log("Controller working !")
			
			  /*$('.blur-cover').fadeIn(500)
			  $( ".map-view" ).animate({
			    
			    
			    height: "500px"
			    
			  }, 500, function() {
			    // Animation complete.
			    $( ".map-view" ).css('z-index',5)
			  }); */
			
			$('#action-button').toggleClass('active').promise().done(function(){
				$('.blur-cover').css('background-color','white');
				if($('#action-icon').attr('src') == 'plus.png'){
					$('#action-icon').attr('src','add.png');
					$('.blur-cover').fadeIn('slow')
					$('.action-options').css('opacity',1);
					$('.action-options').css('-webkit-transform','scale(1)');

				}else{
					$('#action-icon').attr('src','plus.png');
					$('.action-options').css('opacity',0);
					$('.blur-cover').fadeOut('slow')
					$('.action-options').css('-webkit-transform','scale(0.4)');
				}
			}); 
		},
		testoption : function(){
			console.log("Option button working")
		},
		addingsensors : function(){
			$('.map-view').parent().click();
		},
		disableaction : function(){
			console.log("blur cover being pressed");
			$('.focussed').css('height',myheight);
			$('.focussed').css('z-index',1);
			$('.focussed').removeClass('focussed');
			$('#action-icon').attr('src','plus.png');
			$('.action-options').css('opacity',0);
			$('.blur-cover').fadeOut('slow');
			$('.action-options').css('-webkit-transform','scale(0.4)'); 
		}
	}	
})

DeviceContainerView = Ember.View.extend({
	tagName : 'div',
	classNames : ['device-container'],
	myvar : ["DateView","MapView","FeedbackView"],
	click : function(){
		console.log("DeviceContainerView CLICKED")
		console.log(this.get('content'));
	
	}
})

DeviceView = Ember.View.extend({
	templateName: 'devicetemplate',
    didInsertElement: function() {
        

    },	
	click : function(){
		console.log(this.get('content'))
	}
})

CardContainerView = Ember.View.extend({
	tagName : 'div',
	classNames : ['mycontainer'],
	myvar : [{name : "Time" ,view : "DateView"},{ name : "Location", view : "MapView"}],
	/*mouseDown : function(e){
		console.log('mouseDown cardviewcontainer view')
		console.log($(e.target));
		var element = $(e.target).closest(".card");
		if(element.offset()){

			console.log(element.offset())
			console.log(e.pageY)
			e.preventDefault();
			console.log(this);
			
			offsetY = (e.pageY - element.offset().top);
			offsetX = (e.pageX - element.offset().left);

			element.addClass('clicked').append(
			$('<span class="card-circle"></span>')
				.css({
					'top' : offsetY,
					'left' : offsetX
				})
			);
		}
	},
	mouseUp : function(e){
		e.preventDefault();
		console.log("mouseup")
		console.log($(e.target).closest("div"))
		var element = $(e.target).closest("div");
	  	element.removeClass('clicked')
	    .children(".card-circle").fadeOut(function(){
	    	console.log($(this))
	    	console.log($(this)[0].className);
	    	
	    	
	    		$(this).remove();
	    	
	    });				

	},  */
	click: function(){
		console.log("cardviewcontainer clicked");
	}
})

var myheight;

CardView = Ember.View.extend({
	tagName : 'div',
	classNames : ['cardview'],
	mouseDown : function(){
		console.log("mouse down cardView")
	},
	click : function(e){

		//handling cardview being clicked
		
		console.log("CardView clicked");
	/*	console.log($(e.target).closest('.cardview'));

		$('html, body').animate({
            scrollTop: $(e.target).offset().top-60
        }, 500);
        myheight = $(e.target).closest('.cardview').height();
		$(e.target).closest('.cardview').css('height','100%');
		$(e.target).closest('.cardview').css('z-index',5);
		$('.blur-cover').css('background-color','rgb(122, 117, 117)');
		$('.blur-cover').fadeIn('slow');
		$(e.target).closest('.cardview').addClass('focussed') */
	},
	TestView : Ember.View.extend({
		tagName : 'div',
		classNames : ['test'],
		click : function(){
			alert("testview being clicked !")
		}
	})

});

FeedbackView = Ember.View.extend({
	templateName: 'feedback'
})

ReportCardView = Ember.View.extend({
	templateName : 'reportcard'
})

RowView = Ember.View.extend({
	tagName : 'li',
	click : function(){
		console.log("being clicked here");

		$('.map-location.hosp-list').css('display' , 'none');
	}
})



MapView = Ember.View.extend({

	classNames : ['full-height','map-view'],
	templateName: 'map',
	hospital : function(){
		console.log(this.controller.get('model'))
		return this.get('content');
	},
	mouseDown : function(){
		
		console.log("map View mouse down");
	},
	click : function(){
		console.log("Mapview is being clicked");
		console.log(this.get('content'));
		console.log(this.get('controller.model'));
		
		
	}
})

 DateView = Ember.View.extend({
 	classNames : ['full-height'],
	templateName: 'date',
	date: function(){
		var datetime = new Date();
		var datearray = []
		datearray = String(datetime).split(' ');
		return datearray[0] + ", "+datearray[1]+ " "+ datearray[2]+" "+datearray[3];
	}
})

App.GoogleMapsComponent = Ember.Component.extend({
  insertMap: function() {
    var container = this.$(".map-canvas");

    var options = {
      center: new google.maps.LatLng(this.get("latitude"),
this.get("longitude")),
      zoom: 17,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    new google.maps.Map(container[0], options);
  }.on('didInsertElement')
});

			App.UploadFileView = Ember.TextField.extend({
		    type: 'file',
			init: function() {
				this._super();
				this.set("controller", App.DeviceController);
			},
		    attributeBindings: ['name','mulitple'],
		    foo:['a','b'],
		    change: function(evt) {
				console.log("Changed beyotch")
				console.log(evt)
				var self = this;
				var input = evt.target;
				console.log('\n')
				console.log("uploadview input files")
				console.log(input.files)
				
				if (input.files && input.files[0]) {
					console.log("herherherhreh")


				    // Loop through the FileList and render image files as thumbnails.
					self.sendAction('myupload',input.files);
				    for (var i = 0, f; f = input.files[i]; i++) {

						// Only process image files.
						// if (!f.type.match('image.*')) {
						//  continue;
						// }

						var reader = new FileReader();

						// Closure to capture the file information.
						reader.onload = (function(theFile) {
							return function(e) {
								// Render thumbnail.
								console.log(theFile)
								console.log(e.target)

								
								//console.log((self.get('controller')).sendAction("changeme"))
								//    span.innerHTML = ['<p ',
								//                      ' title="', escape(theFile.name), '">',theFile.name,'</p>'].join('');
								//    document.getElementById('list').insertBefore(span, null);
							};
						})(f);

						// Read in the image file as a data URL.
						reader.readAsDataURL(f);
					}				
				}
		    }
		})


