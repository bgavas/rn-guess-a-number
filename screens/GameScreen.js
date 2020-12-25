import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import NumberContainer from '../components/NumberContainer';
import Card from '../components/Card';

const generateRandomBetween = (min, max, exclude) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const number = Math.floor(Math.random() * (max - min) + min);
    if (number === exclude) {
        return generateRandomBetween(min, max, exclude);
    } else {
        return number;
    }
}

const GameScreen = (props) => {
    const { userChoice, onGameOver } = props;

    const [currentGuess, setCurrentGuess] = useState(generateRandomBetween(1, 100, userChoice));
    const [rounds, setRounds] = useState(0);
    const currentLow = useRef(1);
    const currentHigh = useRef(100);

    useEffect(() => {
        if (currentGuess === userChoice) {
            onGameOver(rounds);
        }
    }, [currentGuess, userChoice, onGameOver]);

    const nextGuessHandler = (direction) => {
        if (
            (direction === 'lower' && currentGuess < userChoice) || 
            (direction === 'greater' && currentGuess > userChoice)
        ) {
			Alert.alert('Don\'t lie', 'You know this is wrong', [{
				text: 'Sorry',
				style: 'cancel',
			}])
			return;
        }

        if (direction === 'lower') {
            currentHigh.current = currentGuess;
        } else if (direction === 'greater') {
            currentLow.current = currentGuess;
        }

        const nextNumber = generateRandomBetween(currentLow.current, currentHigh.current, currentGuess);
        setCurrentGuess(nextNumber);
        setRounds((currentRound) => currentRound + 1);

    }

    return (
        <View style={styles.screen}>
            <Text>Oppenent's Guess</Text>
            <NumberContainer>
                {currentGuess}
            </NumberContainer>
            <Card style={styles.buttonContainer}>
                <Button title='LOWER' onPress={() => nextGuessHandler('lower')} />
                <Button title='GREATER' onPress={() => nextGuessHandler('greater')} />
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        width: 300,
        maxWidth: '80%',
    },
});

export default GameScreen;