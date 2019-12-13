import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { ListGroupItem, Button, Media } from 'react-bootstrap';
import { API, Storage } from 'aws-amplify';
import './Home.css';

export default function Home(props) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!props.isAuthenticated) {
        return;
      }

      try {
        const events = await loadEvents();

        for (const event of events) {
          const imageUrl = await Storage.vault.get(event.image);
          event.imageUrl = imageUrl;
        }
        setEvents(events);
      } catch (e) {
        alert(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [props.isAuthenticated]);

  function loadEvents() {
    return API.get('events', '/events');
  }

  function renderEventsList(events) {
    return [{}].concat(events).map((event, i) =>
      i !== 0 ? (
        <LinkContainer key={event.eventid} to={`/events/${event.eventid}`}>
          <Media>
            <Media.Left>
              <img
                width={64}
                height={64}
                src={event.imageUrl}
                alt={event.title}
              />
            </Media.Left>
            <Media.Body>
              <Media.Heading>{event.title}</Media.Heading>
              <p>{event.content}</p>
              {'Start Date: ' +
                new Date(event.startDate).toLocaleString('en', {
                  weekday: 'short',
                  year: 'numeric',
                  month: '2-digit',
                  day: 'numeric'
                })}{' '}
              {' | '}
              {'Created: ' + new Date(event.createdAt).toLocaleString()}
            </Media.Body>
          </Media>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/events/new">
          <ListGroupItem>
            <h4>
              <b>{'\uFF0B'}</b> Create a new event
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
    );
  }

  function renderLander() {
    return (
      <div className="landerTwo">
        <h1>WELCOME</h1>
        <p>
          Eve is a simple content management system built for event management.
          Most CMS's lend themselves to either product E-commerce or Blogging.
          Eve aims to make is easy for you to create, manage, and integrate
          events right into your existing website structure.
        </p>
        <p>
          <LinkContainer key="new" to="/signup">
            <Button bsSize="large" className="lb-btn">
              Get Started
            </Button>
          </LinkContainer>
        </p>
      </div>
    );
  }

  function renderEvents() {
    return (
      <div className="events">
        <h1>Your Events</h1>
        <div>{!isLoading && renderEventsList(events)}</div>
      </div>
    );
  }

  return (
    <div className="Home">
      {props.isAuthenticated ? renderEvents() : renderLander()}
    </div>
  );
}
