
const regNum = /^[\d\s]+$/
const regName = /^[\w\s]+$/

export const HolderNameOnChangeValidator = (data) => regName.test(data)
export const NumberOnChangeValidator = (data) => regNum.test(data)
export const CVV2OnChangeValidator = (data) => regNum.test(data)
export const expMonOnChangeValidator = (data) => regNum.test(data)
export const expYrOnChangeValidator = (data) => regNum.test(data)
// onBlur error msg overwrite onChange error msg
export const HolderNameOnBlurValidator = (data) => data.length > 1 || { error: 'Name should have at least two letters' }
export const NumberOnBlurValidator = (data, { cardType }) => {
  if (!cardType) return { error: 'Invalid card number'}
  if (cardType === 'visa') return data.length === 19 || { error: 'Visa card should have 16 digits'}
  if (cardType === 'amex') return data.length === 17 || { error: 'AmEx card should have 15 digits'}
}
export const CVV2OnBlurValidator = (data, { cardType }) => {
  if (!cardType) return { error: 'Please enter valid card number first'}
  if (cardType === 'visa') return data.length === 3 || { error: 'CVV2 for Visa card should have 3 digits'}
  if (cardType === 'amex') return data.length === 4 || { error: 'CVV2 for AmEx card should have 4 digits'}
}
export const validateExpTime = (month, year) => {
  const time = new Date()
  const expYear = parseInt(year, 10)
  const expMonth = parseInt(month, 10)
  const currentYear = time.getFullYear()
  const currentMonth = time.getMonth()
  if (currentYear < expYear) return true
  if (currentYear > expYear) return false
  if (currentYear === expYear) return expMonth > currentMonth
}

export const expMonOnBlurValidator = (data, state) => {
  if (data.length !== 2 && data.length !== 1) return { error: '1 or 2 digit Month'}
  const year = state.fieldsData['exp-yr'].value
  if (year) {
    return validateExpTime(data, year) || { error: 'Exp time must be after current time'}
  }
  return true
}

export const expYrOnBlurValidator = (data, state) => {
  if (data.length !== 4) return { error: '4 digit Year'}
  if (parseInt(data, 10) < (new Date()).getFullYear()) return { error: 'Exp time must be after current time'}
  const month = state.fieldsData['exp-mon'].value
  if (month) {
    return validateExpTime(month, data) || { error: 'Exp time must be after current time'}
  }
  return true
}

export const getInvalidFields = (fieldsStructure, fieldsData, validator) => {
  const invalidFields = []
  const newFields = []
  const validateField  = (key) => {
    if (!fieldsData[key].isValidated) {
      newFields.push(key)
    }
    if (!!fieldsData[key].error || !fieldsData[key].isValidated) {
      invalidFields.push(key)
    }
  }
  fieldsStructure.forEach(key => {
    if (typeof key === 'string') {
      validateField(key)
    } else {
      key.forEach(nestedKey => {
        validateField(nestedKey)
      })
    }
  })
  validator(newFields)
  return invalidFields.length > 0 && invalidFields
}


const splitIndexMap = {
  visa: [4, 9, 14],
  amex: [4, 11]
}

export const splitNum = (cardNumber, cardType) => {
  let result = cardNumber
  if (!cardType) return result
  if (result[result.length - 1] === ' ') return result.slice(0, -1)
  const splitIndex = splitIndexMap[cardType] || []
  if (splitIndex.indexOf(result.length) !== -1) {
    result += ' '
  }
  return result
}

export const getVisaType = (cardNumber) => {
  if (cardNumber[0] === '4') {
    return 'visa'
  }
  if (cardNumber[0] === '3' && (cardNumber[1] === '4' || cardNumber[1] === '7')) {
    return 'amex'
  }
  return null
}