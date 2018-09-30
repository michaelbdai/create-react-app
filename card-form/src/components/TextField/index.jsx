import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'


const TextField = ({
  onChange,
  value,
  className,
  error,
  placeholder,
  type,
  onBlur,
  onFocus,
}) => (
  <div className="text-field-container">
    <input
      className={classNames('text-field', className, { error })}
      type={type || 'text'}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      onBlur={onBlur}
      onFocus={onFocus}
    />
    {error && (
      <span className="hint">
        {error}
      </span>
    )}
  </div>
)

TextField.propTypes = {
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
}

TextField.defaultProps = {
  error: null,
  className: null,
  placeholder: null,
  type: null,
}

export default TextField
