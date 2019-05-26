import React, { Component } from 'react';
import { Text, Button, View, ToastAndroid } from 'react-native';

import { WebView } from 'react-native-webview';
import Modal from "react-native-modal";
import { TextField } from 'react-native-material-textfield';
import DateTimePicker from "react-native-modal-datetime-picker";

WebView.isFileUploadSupported().then(res => {
    if (res === true) {
        // File upload is supported
        ToastAndroid.show('File upload is supported', ToastAndroid.LONG);
    } else {
        // File upload is not support
        ToastAndroid.show('File upload is NOT support', ToastAndroid.LONG);
        //ToastAndroid.show('A pikachu appeared nearby !', ToastAndroid.SHORT);
    }
});

export default class App extends Component {
    constructor(props) {
        super(props);

        _webview = null;

        this.state = {
            isDateTimePickerVisible: false,
            isModalVisible: false,
            phone: '',
        };
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };

    fn_onListenerMessageFromUI = (event) => {
        let data = event.data;

        if (data == 'POPUP') {
            this.toggleModal();
        } else {
            ToastAndroid.show('UI->RN: ' + data, ToastAndroid.SHORT);
            this._webview.injectJavaScript('alert("RN->UI: ' + data + '")');
        }
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        console.log("A date has been picked: ", date);
        ToastAndroid.show('SELECT_DATE: ' + String(date), ToastAndroid.SHORT);
        this.hideDateTimePicker();
    };


    render() {
        let { phone } = this.state;

        const runFirst = `
          document.body.style.backgroundColor = 'red';
          setTimeout(function() { window.alert('hi') }, 2000);
          true; // note: this is required, or you'll sometimes get silent failures
        `;

        const run = `
          document.body.style.backgroundColor = 'orange';
          true;
        `;

        setTimeout(() => {
            this._webview.injectJavaScript(run);
        }, 3000);

        return (
            <View style={{ flex: 1 }}>
                <WebView
                    cacheEnabled={false}
                    allowFileAccess={true} //Android
                    allowsFullscreenVideo={true} //Android
                    //originWhitelist={['*']}
                    //source={{ html: '<h1>Hello world</h1>' }}

                    //injectedJavaScript={runFirst}
                    ref={r => (this._webview = r)}
                    onMessage={event => { this.fn_onListenerMessageFromUI(event.nativeEvent) }}

                    source={{ uri: 'http://192.168.0.101/' }}
                />
                <Modal
                    isVisible={this.state.isModalVisible}
                    backdropColor={'white'}
                    backdropOpacity={1}
                    style={{ margin: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text>Hello!</Text>
                        <Button title="Show DatePicker" onPress={this.showDateTimePicker} />
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this.handleDatePicked}
                            onCancel={this.hideDateTimePicker}
                        />
                        <TextField
                            label='Phone number'
                            value={phone}
                            onChangeText={(phone) => this.setState({ phone })}
                        />


                        <Button title="Hide modal" onPress={this.toggleModal} />
                    </View>
                </Modal>
            </View>
        )
    }
}