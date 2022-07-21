import axios from 'axios'

const instance = axios.create({
    baseURL:"https://instagram-clone-30.herokuapp.com/"
});

export default instance;