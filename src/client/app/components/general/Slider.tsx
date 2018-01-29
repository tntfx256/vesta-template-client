import React, {PureComponent} from "react";
import {BaseComponentProps} from "../BaseComponent";

export interface SliderItem {
    image?: string | File;
    background?: string;
    title?: string;
}

export interface SliderProps extends BaseComponentProps {
    items: Array<SliderItem>;
    interval?: number;
    rotate?: boolean;
    showBullets?: boolean;
    render?: (item: SliderItem, index: number) => any;
    onChange?: (index: number) => void;
}

export class Slider extends PureComponent<SliderProps, null> {
    private sliderWrapper: HTMLDivElement;
    private animationDirection: string = '';
    private touchStartPosition;
    private currentIndex = 0;
    private intervalTimer;

    public componentDidMount() {
        this.startInterval();
    }

    public componentWillReceiveProps(newProps: SliderProps) {
        this.startInterval();
    }

    public componentWillUnmount() {
        this.stopInterval();
    }

    private startInterval() {
        const {items, interval} = this.props;
        this.stopInterval();
        let moreThanOne = items.length && items.length > 1;
        if (interval && moreThanOne) {
            this.intervalTimer = setInterval(this.onNext, interval);
        }
    }

    private stopInterval() {
        clearInterval(this.intervalTimer);
    }

    private onSliderChange(index: number) {
        const {onChange, rotate, interval, items} = this.props;
        // animation direction
        const direction = this.currentIndex > index ? 'left' : 'right';
        const shouldRotate = rotate || interval;
        const maxIndex = items.length - 1;
        if (index > maxIndex) {
            index = shouldRotate ? 0 : maxIndex;
        } else if (index < 0) {
            index = shouldRotate ? maxIndex : 0;
        }
        // no need to change
        if (index == this.currentIndex) return;
        this.currentIndex = index;
        if (direction != this.animationDirection) {
            this.sliderWrapper.classList.remove(`slide-${this.animationDirection}`);
            this.animationDirection = direction;
            this.sliderWrapper.classList.add(`slide-${this.animationDirection}`);
        }
        // waiting for direction to take place
        setTimeout(() => {
            // hide prev image
            let prevImage = this.sliderWrapper.querySelector('.slider-item.visible');
            if (prevImage) {
                prevImage.classList.add('leave');
                setTimeout(() => {
                    prevImage.classList.remove('visible');
                    prevImage.classList.remove('leave');
                }, 310);// slider.scss $slider-transition-duration
            }
            // show new image
            let selectedImage = this.sliderWrapper.querySelector(`.slider-item[data-item="${this.currentIndex}"]`);
            selectedImage && selectedImage.classList.add('visible');
            // change bullet
            if (!this.props.showBullets) return;
            let prevBullet = document.querySelector(`.bullet.selected`);
            prevBullet && prevBullet.classList.remove('selected');
            let selectedBullet = document.querySelector(`.bullet[data-item="${this.currentIndex}"]`);
            selectedBullet && selectedBullet.classList.add('selected');
            onChange && onChange(index);
        }, 30);
    }

    private onTouchStart = (event) => {
        event.stopPropagation();
        this.touchStartPosition = event.touches[0].clientX;
        this.stopInterval();
    }

    private onTouchEnd = (event) => {
        let onDragEnd = event.changedTouches[0].clientX;
        event.stopPropagation();
        let diff = onDragEnd - this.touchStartPosition;
        if (!diff) return;
        this.onSliderChange(this.currentIndex + (diff < 0 ? 1 : -1));
        this.startInterval();
    }

    private onNext = () => {
        this.onSliderChange(this.currentIndex + 1);
    }

    private onPrev = () => {
        this.onSliderChange(this.currentIndex - 1);
    }

    private onBulletClick = (e) => {
        let index = +e.currentTarget.getAttribute('data-item');
        if (!isNaN(index)) {
            this.onSliderChange(index);
        }
    }

    private renderItem(item: SliderItem, i: number) {
        let className = `slider-item ${i ? '' : 'visible'}`;
        return (item.background ?
                <div className={className} key={i} data-item={i} style={{background: item.background}}/> :
                <img className={className} key={i} data-item={i} src={item.image as string}/>
        )
    }

    private renderBullet(index: number) {
        let className = `bullet ${index ? '' : 'selected'}`;
        return (
            <span key={index} data-item={index} className={className} onClick={this.onBulletClick}/>
        )
    }

    public render() {
        let {items, showBullets, render, children} = this.props;
        let slides = [];
        let bullets = [];
        for (let i = 0, il = items.length; i < il; ++i) {
            slides.push(render ? render(items[i], i) : this.renderItem(items[i], i));
            showBullets && bullets.push(this.renderBullet(i));
        }

        return (
            <div className={`slider-component slide-right ${showBullets ? '' : 'no-bullets'}`}
                 ref={el => this.sliderWrapper = el}>
                <div className="prev-btn" onClick={this.onPrev} onTouchEnd={this.onTouchEnd}
                     onTouchStart={this.onTouchStart}/>
                {slides}
                <div className="next-btn" onClick={this.onNext} onTouchEnd={this.onTouchEnd}
                     onTouchStart={this.onTouchStart}/>
                {children}
                <div className="bullets-wrapper">{bullets}</div>
            </div>
        )
    }
}
