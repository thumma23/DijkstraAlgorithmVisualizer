import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
  render() {
    const {
      col,
      isFinish,
      isStart,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      onDragStart,
      onDragEnd,
      onDragOver,
      onDragEnter, 
      onDragLeave,
      onDrop,
      onDrag,
      row,
    } = this.props;
    const extraClassName = isFinish
      ? 'node-finish'
      : isStart
      ? 'node-start'
      : isWall
      ? 'node-wall'
      : '';

    const _isdraggable = isFinish
    ? true
    : isStart
    ? true
    : isWall
    ? false
    : false;
    
    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
        onDragStart = {() => onDragStart()}
        onDragEnd = {() => onDragEnd()}
        onDragOver = {() => onDragOver()}
        onDragEnter = {() => onDragEnter()}
        onDragLeave = {() => onDragLeave()}
        onDrop = {() => onDrop()}
        onDrag = {() => onDrag()}
        draggable={`${_isdraggable}`}></div>
    );
  }
}
