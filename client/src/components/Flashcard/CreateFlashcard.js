import React, {useEffect, useState} from "react"
import { Button, Stack, TextField } from "@mui/material"
import axios from 'axios'

// time in lecture recording: 1:51:13

const CreateFlashcard = ({ userId, deckId }) => {
  // how can we use state here to make sure we're validating info
  // console.log(`[CreateFlashcard] deckId is ${deckId}`)
  const [formValue, setFormValue] = useState({})
  const [errors, setErrors] = useState({
    'frontText': false,
    'frontImage': false,
    'backText': false,
    'backImage': false
  })

  useEffect(() => {
    // this should run every time 'errors' is changed
    console.log('effect')
   }, [errors])

  // enable/disable submit button it fields not validated??

  function validateProperty(fieldName, fieldValue) { // returns boolean
    if (fieldValue.trim() === '') { return false }
    
    return true
  }

  const handleChange = (event) => {
    event.preventDefault()
    // console.log("[CreateFlashcard] onChange ", event)

    const newErrors = errors;
    if (validateProperty(event.target.name, event.target.value)) {
      const currentValues = formValue
      currentValues[event.target.name] = event.target.value // event.target.name = name in form TextField
      setFormValue(currentValues)
      console.log('form value changed')

      newErrors[event.target.name] = false
    } else {
      newErrors[event.target.name] = true      
    }
    // 'errors' gets changed here, any time the input changes
    setErrors(newErrors)  
    console.log('errors')
  }
  
  const handleSubmit = async (event) => {
    console.log("[CreateFlashcard] onSubmit ", event)
    event.preventDefault()
    try {
      const response = await axios.post(`http://localhost:8000/decks/${deckId}/cards`, formValue, { headers: { user: userId } })
      console.log(`[createflashcard] response submit ${response.status}`)
    } catch (err) {
      console.log(`response error ${err.status}`)
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
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Submit
      </Button>
    </Stack>
  )
}

export default CreateFlashcard
