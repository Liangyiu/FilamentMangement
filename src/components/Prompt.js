import React from 'react';
import { View, Text, Modal, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';

function Prompt(props, ref) {
    const { onCancelPress } = props;
    const [_visible, _setVisible] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const animValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (ref) {
            ref.current = {
                setVisible: _setVisible,
            };
        }
    }, [ref]);

    React.useEffect(() => {
        if (_visible) {
            setVisible(true);
            Animated.timing(animValue, {
                duration: 300,
                toValue: 1,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(animValue, {
                duration: 300,
                toValue: 0,
                useNativeDriver: true,
            }).start(() => {
                setVisible(false);
            });
        }
    }, [_visible, animValue]);

    const backdropAnimStyle = {
        opacity: animValue,
    };

    const promptAnimeStyle = {
        transform: [
            {
                translateY: animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [500, 0],
                }),
            },
        ],
    };

    return (
        <Modal visible={visible} transparent={true}>
            <View style={styles.content}>
                <Animated.View style={[styles.backdrop, StyleSheet.absoluteFill, backdropAnimStyle]} />

                <Animated.View style={[styles.prompt, promptAnimeStyle]}>
                    <Text style={styles.hint}>{'Waiting for scan...'}</Text>

                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => {
                            _setVisible(false);
                            onCancelPress();
                        }}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    backdrop: {
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    prompt: {
        position: 'absolute',
        bottom: 0,
        left: 20,
        width: Dimensions.get('window').width - 2 * 20,
        backgroundColor: 'black',
        borderRadius: 8,
        paddingVertical: 60,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
    },
    hint: {
        fontSize: 24,
        marginBottom: 20,
    },
    btn: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 15,
    },
});

export default React.forwardRef(Prompt);
