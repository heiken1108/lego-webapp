import { Component } from "react";
import styles from "./optionsBox.css";
import { CheckBox, RadioButton, SelectInput } from "app/components/Form";
import type { CompanyEntity } from "app/reducers/companies";
type Props = {
  companies: Array<CompanyEntity>;
  updateFilters: (arg0: string, arg1: unknown) => void;
  removeFilters: (arg0: string) => void;
  filters: Record<string, any>;
};
type State = {
  active: boolean;
  studentContact: boolean;
  values: {
    active: boolean;
    studentContact:
    /*TODO: StudentContact */
    any;
  };
};
export default class OptionsBox extends Component<Props, State> {
  state = {
    active: false,
    studentContact: false,
    values: {
      active: true,
      studentContact: {}
    }
  };
  toggleSection = (section: string) => {
    const {
      filters,
      updateFilters,
      removeFilters
    } = this.props;

    if (filters[section] === undefined) {
      updateFilters(section, this.state.values[section]);
    } else {
      removeFilters(section);
    }

    const state = this.state;
    state[section] = !this.state[section];
    this.setState(state);
  };
  updateFilters = (name: string, value: unknown) => {
    const {
      updateFilters
    } = this.props;
    this.setState(state => ({ ...state,
      values: { ...state.values,
        [name]: value
      }
    }));
    updateFilters(name, value);
  };
  removeFilters = (name: string) => {
    const {
      removeFilters
    } = this.props;
    this.setState(state => ({ ...state,
      values: { ...state.values,
        [name]: undefined
      }
    }));
    removeFilters(name);
  };

  render() {
    return <div className={styles.optionsBox}>
        <span style={{
        display: 'block',
        fontSize: '18px',
        marginBottom: '5px'
      }}>
          Filtrer basert på om bedriften...
        </span>

        <div style={{
        display: 'flex',
        flexDirection: 'column'
      }}>
          <div className={styles.section} style={{
          order: 0
        }}>
            <CheckBox id="isActive" value={this.state.active} name="active" label="Er aktiv" onChange={() => this.toggleSection('active')} />

            <div className={styles.options} style={{
            display: this.state.active ? 'block' : 'none'
          }}>
              <label>
                <RadioButton name="active" id="active" inputValue={true} value={this.state.values.active} onChange={() => this.updateFilters('active', true)} />
                <span>Vis bare aktive bedrifter</span>
              </label>
              <label>
                <RadioButton name="active" id="inactive" inputValue={false} value={this.state.values.active} onChange={() => this.updateFilters('active', false)} />
                <span>Vis bare inaktive bedrifter</span>
              </label>
            </div>

            <CheckBox id="hasStudentContact" value={this.state.studentContact} name="studentContact" label="Har studentkontakt ..." onChange={() => this.toggleSection('studentContact')} />

            <div className={styles.options} style={{
            display: this.state.studentContact ? 'block' : 'none'
          }}>
              <SelectInput.WithAutocomplete value={{
              id: this.state.values.studentContact && Number(this.state.values.studentContact.id),
              label: this.state.values.studentContact && this.state.values.studentContact.fullName
            }} placeholder="Studentkontakt" name="studentContact" filter={['users.user']} onChange={user => user ? this.updateFilters('studentContact', {
              id: Number(user.id),
              fullName: user.label
            }) : this.removeFilters('studentContact')} onBlur={() => null} />
            </div>
          </div>
        </div>
      </div>;
  }

}