import React, {useState} from "react"
import { Button, Stack, TextField, Alert, AlertTitle } from "@mui/material"
import axios from 'axios'

const isUrl = (value) => {
  const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
  return re.test(value)
}

const CreateFlashcard = ({ userId, deckId }) => {
  // how can we use state here to make sure we're validating info
  console.log(`[CreateFlashcard] deckId is ${deckId}`)
  const [formValue, setFormValue] = useState({})
  const [errors, setErrors] = useState({
    frontText: false,
    frontImage: false,
    backText: false,
    backImage: false,
    frontTextHelper: '',
    frontImageHelper: '',
    backTextHelper: '',
    backImageHelper: ''
  })
  const [submissionResponse, setSubmissionResponse] = useState({
    alertTitle: 'Submission Status',
    alertSeverity: 'info',
    alertBody: 'nothing submitted'
  })

  function validateProperty(fieldName, fieldValue) { 
    const helper = fieldName + "Helper"
    if (fieldValue === '') {
      setErrors({ ...errors, [fieldName]: true, [helper]: "empty field" })
    }
    else if (fieldValue.trim() === '') {
      setErrors({ ...errors, [fieldName]: true, [helper]: "only whitespace" })
    }
    else if (fieldName.endsWith('Image') && !isUrl(fieldValue)) {
      setErrors({ ...errors, [fieldName]: true, [helper]: "invalid url" })
    } else {
      setErrors({ ...errors, [fieldName]: false, [helper]: "" })
    }
  }

  const handleChange = (event) => {
    event.preventDefault()
    console.log("[CreateFlashcard] onChange ", event)
    validateProperty(event.target.name, event.target.value)

    const currentValues = formValue
    currentValues[event.target.name] = event.target.value // event.target.name = name in form TextField
    setFormValue(currentValues)
  }
  
  const handleSubmit = async (event) => {
    console.log("[CreateFlashcard] onSubmit ", event)
    event.preventDefault()
    try {
      const response = await axios.post(`http://localhost:8000/decks/${deckId}/cards`, formValue, { headers: { user: userId } })
      setSubmissionResponse({
        ...submissionResponse,
        'alertTitle': `${response.status}: submission succeeded`,
        'alertSeverity': 'success',
        'alertBody': response.body ?? ''
      })
    } catch (err) {
      setSubmissionResponse({
        ...submissionResponse,
        'alertTitle': `${err.response.status}: submission failed`,
        'alertSeverity': 'error',
        'alertBody': err.response.data ?? ''
      })
    }
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <span>Form values: {formValue.frontText} &amp; {formValue.backText}</span>
      <TextField
        margin="normal"
        required
        fullWidth
        id="frontImage"
        label="Front Image"
        name="frontImage"
        onChange={handleChange}
        autoFocus
        error={errors.frontImage}
        helperText={errors.frontImageHelper}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="frontText"
        label="Front Text"
        id="frontText"
        onChange={handleChange}
        error={errors.frontText}
        helperText={errors.frontTextHelper}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="backImage"
        label="Back Image"
        name="backImage"
        onChange={handleChange}
        error={errors.backImage}
        helperText={errors.backImageHelper}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="backText"
        label="Back Text"
        id="backText"
        onChange={handleChange}
        error={errors.backText}
        helperText={errors.backTextHelper}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Submit
      </Button>
      <Alert severity={submissionResponse.alertSeverity}>
        <AlertTitle>{submissionResponse.alertTitle}</AlertTitle>
        {submissionResponse.alertBody}
      </Alert>
    </Stack>
  )
}

export default CreateFlashcard
