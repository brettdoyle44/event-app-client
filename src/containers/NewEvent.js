import React, { useRef, useState } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import config from '../config';
import './NewEvent.css';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';
import { API } from 'aws-amplify';
import { s3Upload } from '../libs/awsLib';

export default function NewNote(props) {
  const imagePath = useRef(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(moment());
  const [focused, setFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return content.length > 0;
  }

  function handleFileChange(event) {
    imagePath.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      imagePath.current &&
      imagePath.current.size > config.MAX_ATTACHMENT_SIZE
    ) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      const image = imagePath.current
        ? await s3Upload(imagePath.current)
        : null;

      await createEvent({ title, content, startDate, image });
      props.history.push('/');
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  }

  function createEvent(event) {
    return API.post('events', '/events', {
      body: event
    });
  }

  return (
    <div className="NewEvent">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="title">
          <ControlLabel>Title</ControlLabel>
          <FormControl
            value={title}
            as="textarea"
            onChange={e => setTitle(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="content">
          <ControlLabel>Description</ControlLabel>
          <FormControl
            value={content}
            componentClass="textarea"
            onChange={e => setContent(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="startDate">
          <ControlLabel style={{ display: 'block' }}>Start Date</ControlLabel>
          <SingleDatePicker
            date={startDate}
            onDateChange={setStartDate}
            focused={focused}
            onFocusChange={() => setFocused(!focused)}
            numberOfMonths={1}
            isOutsideRange={() => false}
            id="somerandomstring"
          />
        </FormGroup>
        <FormGroup controlId="imagePath">
          <ControlLabel>Image</ControlLabel>
          <FormControl onChange={handleFileChange} type="file" />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          style={{ backgroundColor: '#66FCF1' }}
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </form>
    </div>
  );
}
