import React, { Component } from 'react';
import axios from 'axios';

class AddStamp extends Component {

    ctx = null;
    isDraw = false;
    currP = null;
    width = '3';
    color = '#000000';


    componentDidMount() {
        this.ctx = this.canvas.getContext('2d');
        this.handleClearCanvas();
    }
    


    handleClearCanvas = (e) => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.ctx.font = "17px Arial";
        let isfor = '';
        if(this.props.isfor === 'sign')
            isfor = '사인';
        else if(this.props.isfor === 'stamp')
            isfor = '도장';
        this.ctx.fillText(isfor + " 이미지를 업로드해주세요.", 40, 170);
        this.wasClicked = false;
    }

    saveImage = (e) => { // save to localStorage
        this.filterImg();    
        
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

    filterImg = () => {
        // imageData를 가져온다.
        var pixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
        // image processing
        // var filteredData = invertFilter(pixels);
        var filteredData = this.evicRed(pixels);
    
        // Canvas에 다시 그린다.
        this.ctx.putImageData(filteredData, 0, 0);
    }

    evicRed(pixels) {
        var d = pixels.data;
    
        for (var i = 0; i < pixels.data.length; i += 4) {
    
            if (d[i] > 240 && d[i + 1] > 240 && d[i + 2] > 240) {
                d[i + 3] = 0; // Alpha 투명처리
            } else {
    
                if (!(d[i] > 150 && d[i + 1] < 150 && d[i + 2] < 150)) {
                    d[i + 3] = 0; // Alpha 투명처리
                }
            }
        }
        return pixels;
    }

    handleChange = (e) => {
        var file = e.target.files[0];
        var fileReader = new FileReader();
    
        fileReader.onload = (e) => {
            var image = new Image();
            image.src = e.target.result;
            image.onload = () => {
                this.drawImageData(image);
            }
        };
    
        fileReader.readAsDataURL(file);
    }

    drawImageData = (image) => {
        const drawCanvas = this.canvas;
        image.height *= drawCanvas.offsetWidth / image.width;
        image.width = drawCanvas.offsetWidth;
        
        if(image.height > drawCanvas.offsetHeight){
            image.width *= drawCanvas.offsetHeight / image.height;
            image.height = drawCanvas.offsetHeight;
        }

        this.ctx.drawImage(image, 0, 0, image.width, image.height);
        console.log(this.ctx.getImageData(0,0, drawCanvas.width, drawCanvas.height));
    }

    
    render() {
        const canvas_style = {
            border: '1px solid #000000',
        }
        return (
            <div>
                <div align="center">
                    <canvas 
                        ref={ref => this.canvas = ref}
                        width="320" 
                        height="320" 
                        style={canvas_style}
                    >Canvas not supported</canvas>
	            </div>
                <div align="center">
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={this.handleChange} 
                    />
                    <button 
                        id="btnSave"
                        onClick={this.saveImage}
                    >저장</button>
                </div>
            </div>
        );
    }
}

export default AddStamp;