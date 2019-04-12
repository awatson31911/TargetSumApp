import React from 'react';
import PropTypes from 'prop-types';

import { View, Text, StyleSheet } from 'react-native';

import RandomNumber from './RandomNumber';

class Game extends React.Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired
  }
  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds
  }
  randomNumbers = Array.from({ length: this.props.randomNumberCount })
    .map(() => 1 + Math.floor(10 * Math.random()));

  target = this.randomNumbers.slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0);

  componentDidMount() {
    this.intervalId = setInterval(()=> {
      this.setState((prevState)=> ({
        remainingSeconds: prevState.remainingSeconds-1
      }), ()=> {
        if(this.state.remainingSeconds === 0) {clearInterval(this.intervalId);}
      });
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }
  gameStatus = () => {
    const sumSelected = this.state.selectedIds.reduce((acc, curr) => {
      return acc + this.randomNumbers[curr];
    }, 0);

    if (this.state.remainingSeconds === 0) { return 'LOST'; }
    if (sumSelected === this.target) { return 'WON'; }
    if (sumSelected > this.target) { return 'LOST'; }
    if (sumSelected < this.target) { return 'PLAYING'; }
  };
  //TODO shuffle random numbers

  selectNumber = (numberIndex) => {
    this.setState((prevState) => ({
      selectedIds: [...prevState.selectedIds, numberIndex]
    }));
  }

  isNumberSelected = (numberIndex) => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0;
  };

  render() {
    const gameStatus = this.gameStatus();
    return (
      <View style={styles.container}>
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>{this.target}</Text>
        <Text>{this.state.remainingSeconds}</Text>
        <View style={[styles.randomContainer,]}>
          {this.randomNumbers.map((randomNumber, index) =>
            <RandomNumber
              key={index}
              id={index}
              number={randomNumber}
              isDisabled={this.isNumberSelected(index) || gameStatus != 'PLAYING'}
              onPress={this.selectNumber}
            />
          )}
        </View>
        <Text>{gameStatus}</Text>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flex: 1
  },

  target: {
    fontSize: 50,
    margin: 50,
    textAlign: 'center',
  },

  randomContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },

  random: {
    backgroundColor: '#999',
    width: 100,
    marginHorizontal: 15,
    marginVertical: 25,
    fontSize: 35,
    textAlign: 'center',
  },

  STATUS_PLAYING: {
    backgroundColor: '#bbb'
  },

  STATUS_WON: {
    backgroundColor: 'green'
  },

  STATUS_LOST: {
    backgroundColor: 'red'
  }
});

export default Game;