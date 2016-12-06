function Rectangle(x1, y1, x2, y2){
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.draw = function(canvas) {//have got canvas as a variable, so do not need get canvas
        let ctx = canvas.getContext('2d');
        let width = Math.sqrt( (this.x1-this.x2)*(this.x1-this.x2) + (this.y1-this.y1)*(this.y1-this.y1) );
        let height = Math.sqrt( (this.x1-this.x1)*(this.x1-this.x1) + (this.y1-this.y2)*(this.y1-this.y2) );
        ctx.beginPath();     // börja en path
        ctx.strokeRect(this.x1, this.y1, width, height);
        ctx.stroke();
           
    }

    }