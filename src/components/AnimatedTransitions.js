// src/components/AnimatedTransitions.js
import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './AnimatedTransitions.css';

function AnimatedTransitions({ children, location }) {
  return (
    <TransitionGroup>
      <CSSTransition key={location.key} timeout={300} classNames="fade">
        <div className="transition-container">
          {children}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default AnimatedTransitions;
