import React, { Component } from 'react';
import { View,ToastAndroid } from 'react-native';
import { WebView } from 'react-native-webview';

import Modal from "react-native-modal";

WebView.isFileUploadSupported().then(res => {
    if (res === true) {
        // File upload is supported
        ToastAndroid.show('File upload is supported', ToastAndroid.LONG);
    } else {
        // File upload is not support
        ToastAndroid.show('File upload is NOT support', ToastAndroid.LONG);
    }
});

export default class App extends Component {
    _webview = null;


    state = {
        isModalVisible: true
    };

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };

    //ToastAndroid.show('A pikachu appeared nearby !', ToastAndroid.SHORT);
    //ToastAndroid.show('A pikachu appeared nearby !', ToastAndroid.LONG);

    //render() {
    //    return (
    //        <View style={{ flex: 1 }}>
    //            <Button title="Show modal" onPress={this.toggleModal} />
    //            <Modal isVisible={this.state.isModalVisible}>
    //                <View style={{ flex: 1 }}>
    //                    <Text>Hello!</Text>
    //                    <Button title="Hide modal" onPress={this.toggleModal} />
    //                </View>
    //            </Modal>
    //        </View>
    //    );
    //}

    fn_onListenerMessageFromUI = (event) => {
        ToastAndroid.show('UI->RN: ' + event.data, ToastAndroid.SHORT);
        this._webview.injectJavaScript('alert("RN->UI: ' + event.data + '")');
    }

    render() {

        const runFirst = `
          document.body.style.backgroundColor = 'red';
          setTimeout(function() { window.alert('hi') }, 2000);
          true; // note: this is required, or you'll sometimes get silent failures
        `;

        const run = `
          document.body.style.backgroundColor = 'blue';
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

                    source={{ uri: 'http://192.168.0.101/' }}/>
            </View>
        )
    }
}