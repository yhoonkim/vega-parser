import {Top, Bottom, Left, Right, Value, Label} from './constants';
import guideMark from './guide-mark';
import {TextMark} from '../marks/marktypes';
import {AxisLabelRole} from '../marks/roles';
import {encoder} from '../encode/encode-util';

export default function(spec, config, userEncode, dataRef, size) {
  var orient = spec.orient,
      sign = (orient === Left || orient === Top) ? -1 : 1,
      pad = spec.labelPadding != null ? spec.labelPadding : config.labelPadding,
      zero = {value: 0},
      encode = {}, enter, exit, update, tickSize, tickPos;

  encode.enter = enter = {
    opacity: zero,
    fill: {value: config.labelColor},
    font: {value: config.labelFont},
    fontSize: {value: config.labelFontSize},
    text: {field: Label}
  };

  encode.exit = exit = {
    opacity: zero
  };

  encode.update = update = {
    opacity: {value: 1}
  };

  tickSize = encoder(size);
  tickSize.mult = sign;
  tickSize.offset = encoder(pad);
  tickSize.offset.mult = sign;

  tickPos = {
    scale: spec.scale,
    field: Value,
    band: 0.5
  };

  if (orient === Top || orient === Bottom) {
    update.y = enter.y = tickSize;
    update.x = enter.x = exit.x = tickPos;
    update.align = {value: 'center'};
    update.baseline = {value: orient === Top ? 'bottom' : 'top'};
  } else {
    update.x = enter.x = tickSize;
    update.y = enter.y = exit.y = tickPos;
    update.align = {value: orient === Right ? 'left' : 'right'};
    update.baseline = {value: 'middle'};
  }

  return guideMark(TextMark, AxisLabelRole, Label, dataRef, encode, userEncode);
}
