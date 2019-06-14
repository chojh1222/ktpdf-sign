import React, { Component } from 'react';
import axios from 'axios';

class AddSign extends Component {

    ctx = null;
    isDraw = false;
    currP = null;
    width = '3';
    color = '#000000';
    wasClicked = false;

    handleMouseDown = (e) => {
        if (e.button===0) {
            if(!this.wasClicked) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.wasClicked = true;
            }
            e.preventDefault();
            this.ctx.beginPath();
            this.isDraw = true;
        }
    }

    componentDidMount() {
        this.ctx = this.canvas.getContext('2d');
        this.handleClearCanvas();
    }
    

    handleMouseMove = (e) => {
        var event = e.nativeEvent;
        e.preventDefault();
        this.currP = { X:event.offsetX, Y:event.offsetY };
        if(this.isDraw) this.draw_line(this.currP);
    }
    
    // 선 그리기
    draw_line = (p) => {
        this.ctx.lineWidth = this.width;
        this.ctx.lineCap = 'round';
        this.ctx.lineTo(p.X, p.Y);
        this.ctx.moveTo(p.X, p.Y);
        this.ctx.strokeStyle = this.color;
        this.ctx.stroke();
    }

    handleMouseUp = (e) => {
        e.preventDefault();
        this.isDraw = false;
    }

    handleMouseLeave = (e) => {
        this.isDraw = false;
    }

    handleTouchStart = (e) => {
        if(!this.wasClicked) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.wasClicked = true;
        }
        e.preventDefault();
		this.ctx.beginPath();
    }

    handleTouchMove = (e) => {
        const event = e.originalEvent;
        e.preventDefault();
        this.currP = { X:event.touches[0].pageX - this.canvas.offsetLeft
                     , Y:event.touches[0].pageY - this.canvas.offsetTop };
        this.draw_line(this.currP);
    }

    handleTouchEnd = (e) => {
        e.preventDefault();
    }

    handleClearCanvas = (e) => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.ctx.font = "17px Arial";
        this.ctx.fillText("사인을 그려주세요.", 70, 170);
        this.wasClicked = false;
    }

    saveImage = (e) => { // save to localStorage
			
        const canvas = this.canvas;
        localStorage.setItem('imgCanvas', canvas.toDataURL('image/png'));

        const form = new FormData();
        form.append('data', canvas.toDataURL('image/png'));

        axios.post('http://localhost:8080/uploadsign', form)
        .then(response => {
            alert('저장되었습니다');
            this.handleClearCanvas();
            this.props.closeModal();
        })
        .catch(error => {
            alert( "Request failed: " + error );
        });
    }


    
    render() {
        const canvas_style = {
            border: '1px solid #000000',
        }
        const span_style = {
            padding: '5px',
        }
        return (
            <div>
                <div align="center">
                    <canvas 
                        ref={ref => this.canvas = ref}
                        width="320" 
                        height="320" 
                        style={canvas_style}
                        onMouseDown={this.handleMouseDown}
                        onMouseMove={this.handleMouseMove}
                        onMouseUp={this.handleMouseUp}
                        onMouseLeave={this.handleMouseLeave}
                        onTouchStart={this.handleTouchStart}
                        onTouchMove={this.handleTouchMove}
                        onTouchEnd={this.handleTouchEnd}
                    >Canvas not supported</canvas>
	            </div>
                <div align="center">
                    <button 
                        id="btnClea"
                        onClick={this.handleClearCanvas}
                    >Clear</button>
                    <button 
                        id="btnSave"
                        onClick={this.saveImage}
                    >저장</button>
                </div>
            </div>
        );
    }
}

export default AddSign;