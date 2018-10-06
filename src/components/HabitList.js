import React, { Component } from 'react';
import HabitListInput from './HabitListInput';
import DataStore from 'nedb';
import moment from 'moment';

let db;

class HabitList extends Component {
  state = {
    newHabitInputOpened: false
  }

  componentDidMount() {
    db = new DataStore({
      filename: 'steps/habitsData',
      timestampData: true,
      autoload: true 
    });
  }

  createHabit = (newHabitName) => {
    if (newHabitName !== '') {
      db.insert({
        name: newHabitName,
        dates: [moment().format('MM/DD/YYYY')]
      }, (err, habit) => {
        this.props.habitsUpdated();
      });
    }

    this.setState({
      newHabitInputOpened: false
    });
  }
  
  submitChangeName = (habit, newName) => {
    db.update({ _id: habit._id }, { $set: { name: newName } });
  }

  render() {
    return (
      <div className="habit-list">
        {this.props.habits.map(habit => (
          <HabitListInput
            key={habit._id}
            name={habit.name}
            submitChange={(newName) => { this.submitChangeName(habit, newName)} } />
        ))}
        {this.state.newHabitInputOpened ?
          <div>
            <HabitListInput
              placeholder={"Exercise"}
              autofocus={true}
              name={this.state.newHabitName}
              submitChange={this.createHabit} />
          </div> :
          <div onClick={() => {this.setState({newHabitInputOpened: true})}}>+</div>
        }
      </div>
    );
  }
}

export default HabitList;