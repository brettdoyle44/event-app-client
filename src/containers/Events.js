import React, { useRef, useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import config from '../config';
import moment from 'moment';
import { s3Upload } from '../libs/awsLib';
import './Events.css';

export default function Events(props) {
  const file = useRef(null);
  const [event, setEvent] = useState(null);
  const [content, setContent] = useState('');
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
        const event = await loadEvent();
        const { content, title, startDate, image } = event;

        if (image) {
          event.imageURL = await Storage.vault.get(image);
        }

        setTitle(title);
        setContent(content);
        setStartDate(moment(startDate));
        setEvent(event);
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

  function saveEvent(event) {
    return API.put('events', `/events/${props.match.params.id}`, {
      body: event
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
        image: image || event.image
      });
      props.history.push('/');
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      'Are you sure you want to delete this note?'
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
  }

  return (
    <div className="Events">
      {event && (
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="content">
            <FormControl
              value={content}
              componentClass="textarea"
              onChange={e => setContent(e.target.value)}
            />
          </FormGroup>
          {event.image && (
            <FormGroup>
              <ControlLabel>Image</ControlLabel>
              <FormControl.Static>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={event.imageURL}
                >
                  {formatFilename(event.image)}
                </a>
              </FormControl.Static>
            </FormGroup>
          )}
          <FormGroup controlId="file">
            {!event.image && <ControlLabel>Image</ControlLabel>}
            <FormControl onChange={handleFileChange} type="file" />
          </FormGroup>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            bsStyle="primary"
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
