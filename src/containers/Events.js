import React, { useRef, useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import config from '../config';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';
import { s3Upload } from '../libs/awsLib';
import './Events.css';

export default function Events(props) {
  const file = useRef(null);
  const [theEvent, setEvent] = useState(null);
  const [content, setContent] = useState('');
  const [focused, setFocused] = useState(false);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(moment());
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadEvent() {
      return API.get('events', `/events/${props.match.params.id}`);
    }

    async function onLoad() {
      try {
        const theEvent = await loadEvent();
        const { content, title, startDate, image } = theEvent;

        if (image) {
          theEvent.imageURL = await Storage.vault.get(image);
        }

        setTitle(title);
        setContent(content);
        setStartDate(moment(startDate));
        setEvent(theEvent);
      } catch (e) {
        alert(e);
      }
    }

    onLoad();
  }, [props.match.params.id]);

  function validateForm() {
    return content.length > 0;
  }

  function formatFilename(str) {
    return str.replace(/^\w+-/, '');
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  function saveEvent(theEvent) {
    return API.put('events', `/events/${props.match.params.id}`, {
      body: theEvent
    });
  }

  async function handleSubmit(event) {
    let image;

    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      if (file.current) {
        image = await s3Upload(file.current);
      }
      await saveEvent({
        title,
        content,
        startDate,
        image: image || theEvent.image
      });
      props.history.push('/');
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  }

  function deleteEvent() {
    return API.del('events', `/events/${props.match.params.id}`);
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      'Are you sure you want to delete this event?'
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteEvent();
      props.history.push('/');
    } catch (e) {
      alert(e);
      setIsDeleting(false);
    }
  }

  return (
    <div className="Events">
      {theEvent && (
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
          {theEvent.image && (
            <FormGroup>
              <ControlLabel>Image</ControlLabel>
              <FormControl.Static>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={theEvent.imageURL}
                >
                  {formatFilename(theEvent.image)}
                </a>
              </FormControl.Static>
            </FormGroup>
          )}
          <FormGroup controlId="file">
            {!theEvent.image && <ControlLabel>Image</ControlLabel>}
            <FormControl onChange={handleFileChange} type="file" />
          </FormGroup>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            style={{ backgroundColor: '#1f2833', color: '#66FCF1' }}
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            bsSize="large"
            bsStyle="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </form>
      )}
    </div>
  );
}
