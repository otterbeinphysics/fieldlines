// Namespaced tools to do some basic geometry stuff.

var GeoUtils = function() {
return {
  min : function(a,b) {
    if(a>b) return b;
    return a;
  },
  
  max : function(a,b) {
    if(a>b) return a;
    return b;
  },
  
  square : function(a) { return a*a; },
  
  line_is_close_to_point : function(x,y,px1,py1,px2,py2,d)
  {
    // Return true if (x,y) is within distance d of the the line segment from p1 to p2.
    if(x < this.min(px1,px2) - d ) return false;
    if(x > this.max(px1,px2) + d ) return false;
    if(y < this.min(py1,py2) - d ) return false;
    if(y > this.max(py1,py2) + d ) return false;
    return (this.line_to_point(x,y,px1,py1,px2,py2) <= d);
  },


  line_to_point : function(x,y,px1,py1,px2,py2) {
    // Find the distance from a point to a line segment.
    
    // Find lambda, the distance along the line segment closest to the point.
    // v = vector from p1 to p2
    var v2 = this.square(px2-px1) + this.square(py2-py1);
    var v_dot_qp = (px2-px1) * (x-px1) + (py2-py1)*(y-py1);
    var lam = v_dot_qp/v2;
    
    if(lam<=0) {
      // Closest point is p1.
      return Math.sqrt(this.square(x-px1)+this.square(y-py1));
    }
    if(lam>=1) {
      // Closest point is p2
      return Math.sqrt(this.square(x-px2)+this.square(y-py2));
    }
    
    // Closest point is along the line.
    var qp2 = this.square(px1-x) + this.square(py1-y);
    var d2 = qp2-lam*lam*v2;
    return Math.sqrt(d2);
    

  },
  
  draw_highlighted_line: function(ctx,x1,y1,x2,y2,width,style,highlight_style,outline_style,do_highlight,do_outline)
  {
    // if(do_highlight) console.log("drawing highlighted");
    ctx.save();
    ctx.lineWidth = width;
    if(do_highlight) ctx.strokeStyle = highlight_style;
    else             ctx.strokeStyle = style;
    // console.log(ctx.strokeStyle);

    // This trick uses the shadow of a line to draw a soft line. Unfortunately, it doesn't work inside the magnifier.
    // ctx.save();
    // ctx.lineWidth = 1;
    // ctx.shadowColor = 'rgba(255, 0, 0, 1)'; 
    // ctx.shadowBlur = width;
    // ctx.shadowOffsetX = 10000;
    // ctx.shadowOffsetY = 0; 
    // ctx.beginPath();
    // ctx.moveTo(x1-10000,y1);
    // ctx.lineTo(x2-10000,y2);
    // ctx.stroke();
    // ctx.restore();
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();

    if(do_outline) {
      var dx = x2-x1;
      var dy = y2-y1;
      var d = Math.sqrt(dx*dx+dy*dy);
      var tx, ty;
      if(d==0) {
        tx = 0;
        ty = width;
      } else {
       tx = width*dy/d;
       ty = -tx*dx/dy;
      }
      if(dy==0) ty = width;
      // console.log("do_outline",tx,ty);
      ctx.strokeStyle = outline_style;
      ctx.beginPath();
      ctx.moveTo(x1+tx,y1+ty);
      ctx.lineTo(x2+tx,y2+ty);
      ctx.moveTo(x1-tx,y1-ty);
      ctx.lineTo(x2-tx,y2-ty);
      ctx.stroke();
    }
    ctx.restore();
  }
};
}();