import React from 'react';
import keys from 'lodash/fp/keys';
import find from 'lodash/fp/find';
import map from 'lodash/fp/map';

const calculatePointInRange = function calculatePointInRange(origVal, oldMin, oldMax, newMin, newMax) {
  const oldRange = oldMax - oldMin;
  const newRange = newMax - newMin;
  return (((origVal - oldMin) * newRange) / oldRange) + newMin;
};

const invalidStartPointException = (start, min, max) => ({
  name: 'InvalidStartPointException',
  message: `The start point for the slider (${start})
            must be greater than the slider min (${min})
            and less than the slider max (${max}) values`
});

const initialState = {
  pos: '0px',
  isMouseDown: false,
  focused: false,
  value: 0,
  extraClasses: '',
};

const Slider = React.createClass({
  getInitialState: () => initialState,
  componentDidMount() {
    const { start, min, max } = this.props;

    if (start < min || start > max) {
      throw invalidStartPointException(start, min, max);
    }

    const { width: handleWidth } = this.refs.handle.getBoundingClientRect();
    const { left, right } = this.refs.container.getBoundingClientRect();
    const sliderWidth = right - left;
    const halfHandleWidth = handleWidth / 2;

    this.setState({
      pos: calculatePointInRange(start, min, max, halfHandleWidth, sliderWidth) + 'px',
      value: start
    });
  },
  mouseMoveHandler(e) {

    const { min : minPercent = 0, max: maxPercent = 100 } = this.props;
    const { isMouseDown } = this.state;
    const { pageX: mousePos, type } = e;
    const shouldMoveHandlerExecute = isMouseDown || type === 'click';

    if(!shouldMoveHandlerExecute) {
      return;
    }

    const { width: handleWidth } = this.refs.handle.getBoundingClientRect();
    const { left, right } = this.refs.container.getBoundingClientRect();
    const halfHandleWidth = handleWidth / 2;

    const newPos = mousePos - left - halfHandleWidth;
    const min = halfHandleWidth;
    const sliderWidth = (right - left) - halfHandleWidth;

    const newVal = calculatePointInRange(mousePos - left, min, sliderWidth, minPercent, maxPercent);
    const isInsideLeftBound = mousePos - halfHandleWidth > left;
    const isInsideRightBound = newPos < right - left - handleWidth;
    const isInsideBounds = isInsideLeftBound && isInsideRightBound;

    if (isInsideBounds) {
      this.setState({
        pos: newPos + 'px',
        value: Math.round(newVal),
        extraClasses: type === 'click' ? 'slider-clicked' : ''
      });
    }
  },
  keyPressHandler(e) {
    // TODO
    // const { keyCode } = e;
    // const left = 37;
    // const right = 39;
    //
    // if(keyCode !== left || keyCode !== right) {
    //   return;
    // }
  },
  focusHandler() {
    this.setState({ focused: true });
  },
  blurHandler() {
    this.setState({ focused: false });
  },
  mouseDownHandler() {
    this.setState({ isMouseDown: true });
  },
  mouseUpHandler() {
    const { onEmitValue: emitValue } = this.props;
    const { value } = this.state;
    this.setState({ isMouseDown: false });
    emitValue(value);
  },
  mouseClickHandler(e) {
    const { mouseMoveHandler, mouseUpHandler } = this;
    mouseMoveHandler(e);
    mouseUpHandler(e);
  },
  render() {
    const { slidingClassMap, displayValue, containerStyles } = this.props;
    const { mouseDownHandler, mouseClickHandler, mouseUpHandler, mouseMoveHandler, keyPressHandler, focusHandler, blurHandler } = this;
    const { focused, isMouseDown, pos: left, value, extraClasses } = this.state;
    const handleStyles = { left, position: 'absolute' };
    const rangeStyles = { width: `calc(${left} + 15px)`, };

    let slidingClassValue = '';

    const findSlidingClassKey = compose(find(t => value <= t), keys);
    const slidingClassKey = findSlidingClassKey(slidingClassMap);
    const slidingClassValue = slidingClassKey ? slidingClassMap[slidingClassKey] : '';

    const containerClasses = slidingClassValue + ' slider-container ' + extraClasses + (focused ? ' focused ' : '');

    return ( <div className={ containerClasses } style={ containerStyles } ref="container" tabIndex="1" onMouseDown={ mouseDownHandler } onMouseUp={ mouseUpHandler } onMouseMove={ mouseMoveHandler } onClick={ mouseClickHandler } onFocus={ focusHandler } onBlur={ blurHandler } onKeyDown={ keyPressHandler }>
              <div className="slider-body">
                <div className="slider-range" style={ rangeStyles }></div>
                <a className="slider-handle" ref="handle" style={ handleStyles }>{ value }</a>
              </div>
            </div>);
  },
});

Slider.propTypes = {
  onEmitValue: React.PropTypes.func,
  slidingClassMap: React.PropTypes.object,
  displayValue: React.PropTypes.bool,
  start: React.PropTypes.number,
  min: React.PropTypes.number,
  max: React.PropTypes.number,
};

export default Slider;
