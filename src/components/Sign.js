import React, { Component } from 'react';
import axios from 'axios';

class Sign extends Component {

    handleDelete = (e) => {
        if(!window.confirm('삭제하시겠습니까?')) {
            return;
        }	

        const { sign } = this.props;
        this.props.delSign(sign.signId);
    }

    render() {
        const style = {
            width: '200px',
            border: 'solid',
            margin: '10px',
        }
        const { sign } = this.props;
        const src = 'data:image/png;base64,' + sign.encImg;

        

        return (
            <span>
                <img
                    alt="sign"
                    style={style}
                    src={src}
                    id={sign.signId}
                />
                <button onClick={this.handleDelete}>X</button>
            </span>
        );
    }
}

export default Sign;