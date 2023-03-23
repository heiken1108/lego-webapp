import { cloneElement } from 'react';
import { Content } from 'app/components/Content';
import { LoginPage } from 'app/components/LoginForm';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import type { EventPool, EventAdministrate } from 'app/models';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import type { Element } from 'react';

type Props = {
  children: Array<Element<any>>;
  currentUser: Record<string, any>;
  isMe: boolean;
  event?: EventAdministrate;
  match: {
    params: {
      eventId: string;
    };
  };
  pools: Array<EventPool>;
};

const EventAdministrateIndex = (props: Props) => {
  const base = `/events/${props.match.params.eventId}/administrate`;
  // At the moment changing settings for other users only works
  // for the settings under `/profile` - so no point in showing
  // the other tabs.

  return (
    <Content>
      <NavigationTab
        title={props.event ? props.event.title : ''}
        back={{
          label: 'Tilbake',
          path: '/events/' + props.event.id,
        }}
      >
        <NavigationLink to={`${base}/attendees`}>Påmeldinger</NavigationLink>
        {props.currentUser.id === props.event.createdBy && (
          <NavigationLink to={`${base}/allergies`}>Allergier</NavigationLink>
        )}
        <NavigationLink to={`${base}/statistics`}>Statistikk</NavigationLink>
        <NavigationLink to={`${base}/admin-register`}>
          Adminregistrering
        </NavigationLink>
        <NavigationLink to={`${base}/abacard`}>Abacard</NavigationLink>
      </NavigationTab>
      {props.children &&
        props.children.map((child) =>
          cloneElement(child, { ...props, children: undefined })
        )}
    </Content>
  );
};

export default replaceUnlessLoggedIn(LoginPage)(EventAdministrateIndex);
