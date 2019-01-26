import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Loading, Header, HeaderTitle, HeaderIcon } from 'react-simple-chatbot';
import App from './App'

class TextToSpeech extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            result: '',
            trigger: false
        };

        this.triggerNext = this.triggerNext.bind(this);
    }
};

export default TextToSpeech;