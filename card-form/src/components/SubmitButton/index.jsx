import React from 'react';
import PropTypes from 'prop-types'
import classNames from 'classnames'


const SubmitButton = ({ onClick, error, submitRequestPending, className }) => (
  <button
    className={classNames('submit-button', className, { error, submitRequestPending  })}
    disabled={error || submitRequestPending}
    onClick={onClick}
  >
    Submit
  </button>
)

SubmitButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  error: PropTypes.bool,
  submitRequestPending: PropTypes.bool,
  className: PropTypes.string,

}

SubmitButton.defaultProps = {
  error: false, 
  submitRequestPending: false,
  className: null,
}

export default SubmitButton