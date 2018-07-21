import React, { PureComponent } from "react";
import { IBaseComponentProps } from "../BaseComponent";
import { launchLink } from "../../util/Util";

export interface ISliderItem {
    background?: string;
    image?: string | File;
    link?: string;
    title?: string;
}

export interface ISliderProps extends IBaseComponentProps {
    items: Array<ISliderItem>;
    interval?: number;
    rotate?: boolean;
    showBullets?: boolean;
    render?: (item: ISliderItem, index: number) => any;
    onChange?: (index: number) => void;
}

export class Slider extends PureComponent<ISliderProps, null> {
    private sliderWrapper: HTMLDivElement;
    private animationDirection: string = "";
    private touchStartPosition;
    private currentIndex = 0;
    private intervalTimer;

    public componentDidMount() {
        this.startInterval();
    }

    public componentWillReceiveProps(newProps: ISliderProps) {
        this.startInterval();
    }

    public componentWillUnmount() {
        this.stopInterval();
    }

    public render() {
        const { items, showBullets, render, children } = this.props;
        const slides = [];
        const bullets = [];
        for (let i = 0, il = items.length; i < il; ++i) {
            slides.push(render ? render(items[i], i) : this.renderItem(items[i], i));
            if (showBullets) {
                bullets.push(this.renderBullet(i));
            }
        }

        return (
            <div className={`slider-component slide-right ${showBullets ? "" : "no-bullets"}`}
                ref={(el) => this.sliderWrapper = el}>
                <div className="prev-btn" onClick={this.onPrev} onTouchEnd={this.onTouchEnd}
                    onTouchStart={this.onTouchStart} />
                {slides}
                <div className="next-btn" onClick={this.onNext} onTouchEnd={this.onTouchEnd}
                    onTouchStart={this.onTouchStart} />
                {children}
                <div className="bullets-wrapper">{bullets}</div>
            </div>
        );
    }

    private startInterval() {
        const { items, interval } = this.props;
        this.stopInterval();
        const moreThanOne = items.length && items.length > 1;
        if (interval && moreThanOne) {
            this.intervalTimer = setInterval(this.onNext, interval);
        }
    }

    private stopInterval() {
        clearInterval(this.intervalTimer);
    }

    private onSliderChange(index: number) {
        const { onChange, rotate, interval, items } = this.props;
        // animation direction
        const direction = this.currentIndex > index ? "left" : "right";
        const shouldRotate = rotate || interval;
        const maxIndex = items.length - 1;
        if (index > maxIndex) {
            index = shouldRotate ? 0 : maxIndex;
        } else if (index < 0) {
            index = shouldRotate ? maxIndex : 0;
        }
        // no need to change
        if (index == this.currentIndex) { return; }
        this.currentIndex = index;
        if (direction != this.animationDirection) {
            this.sliderWrapper.classList.remove(`slide-${this.animationDirection}`);
            this.animationDirection = direction;
            this.sliderWrapper.classList.add(`slide-${this.animationDirection}`);
        }
        // waiting for direction to take place
        setTimeout(() => {
            // hide prev image
            const prevImage = this.sliderWrapper.querySelector(".slider-item.visible");
            if (prevImage) {
                prevImage.classList.add("leave");
                setTimeout(() => {
                    prevImage.classList.remove("visible");
                    prevImage.classList.remove("leave");
                }, 310); // slider.scss $slider-transition-duration
            }
            // show new image
            const selectedImage = this.sliderWrapper.querySelector(`.slider-item[data-item="${this.currentIndex}"]`);
            if (selectedImage) {
                selectedImage.classList.add("visible");
            }
            // change bullet
            if (!this.props.showBullets) { return; }
            const prevBullet = document.querySelector(`.bullet.selected`);
            if (prevBullet) {
                prevBullet.classList.remove("selected");
            }
            const selectedBullet = document.querySelector(`.bullet[data-item="${this.currentIndex}"]`);
            if (selectedBullet) {
                selectedBullet.classList.add("selected");
            }
            if (onChange) {
                onChange(index);
            }
        }, 30);
    }

    private onTouchStart = (event) => {
        event.stopPropagation();
        this.touchStartPosition = event.touches[0].clientX;
        this.stopInterval();
    }

    private onTouchEnd = (event) => {
        const onDragEnd = event.changedTouches[0].clientX;
        event.stopPropagation();
        const diff = onDragEnd - this.touchStartPosition;
        if (!diff) { return; }
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
        const index = +e.currentTarget.getAttribute("data-item");
        if (!isNaN(index)) {
            this.onSliderChange(index);
        }
    }

    private onItemClick = (e) => {
        const index = +e.currentTarget.getAttribute("data-item");
        const item = this.props.items[index];
        if (!item || !item.link) { return; }
        launchLink(item.link);
    }

    private renderItem(item: ISliderItem, i: number) {
        const className = `slider-item ${i ? "" : "visible"}`;
        const style = { background: item.background };
        return (item.background ?
            <div className={className} key={i} data-item={i} onClick={this.onItemClick} style={style} /> :
            <img className={className} key={i} data-item={i} onClick={this.onItemClick} src={item.image as string} />
        );
    }

    private renderBullet(index: number) {
        const className = `bullet ${index ? "" : "selected"}`;
        return (
            <span key={index} data-item={index} className={className} onClick={this.onBulletClick} />
        );
    }
}
