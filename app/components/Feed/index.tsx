import EmptyState from 'app/components/EmptyState';
import ErrorBoundary from 'app/components/ErrorBoundary';
import { selectFeedActivitiesByFeedId } from 'app/reducers/feeds';
import { useAppSelector } from 'app/store/hooks';
import { FeedActivityVerb } from 'app/store/models/FeedActivity';
import styles from './Feed.css';
import Activity from './activity';
import AdminRegistrationRenderer from './renders/adminRegistration';
import AnnouncementRenderer from './renders/announcement';
import CommentRenderer from './renders/comment';
import CommentReplyRenderer from './renders/comment_reply';
import EventRegisterRenderer from './renders/event_register';
import GroupJoinRenderer from './renders/group';
import MeetingInvitationRenderer from './renders/meetingInvitation';
import RegistrationBumpRenderer from './renders/registrationBump';
import RestrictedMailSentRenderer from './renders/restrictedMail';
import type { EntityId } from '@reduxjs/toolkit';
import type ActivityRenderer from 'app/components/Feed/ActivityRenderer';
import type { ReactNode } from 'react';

export const activityRenderers: Record<FeedActivityVerb, ActivityRenderer> = {
  [FeedActivityVerb.Comment]: CommentRenderer,
  [FeedActivityVerb.CommentReply]: CommentReplyRenderer,
  [FeedActivityVerb.MeetingInvitation]: MeetingInvitationRenderer,
  [FeedActivityVerb.RestrictedMailSent]: RestrictedMailSentRenderer,
  [FeedActivityVerb.RegistrationBump]: RegistrationBumpRenderer,
  [FeedActivityVerb.AdminRegistration]: AdminRegistrationRenderer,
  [FeedActivityVerb.Announcement]: AnnouncementRenderer,
  [FeedActivityVerb.GroupJoin]: GroupJoinRenderer,
  [FeedActivityVerb.EventRegister]: EventRegisterRenderer,
};

type Props = {
  feedId: EntityId;
};

const Feed = ({ feedId }: Props): ReactNode => {
  const feedActivities = useAppSelector((state) =>
    selectFeedActivitiesByFeedId(state, feedId),
  );

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      {feedActivities.length ? (
        feedActivities.map((item) => {
          const renders = activityRenderers[item.verb];
          return renders ? (
            <ErrorBoundary hidden key={item.id}>
              <Activity aggregatedActivity={item} renders={renders} />
            </ErrorBoundary>
          ) : null;
        })
      ) : (
        <EmptyState>
          <h2 className={styles.emptyState}>Ingen aktiviteter i feeden</h2>
        </EmptyState>
      )}
    </div>
  );
};

export default Feed;
