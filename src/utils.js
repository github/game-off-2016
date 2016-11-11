export const centerGameObjects = (objects) => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

export const setResponsiveWidth = (sprite, percent, parent) => {
  let percentWidth = (sprite.texture.width - (parent.width / (100 / percent))) * 100 / sprite.texture.width
  sprite.width = parent.width / (100 / percent)
  sprite.height = sprite.texture.height - (sprite.texture.height * percentWidth / 100)
}

export const distance = (source, target) => {
  var dx = source.x - target.x;
  var dy = source.y - target.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function doLinesIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  const x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
  const y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
  if (isNaN(x) || isNaN(y)) {
    return false;
  } else {
    if (x1>x2) {
      if (!(x2<x&&x<x1)) {return false;}
    } else {
      if (!(x1<x&&x<x2)) {return false;}
    }
    if (y1>y2) {
      if (!(y2<y&&y<y1)) {return false;}
    } else {
      if (!(y1<y&&y<y2)) {return false;}
    }
    if (x3>x4) {
      if (!(x4<x&&x<x3)) {return false;}
    } else {
      if (!(x3<x&&x<x4)) {return false;}
    }
    if (y3>y4) {
      if (!(y4<y&&y<y3)) {return false;}
    } else {
      if (!(y3<y&&y<y4)) {return false;}
    }
  }
  return true;
}
