import React, {Component} from 'react'
import cards from '../../asset/cards.png';


import SubmitButton from '../SubmitButton'
import TextField from '../TextField'

import {
  HolderNameOnChangeValidator,
  NumberOnChangeValidator,
  CVV2OnChangeValidator,
  expMonOnChangeValidator,
  expYrOnChangeValidator,
  HolderNameOnBlurValidator,
  NumberOnBlurValidator,
  CVV2OnBlurValidator,
  expMonOnBlurValidator,
  expYrOnBlurValidator,
  getInvalidFields,
  splitNum,
  getVisaType,
} from '../../utils'

export const fieldsMeta = {
  'holder-name': {
    placeholder: 'Name',
    onChangeValidator: HolderNameOnChangeValidator,
    onBlurValidator: HolderNameOnBlurValidator,
  },
  'card-number': {
    placeholder: 'Card Number',
    onChangeValidator: NumberOnChangeValidator,
    onBlurValidator: NumberOnBlurValidator,
  },
  'card-cvv2': {
    placeholder: 'CVV2',
    onChangeValidator: CVV2OnChangeValidator,
    onBlurValidator: CVV2OnBlurValidator,
    inputFieldType: 'password',
  },
  'exp-mon': {
    placeholder: 'Exp. Mon',
    onChangeValidator: expMonOnChangeValidator,
    onBlurValidator: expMonOnBlurValidator,
  },
  'exp-yr': {
    placeholder: 'Exp. Year',
    onChangeValidator: expYrOnChangeValidator,
    onBlurValidator: expYrOnBlurValidator,
  },
}

export const fieldInitialData = Object.keys(fieldsMeta).reduce((result, key) => ({
  ...result,
  [key]: {
    isValidated: false,
    error: null,
    value: '',
  }
}), {})

export const initailState = {
  submitRequestPending: false,
  formError: null,
  fieldsData: fieldInitialData,
  cardType: null,
}

class CreditCardForm extends Component {
  state = initailState
  // the value of the key in this list should be consistent with backend data
  fieldsStructure = [
    'holder-name',
    'card-number',
    'card-cvv2',
    ['exp-mon', 'exp-yr'],
  ]

  validateFields = (keys) => {
    const newFieldsData = {}
    keys.forEach(key => {
      const fieldData = { ...this.state.fieldsData[key] }
      const feildValidation = fieldsMeta[key].onBlurValidator(this.state.fieldsData[key].value, this.state)
      if ( feildValidation !== true) {
        fieldData.error = feildValidation.error
        fieldData.isValidated = true
      } else {
        fieldData.isValidate = true
        fieldData.error = null
      }
      newFieldsData[key] = fieldData
    })
    this.setState({
      fieldsData: {
        ...this.state.fieldsData,
        ...newFieldsData,
      }
    })
  }

  handleSubmit = () => {
    const invalidFields = getInvalidFields(this.fieldsStructure, this.state.fieldsData, this.validateFields)
    if (invalidFields) {
      this.setState({formError: `Please correct the invalid data in feilds "${
        invalidFields.map(key => fieldsMeta[key].placeholder).join('", "')
      }".`})
      return
    }
  }

  handleBlur = (key) => (e) => {
    if (!e.target.value) {
      this.setState({
        fieldsData: {
          ...this.state.fieldsData,
          [key]: {
            ...this.state.fieldsData[key],
            isValidated: false,
          }
        }
      })
      return
    }
    this.validateFields([key])
  }

  handleFocus = (key) => (_) => {
    this.setState({
      formError: null,
      fieldsData: {
        ...this.state.fieldsData,
        [key]: {
          ...this.state.fieldsData[key],
          error: null
        }
      }
    })
  }

  handleChange = (key) => (e) => {
    let value = e.target.value
    let errorMsg
    let cardType
    if (!this.state.fieldsData[key].error && !fieldsMeta[key].onChangeValidator(value)) {
      errorMsg = 'Invalid input'
    } else if (this.state.fieldsData[key].error && fieldsMeta[key].onChangeValidator(value)){
      errorMsg = null
    }

    if (key === 'card-number') {
      if (value.length < 3) {
        cardType = getVisaType(value)
        if (!cardType) {
          errorMsg = 'Must be Visa or AmEx card'
        }
      } else {
        if (!this.state.cardType) errorMsg = 'Must be Visa or AmEx card'
      }
      value = splitNum(value, cardType || this.state.cardType)
    }

    this.setState({
      cardType: cardType || this.state.cardType,
      fieldsData: {
        ...this.state.fieldsData,
        [key]: {
          ...this.state.fieldsData[key],
          value,
          error: errorMsg === undefined ? this.state.fieldsData[key].error : errorMsg
        },
      }
    })
  }

  getTextField = (key) => (
    <TextField
      key={key}
      onChange={this.handleChange(key)}
      onBlur={this.handleBlur(key)}
      value={this.state.fieldsData[key].value}
      className={key}
      error={this.state.fieldsData[key].error}
      placeholder={fieldsMeta[key].placeholder}
      type={fieldsMeta[key].inputFieldType}
      onFocus={this.handleFocus(key)}
    />
  )

  render() {
    return (
      <div className="credit-card-form">
        <div className="form-title">Enter your credit card information</div>
        {
          this.fieldsStructure.map(fieldKey => {
            if (typeof fieldKey === 'string') {
              return this.getTextField(fieldKey)
            }
            return (
              <div className="nested-fields" key={fieldKey.join('-')}>
                {
                  fieldKey.map(nestedKey => this.getTextField(nestedKey))
                }
              </div>
            )
          })
        }
        <img src={cards} className="cards" alt="accepted cards" />
        <div className="button-container">
          <SubmitButton
            error={this.state.isAllDataValid}
            submitRequestPending={this.state.submitRequestPending}
            onClick={this.handleSubmit}
            className="credit-card-form-button"
          />
          {
            this.state.formError && (
              <span className="form-note">{this.state.formError}</span>
            )
          }
        </div>
      </div>
    )
  }
}

export default CreditCardForm
