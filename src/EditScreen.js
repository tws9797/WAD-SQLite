import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  DatePickerAndroid,
  ScrollView,
} from 'react-native';
import {
  InputWithLabel,
  PickerWithLabel,
  DatePickerWithLabel,
  AppButton,
} from './UI';

let common = require('./CommonData');
let SQLite = require('react-native-sqlite-storage');

export default class EditScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Edit' + navigation.getParam('headerTitle')
    };
  };

  state = {
    placeId: this.props.navigation.getParam('id'),
    name: '',
    city: '',
    date: ''
  };

  componentWillMount() {
    this._query = this._query.bind(this);
    this._update = this._update.bind(this);

    this.db = SQLite.openDatabase({name: 'places', createFromLocation : '~db.sqlite'}, this.openDb, this.errorDb);
  }

  componentDidMount() {
    this._query();
  }

  _query() {
    this.db.transaction((tx) => {
      tx.executeSql('SELECT * FROM places WHERE id = ?', [this.state.placeId], (tx,results) => {
        if(results.rows.length){
          this.setState({
            name: results.rows.item(0).name,
            city: results.rows.item(0).city,
            date: results.rows.item(0).date
          })
        }
      })
    });
  }

  _update() {
    this.db.transaction((tx) => {
      tx.executeSql('UPDATE places SET name=?,city=?,date=? WHERE id=?',[
          this.state.name,
          this.state.city,
          this.state.date,
          this.state.placeId
      ]);
    });

    this.props.navigation.getParam('refresh')();
    this.props.navigation.getParam('homeRefresh')();
    this.props.navigation.goBack();
  }

  openDb() {
      console.log('Database opened');
  }

  errorDb(err) {
      console.log('SQL Error: ' + err);
  }

  openDatePicker = async () => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: this.state.date,
        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2099, 11, 31),
        mode: 'calendar', // try also with `spinner`
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        let selectedDate = new Date(year, month, day);

        this.setState({
          date: selectedDate,
          dateText: selectedDate.formatted(),
        });
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

  onChangeDate(newDate){
    this.setState({
      date: newDate
    });
  }

  render() {

    return(
      <ScrollView style={styles.container}>
        <InputWithLabel style={styles.label}
          label={'Name'}
          value={this.state.name}
          onChangeText={(name)=>this.setState({name})}
          orientation={'vertical'}
          />
          <InputWithLabel style={styles.input}
            label={'City'}
            value={this.state.city}
            onChangeText={(city) => {this.setState({city})}}
            orientation={'vertical'}
          />
        <DatePickerWithLabel style={styles.input}
          onPress={this.openDatePicker}
          value={new Date(this.state.date).toLocaleDateString()}
          label={'Date'}
          placeholder={'Choose a date'}
          changeDate={this.onChangeDate.bind(this)}
        />
        <AppButton style={styles.button}
          title={'Save'}
          theme={'primary'}
          onPress={this._update}
          />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  output: {
    fontSize: 24,
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
});
