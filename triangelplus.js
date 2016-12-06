function Triangle(x1, y1, x2, y2, x3, y3){
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
    this.draw = function(canvas){
        let c = canvas.getContext('2d');
        c.beginPath();     // börja en path
        c.moveTo(this.x1, this.y1);  
        c.lineTo(this.x2, this.y2); 
        c.lineTo(this.x3, this.y3);  // lägg till linje
        c.closePath();     
        c.stroke();  
        
    }
}