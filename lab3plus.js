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

	var drawOptionsChildren = drawOptions.children; //menu knappar
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
   
    var drawed= [];
	for(var i = 0; i < drawOptionsChildren.length; i++){
		drawOptionsChildren[i].addEventListener('click', function(event){
			
			var selectedOption = event.target.innerHTML;

			
			status(selectedOption); 
			whatToDraw = selectedOption.split(" ")[1];
			coordinates = [];
		});
	}

var trebuttons = document.getElementsByClassName("trebuttons")[0];
var buttonsChildren = trebuttons.children;
    for(var i = 0; i < buttonsChildren.length; i++){
		buttonsChildren[i].addEventListener('click', function(event){
			
			var selectedOption = event.target.innerHTML;

			
			status(selectedOption); 
			whatToDraw = selectedOption.split(" ")[1];
			coordinates = [];
		});
	}

	canvas.addEventListener('click',function(event){
		var coordinate = getMousePos(this,event);
		coordinates.push(coordinate);

		if(whatToDraw === "cirkel"){
			if(coordinates.length === 1 ){
				
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
				drawed.push(object);
				type = whatToDraw;
				coordinates = [];
			}
		}	
		else if(whatToDraw === "handling"){
			coordinates = [];
		}	

	});	
    var clear = document.getElementById("clear");
    clear.addEventListener("click", function(event){
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawed = [];
});
	var color= document.getElementsByName("color")[0];
    color.addEventListener("change", function(event){
    ctx.strokeStyle = color.value; 
});
	var expoteraButton = document.getElementById("export");
	expoteraButton.addEventListener("click",function(event){
		var expoterad = JSON.stringify(drawed);
		var jsonInput = document.getElementById("jsonInput");
        if(drawed.length===0){
            jsonInput.value= " ";
            
        }else{
            var expoterad = JSON.stringify(drawed);
            jsonInput.value = expoterad;
        }
		
		//console.log(expoterad);
	});
});

function isHexaColor(sNum){
	var noHashValue = sNum.substring(1,sNum.length);
  	return (typeof noHashValue === "string") && noHashValue.length === 6 
         && ! isNaN( parseInt(noHashValue, 16) );
}
function checkColorInput(text) {
	var okButton = document.getElementById("okButton"); 
	var warning = document.getElementById("warning");
	if(isHexaColor(text)){
		okButton.disabled = false;
		warning.innerHTML ="";
	}
	else{
		okButton.disabled = true;
		warning.innerHTML = 'Vänligen skriv in hexadecimal color värde';
		
	}
}

function changeColor(){
	var colorInput = document.getElementById('colorInput');
	var color = document.getElementsByName('color')[0];
	color.value = colorInput.value;
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = color.value;
	var newOption = document.createElement('option');
	newOption.text = colorInput.value;
	newOption.value = colorInput.value;
	var select = document.getElementsByTagName('select')[0];
	select.appendChild(newOption);
	
	
	status('Du har plockat ut färg '+  colorInput.value);
	colorInput.value = '';
	colorInput.placeholder = "Välj en färg";
}

function status(str="") {
		var statusBar = document.getElementById('status');
		statusBar.innerText = str;
}



