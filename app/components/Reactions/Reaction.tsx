import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { addReaction, deleteReaction } from 'app/actions/ReactionActions';
import Emoji from 'app/components/Emoji';
import Tooltip from 'app/components/Tooltip';
import { useAppDispatch } from 'app/store/hooks';
import styles from './Reaction.css';
import type { ID } from 'app/store/models';
import type { CurrentUser } from 'app/store/models/User';
import type { ContentTarget } from 'app/store/utils/contentTarget';

type Props = {
  className?: string;
  user: CurrentUser;
  emoji: string;
  count: number;
  users?: { fullName: string }[];
  unicodeString: string;
  hasReacted: boolean;
  canReact: boolean;
  reactionId?: ID;
  contentTarget: ContentTarget;
  showPeople?: boolean;
};
// Note: Most use cases won't want to use this class directly. Instead, use
// app/components/LegoReactions.

const Reaction = ({
  className,
  user,
  emoji,
  count,
  users,
  unicodeString,
  hasReacted,
  canReact,
  reactionId,
  contentTarget,
  showPeople,
}: Props) => {
  const dispatch = useAppDispatch();

  const classes = [
    className ? className : styles.reaction,
    canReact && styles.clickable,
  ];

  if (hasReacted) {
    classes.push(styles.reacted);
  }

  if (count === 0) {
    return <></>;
  }

  let tooltipContent = '';
  if (showPeople && users && users.length > 0) {
    tooltipContent += users
      .filter((user) => user)
      .map((user) => user.fullName)
      .join(', ');
    tooltipContent += ' reagerte med ';
  }

  tooltipContent += emoji;

  return (
    <>
      <Tooltip content={tooltipContent}>
        <Flex
          gap={4}
          justifyContent="center"
          alignItems="center"
          className={cx(classes)}
          onClick={
            canReact
              ? () =>
                  hasReacted
                    ? dispatch(
                        deleteReaction({
                          reactionId,
                          contentTarget: contentTarget,
                        })
                      )
                    : dispatch(
                        addReaction({
                          emoji,
                          user: user,
                          contentTarget,
                          unicodeString,
                        })
                      )
              : undefined
          }
        >
          <div>
            <Emoji unicodeString={unicodeString} />
          </div>
          <span className={styles.reactionCount}>{count}</span>
        </Flex>
      </Tooltip>
    </>
  );
};

export default Reaction;
