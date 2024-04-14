import axios, { AxiosResponse } from "axios";


axios.defaults.baseURL='https://localhost:7248/';
axios.defaults.withCredentials=true;

const responseBody = (response: AxiosResponse)=> response.data;


const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body : object) => axios.post(url, body).then(responseBody),
    put: (url: string, body : object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
}

const Home = {
    list: () => requests.get('/GetMovies'),
    addMovie: (title : string, description :string) => requests.post(`createmovie/${title}/${description}`,{}),
    getMovie: (id : string) => requests.get(`GetMovie/${id}`),
    getReviews: (id : string) => requests.get(`GetReviews/${id}`),
    getReview: (id : string) => requests.get(`GetReview/${id}`),
    addReview: (text : string, authorID : string, movieID :string, rating : number) => requests.post(`CreateReview/${text}/${authorID}/${movieID}/${rating}`,{}),
}





const agent = {
Home
}

export default agent;