import axios, { AxiosResponse } from "axios";


axios.defaults.baseURL='https://localhost:7248/';
axios.defaults.withCredentials=true;

const responseBody = (response: AxiosResponse)=> response.data;


axios.interceptors.request.use(config => {
    const token = localStorage.getItem('Token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config
})

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
    login: (username : string, password : string) => requests.post(`Login/${username}/${password}`,{}),
    getCurrentUser: () => requests.get(`getcurrentuser`),
    register: (username : string, password : string, role : boolean) => requests.post(`CreateUser/${username}/${password}/${role}`,{}),
    getVotes: (reviewId : string, authorID:string) => requests.get(`GetUpDownvotes/${reviewId}/${authorID}`),
    addUpvote: (authorID : string,reviewId:string, number : number) => requests.post(`AddUpvote/${authorID}/${reviewId}/${number}`, {}),
    addDownvote: (authorID : string, reviewId:string, number : number) => requests.post(`AddDownvote/${authorID}/${reviewId}/${number}`, {})
}





const agent = {
Home
}

export default agent;