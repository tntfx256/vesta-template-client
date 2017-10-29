import React from "react";
import {PageComponent, PageComponentState} from "../PageComponent";
import {BaseComponentProps} from "../BaseComponent";

export enum AdvStatus {Enable = 1, Disable}

export interface ISliderItem {
    id?: number;
    title?: string;
    image?: string | File;
    link?: string;
    status?: AdvStatus;
}

export interface SliderProps extends BaseComponentProps {
    images: Array<ISliderItem>;
}

export interface SliderState extends PageComponentState {
    onDragStart: number;
    next: number;
    prev: number;
}

export class Slider extends PageComponent<SliderProps, SliderState> {

    private total;

    constructor(props: SliderProps) {
        super(props);
        this.state = {onDragStart: 0, next: 1, prev: 0}
    }

    changeImage(item) {
        // hiding all images
        let images = document.querySelectorAll(`.slides-container img`);

        for (let i = 0; i < images.length; i++) {
            images[i].classList.remove('show-image');
            images[i].classList.add('hide-image');
        }

        // show selected image
        let selectedImage = document.querySelector(`.slides-container [data-item="${item}"]`);
        selectedImage.classList.remove('hide-image');
        selectedImage.classList.add('show-image');
    }

    changeBullet(item) {
        // make all bullets background transparent
        let bullets = document.querySelectorAll(`.bullets-container span`);

        for (let i = 0; i < bullets.length; i++) {
            bullets[i].classList.remove('bullet-selected');
            bullets[i].classList.add('bullet-deselected');
        }

        let selectedBullet = document.querySelector(`.bullets-container [data-item="${item}"]`);
        selectedBullet.classList.remove('bullet-deselected');
        selectedBullet.classList.add('bullet-selected');
    }

    onSliderChange = (event) => {
        let selectedItem = isNaN(event) ? +event.target.getAttribute('data-item') : +event;

        // setting next
        if(selectedItem + 1 > this.total) {
            this.setState({next: 0});
        } else {
            this.setState({next: this.state.next + 1});
        }

        // setting previous
        if(selectedItem - 1 < 0) {
            this.setState({prev: this.total});
        } else {
            this.setState({prev: selectedItem - 1});
        }

        this.changeImage(selectedItem);
        this.changeBullet(selectedItem);
    }

    onDragStart = (event) => {
        this.setState({onDragStart: event.clientX});
    }

    onDragEnd = (event) => {
        let onDragEnd = event.clientX;
        let diff = onDragEnd - this.state.onDragStart;

        if(diff < 0) {
            // next image
            this.onSliderChange(this.state.next);
        } else {
            // prev image
            this.onSliderChange(this.state.prev);
        }

    }

    public render() {
        let {images} = this.props;

        this.total = images.length - 1;

        let slides = [];
        let bullets = [];

        images.map((image, index) => {
            let imageClass = index == 0 ? 'slider-image show-image' : 'slider-image';
            slides.push(<img key={index} draggable={true} onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}
                             data-item={index} className={imageClass} src={image.image as string} alt={image.title}/>)

            let className = index == 0 ? 'bullet bullet-selected' : 'bullet';
            bullets.push(<span key={index} data-item={index} className={className} onClick={this.onSliderChange}></span>);
        });

        return (
            <div className="slider-component">
                <div className="slides-container">{slides}</div>
                <div className="bullets-container">{bullets}</div>
            </div>
        )
    }
}
