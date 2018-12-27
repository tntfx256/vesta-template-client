import { Modal } from "@vesta/components";
import React, { Component, ErrorInfo } from "react";

interface IErrorBoundaryProps { }

interface IErrorBoundaryState {
    error?: Error;
    info?: ErrorInfo;
}

export class ErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    public componentDidCatch(error, info) {
        this.setState({ error, info });
    }

    render() {
        const { error, info } = this.state;
        if (!error) {
            return this.props.children;
        }
        const message = error.stack.split(/\n/).shift();
        const stack = info.componentStack.split(/\n/);
        const stackList = stack.map((m, i) => <li key={i}>{m}</li>);

        return (
            <Modal className="error-boundary" animation="modal-zoom" show={true}>
                <h1 className="error-title">An unhandled error occured</h1>
                <h3 className="error-message">{message}</h3>
                <ul className="error-stack">{stackList}</ul>
            </Modal>
        );

    }
}