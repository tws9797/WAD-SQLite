import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  ScrollView,
  View,
  Switch,
  Picker,
  Text,
  TextInput
} from 'react-native';

export default class App extends Component{

  state = {
    name: '',
    email: '',
    gender: '',
    education: '',
    promotion: false,
  }

  componentDidMount(){
    this._readSettings();
  }

  async _saveSetting(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch(error) {
      console.log('## ERROR SAVING ITEM ##: ', error);
    }
  }

  async _readSettings() {
    newStates = {};

    try {
      let keys = await AsyncStorage.multiGet([
        'name','email','gender','education','promotion'
      ], (err, stores) =>{
        stores.map((results, i, store) => {
          let key = store[i][0];
          let value = store[i][1];

          //To check the existence of the value
          if(['promotion'].indexOf(key) != -1){
            newStates[key] = value == 'true' ? true : false;
          }
          else {
            newStates[key] = value;
          }
        });
        this.setState(newStates);
      })
    } catch(error) {
      console.log('## ERROR READING ITEMS ##: ', error);
    }
  }

  render() {
    return(
      <ScrollView style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
          {'Name'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={'Enter name'}
            value={this.state.name}
            onChangeText={(name)=>{
              this.setState({name});
              this._saveSetting('name',name);
            }}
            />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
          {'Email'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={'Enter email'}
            value={this.state.email}
            onChangeText={(email)=>{
              this.setState({email});
              this._saveSetting('email',email);
            }}
            />
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>
            {'Gender'}
          </Text>
          <Picker style={styles.picker}
            mode={'dropdown'}
            prompt={'Select gender'}
            selectedValue={this.state.gender}
            onValueChange={
              (itemValue, itemIndex) => {
                this.setState({gender: itemValue});
                this._saveSetting('gender', itemValue);
              }
            }>
            <Picker.Item label="Male" value="m" />
            <Picker.Item label="Female" value="f" />
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Picker style={styles.picker}
            mode={'dropdown'}
            prompt={'Select education'}
            selectedValue={this.state.education}
            onValueChange={
              (itemValue, itemIndex) => {
                this.setState({education: itemValue});
                this._saveSetting('education', itemValue);
              }
            }>
            <Picker.Item label="High School" value="hs" />
            <Picker.Item label="Undergraduate" value="u" />
            <Picker.Item label="Postgraduate" value="p" />
          </Picker>
        </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>
              {'Promotion'}
            </Text>
            <Switch style={styles.switch}
              onValueChange={(promotion) => {
                this.setState({promotion});
                this._saveSetting('promotion', promotion.toString())
              }}
              value={ this.state.promotion }
              />
          </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 60,
  },
  switchLabel: {
    flex: 4,
    fontSize: 20,
    margin: 10,
  },
  switch: {
    flex: 1,
    margin: 10,
  },
  pickerContainer: {
    flexDirection: 'column',
  },
  pickerLabel: {
    fontSize: 20,
    margin: 10,
  },
  picker: {
    margin: 10,
  },
  inputContainer: {
      flex: 1,
  },
  inputLabel: {
      flex: 1,
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 3,
      textAlignVertical: 'center',
  },
  input: {
      margin: 10,
  },
});
