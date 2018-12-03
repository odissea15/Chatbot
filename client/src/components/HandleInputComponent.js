// this is the react component that will be shown and also send the question to the backend
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import { Loading } from 'react-simple-chatbot';

const config = {
    apiKey: "AIzaSyBxjacU5G1EF4UC82N_JJSbrXcTLh9OT6Q",
    authDomain: "prototype-624d5.firebaseapp.com",
    databaseURL: "https://prototype-624d5.firebaseio.com",
    projectId: "prototype-624d5",
    storageBucket: "prototype-624d5.appspot.com",
    messagingSenderId: "156087064273"
};
firebase.initializeApp(config);

class HandleInputComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            result: '',
            trigger: false
        };

        this.triggerNext = this.triggerNext.bind(this);
    }

    componentDidMount() {
        const self = this;
        const {steps} = this.props;
        const query = steps.input.value; // this is the value that the user gave aka their query string

        let message = firebase.functions().httpsCallable('message');
        message({
            query: query
        }).then((result) => {
            let status = result.data.status;
            let response = result.data.resp;
            if (status === 200) {
                self.setState({loading: false, result: response});
            } else if (status === 400) {
                // this is where shit gets changed on the frontend to prompt the user to ask again since the question was not understood
                self.setState({loading: false, result: 'A fatal error has occured.'});
            } else if (status === 500) {
                self.setState({loading: false, result: 'A fatal error has occured.'});
                // this is where no intent was matched i.e. the agent has not been been taught this
            }
        });

    }

    triggerNext() {
        this.setState({trigger: true}, () => {
            this.props.triggerNextStep();
        });
    }

    render() {
        const {trigger, loading, result} = this.state;

        return (
                <div className="handleinputcomponent">
                    {loading ? <Loading/> : result}
                    {
                        !loading &&
                        <div
                            style={{
                                textAlign: 'center',
                                marginTop: 20,
                            }}
                        >
                            {
                                !trigger &&
                                <button
                                    onClick={() => this.triggerNext()}
                                >
                                    Did this answer your query?
                                </button>
                            }
                        </div>
                    }
                </div>
        );
    }
}

HandleInputComponent.propTypes = {
    steps: PropTypes.object,
    triggerNextStep: PropTypes.func
};

HandleInputComponent.defaultProps = {
    steps: undefined,
    triggerNextStep: undefined,
};

export default HandleInputComponent;
