import React, { Component } from 'react';
import SignList from './components/SignList.js';
import axios from 'axios';
import AddSign from './components/popup/AddSign.js';
import AddStamp from './components/popup/AddStamp.js';
import Modal from 'react-modal';
import './App.css';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('#root')

class App extends Component {

  constructor() {
    super();
 
    this.state = {
      modalIsOpen: false,
      modalComponent: '',
      modalAction: '',
      signs: [],
    };
 
    this.openSignModal = this.openSignModal.bind(this);
    this.openStampModal = this.openStampModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openSignModal() {
    this.setState({
      modalIsOpen: true,
      modalComponent: 'sign',
      modalAction: 'paint'
    });
  }

  openStampModal() {
    this.setState({
      modalIsOpen: true,
      modalComponent: 'stamp',
      modalAction: 'upload'
    });
  }
 
  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }
 
  closeModal = () => {
    this.getImages();
    this.setState({
      modalIsOpen: false,
      modalComponent: '',
      modalAction: ''
    });
  }

  componentDidMount() {
    console.log('did mount!')
    this.getImages();
  }


  getImages = () => {
    axios.get('http://localhost:8888/images')
    .then(response => {
        const { data } = response;
        this.setState({
          signs: data
        })
    })
    .catch(error => {
        console.log(error);
    });
  }

  delSign = (signId) => {
    const form = new FormData();
    form.append('imgId', signId);

    axios.post('http://localhost:8888/delsign', form)
    .then(response => {
      this.getImages();
    })
    .catch(error => {
        alert( "Request failed: " + error );
    });
  }

  testFetch = () => {
    const form = new FormData();
    form.append('signId', 123);
    form.append('userId', 456);

    const form2 = {
      'arr': ["hello", "world"],
      'signId': "123",
      "userId": "456" 
    }

    axios.post('http://localhost:8888/test', form2)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
        alert( "Request failed: " + error );
    });
  }
  

  tabPaint = (e) => {
    this.tabPaintBtn.className = "selectedTab";
    this.tabUploadBtn.className = "unselectedTab";
    console.log(this.tabPaintBtn);
    console.log(this.tabUploadBtn);
    this.setState({
      modalAction: 'paint'
    })
  }

  tabUpload = (e) => {
    if(this.tabPaintBtn)
      this.tabPaintBtn.className = "unselectedTab";
    this.tabUploadBtn.className = "selectedTab";
    this.setState({
      modalAction: 'upload'
    })
  }


  render() {
    const styleRight = {
      float: 'right'
    }
    return (
      <div>
        <h1>사인 / 도장</h1>
        <button onClick={this.openSignModal}>사인추가</button>
        <button onClick={this.openStampModal}>도장추가</button>
        {/* <button onClick={this.testFetch}>테스트</button> */}
        <SignList 
          signs={this.state.signs}
          delSign={this.delSign}  
        />

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div>
            { 
              this.state.modalComponent === 'sign' && 
              <span 
                onClick={this.tabPaint} 
                ref={ref => this.tabPaintBtn = ref}
                className="selectedTab"
              >그리기</span> 
            }
            <span 
              onClick={this.tabUpload} 
              ref={ref => this.tabUploadBtn = ref}
              className={this.state.modalComponent === 'stamp' ? "selectedTab" : "unselectedTab"}
            >불러오기</span>
            <button onClick={this.closeModal} style={styleRight}>닫기</button>
          </div>
          {
            this.state.modalComponent === 'sign' && this.state.modalAction === 'paint'
              ? <AddSign closeModal={this.closeModal} />
              : <AddStamp closeModal={this.closeModal} isfor={this.state.modalComponent} />
          }
          
        </Modal>
      </div>
    );
  }
}


export default App;
