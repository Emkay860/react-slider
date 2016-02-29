import test from 'tape';
import React from 'react';
import { findDOMNode, render } from 'react-dom';
import { renderIntoDocument, findRenderedDOMComponentWithTag, findRenderedDOMComponentWithClass, Simulate } from 'react-addons-test-utils';
import Slider from '../src/slider';


const slideContainerStyles = {
  width: '100px',
  height: '20px',
  border: '1px solid red',
  margin: '0',
};

let numElemsOnPage = 0;

const createContainerElement = function () {
    const div = document.createElement('div');
    document.body.appendChild(div);
    return div;
};

const arrangeTest = function () {
  const div = createContainerElement();
  const startPosition = 50;
  const component = render(<Slider start={ startPosition } min={ 0 } max={ 100 } containerStyles={ slideContainerStyles } onEmitValue={ () => {} } />, div);
  const container = findRenderedDOMComponentWithClass(component, 'slider-container');
  const handle = findRenderedDOMComponentWithClass(component, 'slider-handle');
  const handleDOMNode = findDOMNode(handle);
  const containerDOMNode = findDOMNode(container);

  const { left: containerLeft } = containerDOMNode.getBoundingClientRect();
  const { left : handleLeft, width: handleWidth } = handleDOMNode.getBoundingClientRect();

  return {
    handleDOMNode,
    handleLeft,
    containerLeft,
    handleWidth,
    component,
    container
  }
};

// DOM interaction tests
test('Handle position increases when mouse drags to the right', (assert) => {
  const { handleDOMNode,
          handleLeft,
          containerLeft,
          handleWidth,
          component,
          container } = arrangeTest();

  const nextMousePosition = handleLeft + containerLeft + (handleWidth / 2) + 2;

  Simulate.mouseDown(container);
  Simulate.mouseMove(container, { pageX: nextMousePosition });
  Simulate.mouseUp(container);

  const { left: newLeftPos } = handleDOMNode.getBoundingClientRect();


  assert.equal(newLeftPos > handleLeft, true);
  assert.end();
});

test('Value increases when mouse drags to the right', (assert) => {
  const { handleLeft,
          containerLeft,
          handleWidth,
          component,
          container } = arrangeTest();

  const nextMousePosition = handleLeft + containerLeft + (handleWidth / 2) + 1;
  const oldValue = component.state.value;

  // Act
  Simulate.mouseDown(container);
  Simulate.mouseMove(container, { pageX: nextMousePosition });
  Simulate.mouseUp(container);

  // Assert
  assert.equal(component.state.value > oldValue, true);
  assert.end();
});

test('Value decreases when mouse drags to the left', (assert) => {
  const { handleDOMNode,
          handleLeft,
          containerLeft,
          handleWidth,
          component,
          container } = arrangeTest();

  const nextMousePosition = handleLeft + containerLeft + (handleWidth / 2) - 1;

  const oldValue = component.state.value;

  Simulate.mouseDown(container);
  Simulate.mouseMove(container, { pageX: nextMousePosition });
  Simulate.mouseUp(container);

  assert.equal(component.state.value < oldValue, true);
  assert.end();
});
