import React from "react";
import ReactAvatarEditor from "react-avatar-editor";
import { NavigationContext } from '@react-navigation/native';
import { TouchableOpacity, Text, View, Button, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UploadImage extends React.Component {
    static contextType = NavigationContext;

    constructor(props) {
        super(props);
        this.state = {
            image: "",
            allowZoomOut: false,
            position: { x: 0.5, y: 0.5 },
            scale: 1,
            rotate: 0,
            borderRadius: 50,
            preview: null,
            width: 330,
            height: 330,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleNewImage = (e) => {
        this.setState({ image: e.target.files[0] });
    };

    handleScale = (e) => {
        const scale = parseFloat(e.target.value);
        this.setState({ scale });
    };

    handlePositionChange = (position) => {
        this.setState({ position });
    };

    setEditorRef = (editor) => (this.editor = editor);

    async handleSubmit(e) {
        if (this.editor) {
            const img = this.editor.getImageScaledToCanvas().toDataURL();
            try {
                await AsyncStorage.setItem('userImage', img);
                const navigation = this.context;
                navigation.navigate('Home');
            } catch (error) {
                console.error('Error saving image', error);
            }
        }
    }

    render() {
        const navigation = this.context;
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.editorWrapper}>
                    <ReactAvatarEditor
                        ref={this.setEditorRef}
                        scale={parseFloat(this.state.scale)}
                        width={this.state.width}
                        height={this.state.height}
                        position={this.state.position}
                        onPositionChange={this.handlePositionChange}
                        rotate={parseFloat(this.state.rotate)}
                        borderRadius={this.state.width / (100 / this.state.borderRadius)}
                        image={this.state.image}
                        color={[255, 255, 255, 0.6]}
                        className="editor-canvas"
                    />
                </View>
                <TouchableOpacity style={styles.uploadLabel}>
                    <input
                        style={styles.hiddenInput}
                        name="upload-img-input"
                        type="file"
                        onChange={this.handleNewImage}
                    />
                    <Text style={styles.uploadLabelText}>Upload Photo</Text>
                </TouchableOpacity>
                <View style={styles.zoomControl}>
                    <Text style={styles.zoomControlText}>Zoom</Text>
                    <input
                        name="scale"
                        type="range"
                        onChange={this.handleScale}
                        min={this.state.allowZoomOut ? "0.1" : "1"}
                        max="2"
                        step="0.01"
                        defaultValue="1"
                        style={styles.zoomControlInput}
                    />
                </View>
                <Button
                    title="SUBMIT"
                    color="#007bff"
                    onPress={this.handleSubmit}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    editorWrapper: {
        marginBottom: 20,
    },
    uploadLabel: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        cursor: 'pointer',
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    hiddenInput: {
        display: 'none',
    },
    uploadLabelText: {
        color: '#FFF',
        textDecorationLine: 'none',
    },
    zoomControl: {
        marginBottom: 20,
        width: '100%',
        textAlign: 'center',
    },
    zoomControlText: {
        marginBottom: 10,
    },
    zoomControlInput: {
        width: '80%',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
});

export default UploadImage;
