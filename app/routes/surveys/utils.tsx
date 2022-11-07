import type { Node } from 'react';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import moment from 'moment-timezone';
import styles from './components/surveys.css';
import type { ActionGrant } from 'app/models';
import 'app/models';
import config from 'app/config';
import cx from 'classnames';
import Icon from 'app/components/Icon';
const questionStrings = {
  single: 'single_choice',
  multiple: 'multiple_choice',
  text: 'text_field',
};
const displayTypeStrings = {
  bar_chart: 'bar_chart',
  pie_chart: 'pie_chart',
};
export const QuestionTypes = (choice: string) => {
  return questionStrings[choice] || questionStrings[0];
};
export const PresentableQuestionType = (choice: string) => {
  const questionTypeToString = {
    single_choice: 'Enkeltvalg',
    multiple_choice: 'Avkrysningsbokser',
    text_field: 'Fritekst',
  };
  return questionTypeToString[choice] || questionTypeToString[0];
};
export const DisplayTypes = (choice: string) => {
  return displayTypeStrings[choice] || displayTypeStrings[0];
};
export const PresentableDisplayTypes = (choice: string) => {
  return displayTypeStrings[choice] || displayTypeStrings[0];
};
export const mappings = Object.keys(questionStrings).map((key) => ({
  value: questionStrings[key],
  label: PresentableQuestionType(questionStrings[key]),
})) as Array<{
  value: string;
  label: string;
}>;
export const graphMappings = Object.keys(displayTypeStrings).map((key) => ({
  value: displayTypeStrings[key],
  label: PresentableDisplayTypes(displayTypeStrings[key]),
})) as Array<{
  value: string;
  label: string;
}>;
export const ListNavigation = ({ title }: { title: Node }) => (
  <NavigationTab title={title} headerClassName={styles.navTab}>
    <NavigationLink to="/surveys">Liste</NavigationLink>
    <NavigationLink to="/surveys/add">Ny undersøkelse</NavigationLink>
    <NavigationLink to="/surveys/templates">Maler</NavigationLink>
  </NavigationTab>
);
export const DetailNavigation = ({
  title,
  surveyId,
  actionGrant,
}: {
  title: Node;
  surveyId: number;
  actionGrant?: ActionGrant;
}) => (
  <NavigationTab title={title} headerClassName={styles.navTab}>
    <NavigationLink to="/surveys">Liste</NavigationLink>
    <NavigationLink to={`/surveys/${surveyId}`}>Undersøkelsen</NavigationLink>
    <NavigationLink to={`/surveys/${surveyId}/submissions/summary`}>
      Resultater
    </NavigationLink>
  </NavigationTab>
);
export const TokenNavigation = ({
  title,
  surveyId,
  actionGrant = [],
}: {
  title: Node;
  surveyId: number;
  actionGrant?: ActionGrant;
}) => (
  <NavigationTab title={title} headerClassName={styles.navTab}>
    {actionGrant.includes('EDIT') && (
      <NavigationLink to={`/surveys/${surveyId}/submissions/summary`}>
        Adminversjon
      </NavigationLink>
    )}
  </NavigationTab>
);
export const defaultActiveFrom = (hours: number, minutes: number) =>
  moment()
    .startOf('day')
    .add({
      day: 1,
      hours,
      minutes,
    })
    .toISOString();
export const CHART_COLORS = [
  'var(--lego-red)',
  'var(--color-blue-4)',
  'var(--color-orange-3)',
  'var(--color-green-5)',
  'var(--lego-chart-purple)',
  'var(--lego-chart-yellow)',
  'var(--lego-chart-green)',
  '#ff87eb',
  'var(--color-black)',
];
export const getCsvUrl = (surveyId: string) =>
  `${config.serverUrl}/surveys/${surveyId}/csv/`;
export const QuestionTypeOption = ({ iconName, option, ...props }: any) => (
  <div
    style={{
      cursor: 'pointer',
      backgroundColor: props.isSelected
        ? 'var(--color-almost-white-1)'
        : props.isFocused
        ? 'var(--color-almost-white-5)'
        : 'var(--color-white)',
    }}
    className={cx(styles.dropdownOption, styles.dropdown)}
    onMouseDown={(event) => {
      props.onSelect && props.onSelect(option, event);
    }}
    onMouseEnter={(event) => props.onFocus && props.onFocus(option, event)}
    onMouseMove={(event) => {
      if (props.isFocused) return;
      props.onFocus && props.onFocus(option, event);
    }}
    ref={props.innerRef}
    {...props.innerProps}
  >
    <span className={styles.dropdownColor}>
      <Icon
        name={iconName}
        style={{
          marginRight: '15px',
        }}
      />
      {props.children}
    </span>
  </div>
);
export const QuestionTypeValue = ({ iconName, option, ...props }: any) => (
  <div
    className={cx(styles.dropdownSelected, styles.dropdown)}
    onMouseDown={(event) => {
      props.onSelect && props.onSelect(props.option, event);
    }}
    onMouseEnter={(event) =>
      props.onFocus && props.onFocus(props.option, event)
    }
    onMouseMove={(event) => {
      if (props.isFocused) return;
      props.onFocus && props.onFocus(props.option, event);
    }}
    ref={props.innerRef}
    {...props.innerProps}
  >
    <span className={cx('Select-value-label', styles.dropdownColor)}>
      <Icon
        name={iconName}
        style={{
          marginRight: '15px',
        }}
      />
      {props.children}
    </span>
  </div>
);