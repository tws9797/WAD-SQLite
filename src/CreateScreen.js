import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  DatePickerAndroid,
  ScrollView
} from 'react-native';

import {
  InputWithLabel,
  PickerWithLabel,
  DatePickerWithLabel,
  AppButton
} from './UI';

let SQLite = require('react-native-sqlite-storage');

export default class CreateScreen extends Component {

  static navigationOptions = {
    title: 'Add Place'
  };

  state = {
    name: '',
    city: '',
    date: '',
  }

  componentWillMount(){
    this._insert = this._insert.bind(this);

    this.db = SQLite.openDatabase({
      name: 'places',
      createFromLocation: '~db.sqlite'
    }, this.openDb, this.errorDb);
  }

  _insert() {
    this.db.transaction((tx) => {
      tx.executeSql('INSERT INTO places(name, city, date) VALUES(?,?,?)',[
          this.state.name,
          this.state.city,
          this.state.date
      ]);
    });

    this.props.navigation.getParam('refresh')();
    this.props.navigation.goBack();
  }

  onChangeDate(newDate){
    this.setState({
      date: newDate
    });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <InputWithLabel style={styles.input}
          label={'Name'}
          value={this.state.name}
          onChangeText={(name) => {this.setState({name})}}
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
          label={'Date'}
          placeholder={'Choose a date'}
          changeDate={this.onChangeDate.bind(this)}
        />
        <AppButton style={styles.button}
          title={'Save'}
          theme={'primary'}
          onPress={this._insert}
        />
        <Text>{this.state.date.toString()}</Text>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    fontSize: 16,
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
  picker: {
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
});
