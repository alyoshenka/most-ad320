import React, {useState} from "react"
import { Button, Stack, TextField, Alert, AlertTitle } from "@mui/material"
import runValidation from '../../validation/validation.js'
import axios from 'axios'


const CreateFlashcard = ({ userId, deckId }) => {
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

    const validationResult = runValidation(fieldName, fieldValue)
    setErrors({ ...errors, [fieldName]: validationResult != null, [helper]: validationResult })
  }

  const handleChange = (event) => {
    event.preventDefault()
    console.log("[CreateFlashcard] onChange ", event)
    validateProperty(event.target.name, event.target.value)

    const currentValues = formValue
    currentValues[event.target.name] = event.target.value
    setFormValue(currentValues)
  }
  
  const handleSubmit = async (event) => {
    console.log("[CreateFlashcard] onSubmit ", event)
    event.preventDefault()

    const successTitle = 'Card added'
    const successSeverity = 'success'
    const failureTitle = 'Card rejected'
    const failureSeverity = 'error'
    try {
      const response = await axios.post(`http://localhost:8000/decks/${deckId}/cards`, formValue, { headers: { user: userId } })
      setSubmissionResponse({
        ...submissionResponse,
        'alertTitle': successTitle,
        'alertSeverity': successSeverity,
        'alertBody': response.body ?? ''
      })
    } catch (err) {
      setSubmissionResponse({
        ...submissionResponse,
        'alertTitle': failureTitle,
        'alertSeverity': failureSeverity,
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
