import React, {PureComponent} from "react";
import {BaseComponentProps} from "../BaseComponent";
import {Icon} from "./Icon";

export interface RateProps extends BaseComponentProps {
    score: number;
    onScore?: (score: number) => void;
}

export class Rate extends PureComponent<RateProps, null> {
    private static Count = 5;

    private getStar(index: number, className: string, asInput?: boolean) {
        return asInput ? <Icon name={className} key={index} onClick={() => this.onChange(index)}/> :
            <Icon key={index} name={className}/>;
    }

    private renderScore(score: number, asInput?: boolean) {
        if (score > Rate.Count) score = Rate.Count;
        else if (score < 0) score = 0;
        let stars = [];
        let counter = 1;
        // filled stars
        for (let filled = Math.floor(score); counter <= filled; counter++) {
            stars.push(this.getStar(counter, 'star-full', asInput));
        }
        // score is decimal
        if (score % 1 != 0) {
            stars.push(this.getStar(counter++, 'star-half', asInput));
        }
        // rest empty stars
        while (counter <= Rate.Count) {
            stars.push(this.getStar(counter++, 'star', asInput));
        }
        return stars;
    }

    private onChange = (score: number) => {
        // this.setState({score});
        this.props.onScore(score);
    }

    public render() {
        const {score, onScore} = this.props;
        let stars = onScore ? this.renderScore(score, true) : this.renderScore(score);

        return (
            <div className="rate-component">
                {stars}
            </div>
        )
    }
}