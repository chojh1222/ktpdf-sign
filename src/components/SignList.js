import React, { Component } from 'react';
import Sign from './Sign';


class SignList extends Component {

    static defaultProps = {
        signs: []
    }
    

    render() {
        const { signs, delSign } = this.props;
        const list = signs.map( 
            sign => 
                <Sign 
                    sign={sign} 
                    key={sign.signId} 
                    delSign={delSign}
                /> 
        )

        return (
            <div>
                {list}
            </div>
        );
    }
}

export default SignList;