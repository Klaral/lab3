window.addEventListener('load', function() {
	var buttonMenu = document.getElementById('menu');
	var drawOptions = document.getElementById('drawOptions');
	drawOptions.style.display = 'none';
	
	buttonMenu.addEventListener('click',function(event){	
		if(drawOptions.style.display=='none'){
			drawOptions.style.display='block';
		}else{
			drawOptions.style.display='none';
		}
	});

	var drawOptionsChildren = drawOptions.children; //menu buttons
	var whatToDraw = "";
	var coordinates = [];

	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	var select = document.getElementsByTagName('select')[0];
	select.addEventListener('change',function(event){
		var input = document.getElementsByName('color')[0];
		input.value = select.value;
		//var ctx = canvas.getContext("2d");
		ctx.strokeStyle = select.value;
	});	

	function status(str='') {
		var statusBar = document.getElementById('status');
		statusBar.innerHTML = str;

	}

	
	canvas.addEventListener('mouseover', event => {
		// check if we are drwaing somthing  check what we are drawing 
		// update status accordingly
		if(whatToDraw === "cirkel"){
			status('välj cirkelens mittpunkten');
		}else if(whatToDraw === "rektangel"){
			status('välj rektangels övre vänstra punkt');
		}else if(whatToDraw === "triangel"){
			status('välj triangelens först punkten');
		}else if (whatToDraw === 'till') {
			status('du kommer att expotera object till JSON');
		}else if(whatToDraw === 'handling'){
			status('Det du ritade ska avbröts nu.');
		}

	});

	function getMousePos(canvas, event) {
		var rect = canvas.getBoundingClientRect();
		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;
		return { x: x, y: y };
	}
    //var type = '';
    var drawed= [];
	for(var i = 0; i < drawOptionsChildren.length; i++){
		drawOptionsChildren[i].addEventListener('click', function(event){
			//trigger click events when click menu buttons   where to update status bar
			var selectedOption = event.target.innerHTML;

			//var statusBar = document.getElementById('status');
			status(selectedOption); // what to update status bar
			whatToDraw = selectedOption.split(" ")[1];//substring
			coordinates = [];//when change mind to click next button, should update to empty
		});
	}


	canvas.addEventListener('click',function(event){
		var coordinate = getMousePos(this,event);//who call , this will be who, but only can be object
		coordinates.push(coordinate);

		if(whatToDraw === "cirkel"){
			if(coordinates.length === 1 ){
				//var statusBar = document.getElementById('status');
				status('Klicka för välja cirkelens radie, nu är position: x:' + getMousePos(this,event).x + ', ' + 'y:' + getMousePos(this,event).y + ' ,Viewport:x: ' + event.clientX + ', ' + 'y:' + event.clientY + ' ,antal klick: ' + coordinates.length); 	
			}else if (coordinates.length === 2){
				var d = Math.sqrt( (coordinates[0].x-coordinates[1].x)*(coordinates[0].x-coordinates[1].x) + (coordinates[0].y-coordinates[1].y)*(coordinates[0].y-coordinates[1].y) );
				var c = new Circle(coordinates[0].x, coordinates[0].y, d);
				c.draw(this);
				status('cirkel har ritas ut');
				var object = {
					type: 'circle',
					color: ctx.strokeStyle,
					coordinates:coordinates
				};
				drawed.push(object);
				//type = whatToDraw;
				coordinates = [];
			}
		}else if(whatToDraw === "rektangel"){
			if(coordinates.length === 1 ){
				//var statusBar = document.getElementById('status');
				status('Klicka för att välja rektangels nedre högra punkten, nu är position: x:' + getMousePos(this,event).x + ', ' + 'y: ' + getMousePos(this,event).y + ' ,Viewport:x: ' + event.clientX + ', ' + 'y:' + event.clientY + ' ,antal klick: ' + coordinates.length);	
			}else if(coordinates.length === 2 ){
				var rectangle = new Rectangle(coordinates[0].x, coordinates[0].y, coordinates[1].x, coordinates[1].y);
				rectangle.draw(this);
				status('rektagel har ritas ut');
				var object = {
					type: 'rectangle',
					color: ctx.strokeStyle,
					coordinates:coordinates
				};
				drawed.push(object);
				//type = whatToDraw;
				coordinates = [];
			}
		}else if(whatToDraw === "triangel"){
			if(coordinates.length === 1 ){
				status('Klicka för välja triangles den andra punkten, nu är position: x:' + getMousePos(this,event).x + ', ' + 'y:' + getMousePos(this,event).y + ' ,Viewport:x: ' + event.clientX + ', ' + 'y:' + event.clientY + ' ,antal klick: ' + coordinates.length); 
				
			}else if(coordinates.length === 2 ){
				//var statusBar = document.getElementById('status');
				status('Klicka för välja triangles den tredje punkten, nu är position: x:' + getMousePos(this,event).x + ', ' + 'y:' + getMousePos(this,event).y + ' ,Viewport:x: ' + event.clientX + ', ' + 'y:' + event.clientY + ' ,antal klick: ' + coordinates.length); 
				
			}else if(coordinates.length === 3 ){
				var trian = new Triangle(coordinates[0].x, coordinates[0].y, coordinates[1].x, coordinates[1].y,coordinates[2].x, coordinates[2].y);
				trian.draw(this);
				status('triangel ritas ut');
				var object = {
					type: 'triangle',
					color: ctx.strokeStyle,
					coordinates:coordinates
				};
				drawed.push(object);//a list with drawed object
				type = whatToDraw;
				coordinates = [];
			}
		}	
		else if(whatToDraw === "handling"){
			coordinates = [];
		}	

	});	

	
	var expoteraButton = document.getElementById('export');
	expoteraButton.addEventListener('click',function(event){
		var expoterad = JSON.stringify(drawed);//it is a list with all drawed objects
		var jsonInput = document.getElementById('jsonInput');
		jsonInput.value = expoterad;
		//console.log(expoterad);
	});
});

function isHexaColor(sNum){
	var noHashValue = sNum.substring(1,sNum.length);
  	return (typeof noHashValue === "string") && noHashValue.length === 6 
         && ! isNaN( parseInt(noHashValue, 16) );
}
function checkColorInput(text) {
	var okButton = document.getElementById('okButton'); 
	var warning = document.getElementById('warning');
	if(isHexaColor(text)){
		okButton.disabled = false;
		warning.innerHTML ='';
	}
	else{
		okButton.disabled = true;
		warning.innerHTML = 'Vänligen skriv in hexadecimal color värde';
		//alert ('please input valid hexadecimal color value');
	}
}

function changeColor(){
	var colorInput = document.getElementById('colorInput');
	var color = document.getElementsByName('color')[0];
	color.value = colorInput.value;
	var newOption = document.createElement('option');
	newOption.text = colorInput.value;
	newOption.value = colorInput.value;
	var select = document.getElementsByTagName('select')[0];
	select.appendChild(newOption);
	//select.add(newOption);
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	ctx.strokeStyle = color.value;
	status('Du har plockat ut färg '+  colorInput.value);
	colorInput.value = '';
	colorInput.placeholder = "Välj en färg";
}

function status(str="") {
		var statusBar = document.getElementById('status');
		statusBar.innerText = str;
}

/*function validateColor(colorInput){
		//var colorInput = document.getElementById('colorInput');
		colorInput = colorInput.toUpperCase();
		var allowed = ['A','B','C','D','E','F','0','1','2','3','4','5','6','7','8','9'];
		var count = 0;
		if(colorInput.charAt(0)==='#'){
			for(var i = 1;i < colorInput.length; i++){
				for(var j = 0; j < allowed.length; j++){
					if(colorInput[i] === allowed[j]){
						count++;
						break;
					}

				}
			}
		}
		if(count === 6){
			return true;
		}
		else{
			return false;
		}
	}
*/
/*function changeColor(){
	var colorInput = document.getElementById('colorInput');
	if(colorInput.value.length ==7 && colorInput.value != undefined){
		if(validateColor(colorInput.value)===true){
			
			let color = document.getElementsByName('color')[0];
			//if(isHexaColor(colorInput.value) === true){
			color.value = colorInput.value;
			let newOption = document.createElement('option');
			newOption.text = colorInput.value;
			newOption.value = colorInput.value;
			let select = document.getElementsByTagName('select')[0];
			select.appendChild(newOption);
			colorInput.value = '';
			colorInput.placeholder = "Välj en färg";
			//select.add(newOption);
			let canvas = document.getElementById("myCanvas");
			let ctx = canvas.getContext("2d");
			ctx.strokeStyle = colorInput.value;
			status('Du har plockat ut färg '+  color.value);
		}
	}else{
		alert('Du har valt felaktig color format, det måste vara en hexadecimal format.');
	}
	
}

*/

function clearCanvas(){
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}