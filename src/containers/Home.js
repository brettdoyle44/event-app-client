import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';
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
        console.log(events);
        // let imageEvents = [];
        // events.map(event => {
        //   if (event.image) {
        //     const eventIMG = Storage.vault.get(event.image);
        //     return imageEvents.push({
        //       title: event.title,
        //       content: event.title,
        //       image: eventIMG,
        //       startDate: event.startDate
        //     });
        //   } else {
        //     return imageEvents.push({
        //       title: event.title,
        //       content: event.title,
        //       startDate: event.startDate
        //     });
        //   }
        // });
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
    return [...events].map((event, i) =>
      i !== 0 ? (
        <LinkContainer key={event.eventid} to={`/events/${event.eventid}`}>
          <ListGroupItem header={event.title}>
            {event.content}
            <br />
            <img src={event.imageUrl} alt={event.title} />
            <br />
            {'Created: ' + new Date(event.startDate).toLocaleString()}
          </ListGroupItem>
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
      <div className="lander">
        <h1>Eve</h1>
        <p>A simple event app</p>
      </div>
    );
  }

  function renderEvents() {
    return (
      <div className="event">
        <PageHeader>Your Events</PageHeader>
        <ListGroup>{!isLoading && renderEventsList(events)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {props.isAuthenticated ? renderEvents() : renderLander()}
    </div>
  );
}
